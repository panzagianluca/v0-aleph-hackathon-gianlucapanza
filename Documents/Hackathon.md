# CID Sentinel — Plan completo (Markdown)

## 0) Contexto & Objetivo
**Objetivo:** asegurar **disponibilidad verificable** de CIDs críticos en IPFS mediante **SLO** público (≥99%), **restaking** y **slashing** ante incumplimientos; evidencias on-chain en **Lisk** y “**Evidence Packs**” en **IPFS**; **Vercel** para UI/cron.

---

## 1) /arquitectura — Diseño y plan técnico

### 1.1 Objetivo en 1 frase
Asegurar **disponibilidad verificable** de CIDs con SLO & slashing, anclado en **Lisk**, packs en **IPFS/IPLD** y orquestación **Vercel**.

### 1.2 Diagrama textual (on/off-chain)
```
[User/Publisher]
   └─ Register CID + SLO → Frontend (Next.js en Vercel)
                         ├─ Tx Lisk: EvidenceRegistry.registerCID()
                         ├─ Tx Symbiotic: Service register + restake (Plan A)
                         └─ Bond restakers → Symbiotic  (Plan A) / Contrato local (Plan B)

[Vercel Cron (cada 60s)]
   └─ Orquestador -> 2–3 Probe Workers (regiones)
        ├─ Check HTTP HEAD/GET en ≥2 gateways (ipfs.io, dweb.link, cloudflare-ipfs.com)
        ├─ (Opcional) libp2p dial (si runtime lo permite; si no, multi-gateway)
        └─ Métricas + firma watcher

   └─ Construye "Evidence Pack" (JSON + firma ed25519) → IPFS (web3.storage)
   └─ Anchor on-chain: Lisk EvidenceRegistry.reportPack(CIDDigest, packCIDDigest, status)
   └─ Si SLO roto:
          Plan A: Symbiotic.Policy.slash()
          Plan B: EvidenceRegistry.slash()

[On-chain Lisk]
   ├─ EvidenceRegistry: mapea CIDDigest → SLO, stake, lastPack, estado
   ├─ Eventos: CIDRegistered, EvidenceAnchored, BreachDetected, Slashed
   └─ Roles: publisher, restaker, policy (owner/ServiceManager)

[IPFS/Filecoin + IPLD]
   ├─ Evidence Pack (JSON) por ciclo
   └─ DAG IPLD: serie temporal de packs por CID
```

> **Plan A (preferido):** integración **Symbiotic** real (servicio + slashing).  
> **Plan B:** contrato local con semántica compatible (documentamos migración).

### 1.3 User Flow (happy path)
1. Conecta wallet → “**Register CID**” → pega **CID v1** + SLO preset (K/N, timeout, ventana).  
2. Firma tx en **Lisk** (`registerCID`).  
3. **Restakers** aportan stake (Symbiotic → Plan A | contrato local → Plan B).  
4. **Cron** ejecuta probes → genera **Evidence Packs** (IPFS) → `reportPack` en **Lisk**.  
5. Si se rompe el **SLO**, se emite `BreachDetected` y se ejecuta **`slash()`**.

### 1.4 Wireframes (texto)

**/** (Dashboard)  
- Botón **+ Register CID**  
- Tabla: `CID` (abreviado) | `Estado` (OK/Degradado/Breach) | `Último Pack` (CID link) | `Stake Total` | `SLO` | `Acciones`

**/register**  
- Inputs: `CID (string)`, `SLO preset (Estricto/Normal/Laxo)`, `Window (min)`, `K/N`, `Timeout (ms)`  
- Checkbox: **Enable Slashing**  
- Botón: **Register & Anchor (Lisk)**

**/cid/[cid]**  
- Header con CID completo + copiar + abrir en gateway  
- Badges: Estado + Uptime 24h  
- Timeline: últimos 5 **Evidence Packs** (links IPFS) + latencias  
- Card **Restake**: Bond/Withdraw, total stake, política  
- Card **SLO**: K/N, timeout, ventana, reglas de breach

### 1.5 Esquema de datos

**On-chain (Lisk)**

- `SLO { uint8 k; uint8 n; uint16 timeoutMs; uint16 windowMin; }`  
- `mapping(bytes32 cidDigest => CIDState)`  
- `CIDState { address publisher; SLO slo; uint256 totalStake; bytes32 lastPackCIDDigest; uint64 lastBreachAt; uint8 consecutiveFails; bool slashingEnabled; }`

> Guardamos **digest** (`bytes32`) del CID y del Pack CID; los **strings** completos viven en IPFS/UI.

**Evidence Pack (IPFS, JSON v1)**
```json
{
  "cid": "CIDv1",
  "ts": 1690000000,
  "windowMin": 5,
  "threshold": {"k":2, "n":3, "timeoutMs":2000},
  "probes": [
    {"vp":"us-east","method":"HTTP","gateway":"https://ipfs.io","ok":true,"latMs":420},
    {"vp":"eu-west","method":"HTTP","gateway":"https://dweb.link","ok":true,"latMs":530},
    {"vp":"sa-south","method":"HTTP","gateway":"https://cloudflare-ipfs.com","ok":false,"err":"timeout"}
  ],
  "libp2p": {"attempted": false},
  "agg": {"okCount":2,"status":"OK"},
  "watcherSig": "ed25519_base64",
  "schema":"cid-sentinel/1"
}
```

### 1.6 Stack sugerido
- **Frontend:** Next.js 14 (App Router), Tailwind, **wagmi/viem**, WalletConnect/RainbowKit.  
- **Backend:** Vercel **API Routes** + **Cron Jobs**; `axios/fetch`; (opcional) `js-libp2p`.  
- **On-chain:** Solidity (Foundry/Hardhat) **EvidenceRegistry** + (Plan A) **Symbiotic**.  
- **Storage:** IPFS vía **web3.storage** (Filecoin pinning); **IPLD** opcional v2.  
- **Indexado:** sin subgraph en v1; lectura por eventos con **viem**.  
- **Claves:** watcher ed25519 en env; rate-limit.

---

## 2) /contratos — Especificación EVM (Lisk) + seguridad

### 2.1 Interfaces (Solidity, abreviado)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct SLO {
  uint8 k;        // éxitos mínimos
  uint8 n;        // vantage total
  uint16 timeout; // ms
  uint16 window;  // min
}

struct PackRef {
  bytes32 cidDigest;     // keccak256(CID string)
  bytes32 packCIDDigest; // keccak256(pack CID)
  uint64  ts;            // epoch secs
  uint8   status;        // 0 OK, 1 DEGRADED, 2 BREACH
}

interface IEvidenceRegistry {
  event CIDRegistered(bytes32 indexed cid, address indexed publisher, SLO slo, bool slashing);
  event StakeBonded(bytes32 indexed cid, address indexed staker, uint256 amount);
  event EvidenceAnchored(bytes32 indexed cid, bytes32 indexed packCID, uint8 status);
  event BreachDetected(bytes32 indexed cid, uint64 at);
  event Slashed(bytes32 indexed cid, uint256 amount, address by);

  function registerCID(bytes32 cid, SLO calldata slo, bool slashingEnabled) external;
  function bondStake(bytes32 cid) external payable;
  function reportPack(PackRef calldata p) external; // onlyPolicy/onlyWatcher
  function slash(bytes32 cid, uint256 amount) external; // onlyPolicy
  function getCID(bytes32 cid) external view returns (SLO memory, uint256 totalStake, bytes32 lastPackCID);
}
```

> **Plan A:** `slash()` delega a **Symbiotic** (`ServiceManager.slash(...)`) y `bondStake` integra su flujo.  
> **Plan B:** `bondStake` acumula stake local; `slash()` transfiere a `publisher` o `slashingVault` con reglas documentadas.

### 2.2 Estados & reglas
- **ConsecutiveFails:** `BREACH` incrementa contador; `OK` lo resetea.  
- **Disparo de slashing:** cuando `consecutiveFails` + `ventana` superan umbral SLO.  
- **Rate-limit packs:** `ts` **monotónico** y `nonce` por CID.  
- **Digests:** `bytes32` para abaratar; strings completos en IPFS/UI.  
- **Slashing:** `min(amount, totalStake*X%)`, política configurable.

### 2.3 Invariantes
- `totalStake_after = totalStake_before + bond - slash` (no negativos).  
- `slash` sólo si `lastBreachAt` dentro de ventana activa.  
- `reportPack` no retrocede `ts` ni repite `packCIDDigest`.

### 2.4 Amenazas & mitigaciones
- **Reentrancy:** `nonReentrant`, checks-effects-interactions.  
- **Watcher trust:** packs **firmados**; `onlyPolicy/onlyWatcher` para `reportPack`.  
- **Griefing:** límites por CID/tiempo; bond mínimo; allowlist en demo.  
- **Falsos positivos:** SLO **K/N** + timeout + vantage múltiples.

### 2.5 Pruebas (Foundry/Hardhat)
- **Unit:** registrar CID, `bondStake`, `reportPack` (OK→BREACH→OK), `slash`.  
- **Propiedad:** stake nunca negativo; `ts` monotónico; `nonce` por CID.  
- **Fuzz:** `reportPack` con timestamps desordenados (debe revertir).  
- **Gas:** snapshots para funciones clave.

### 2.6 Deploy (scripts)
- `.env`: RPC Lisk testnet, `PRIVATE_KEY`, `WATCHER_PUBKEY`, `SYMBIOTIC_ADDR`.  
- Comandos: `yarn deploy:lisk:testnet` → guarda `deployments.json`; `yarn verify` si aplica.

---

## 3) UX/Frontend (Next.js)

- **Rutas:** `/`, `/register`, `/cid/[cid]`.  
- **Hooks:** `useCIDList()`, `useCIDState(cid)`, `useRestake(cid)`.  
- **Accesibilidad:** estados claros, colores daltónicos, toasts con links al explorer.  
- **Offline/fallback:** si RPC falla, UI muestra último pack desde IPFS.

---

## 4) Vercel (Edge/Cron)

- **Cron:** `*/1 * * * *` → `api/cron/probe` (5–10 CIDs máx. en demo).  
- **API:**  
  - `POST /api/registerCID`  
  - `POST /api/bond`  
  - `POST /api/simulateBreach` (sólo para demo)  
- **Runtime:** mantener checks `< 2–3s` por CID (HEAD multi-gateway + sample 512 bytes).  
- **Firmas:** `tweetnacl`/ed25519.

---

## 5) Sprint 20h — Plan de ejecución (timeboxing)

| Franja | Entregable | Dueño | Notas |
|---|---|---|---|
| 1.5h | Monorepo (apps/, contracts/, scripts/) + UI base | FE/PM | Next + wagmi, layout |
| 2h | Contrato `EvidenceRegistry` + eventos + tests base | SC | Foundry |
| 1h | Scripts deploy Lisk testnet + .env | DevOps | guardar addresses |
| 2h | IPFS (web3.storage) + builder JSON Pack | BE | firma ed25519 |
| 2h | Cron + Probe Workers (HTTP multipuerta) | BE | 2–3 vantage simulados |
| 1h | UI `/register` + tx Lisk | FE | toasts & links |
| 1.5h | UI `/` y `/cid/:cid` (tabla/timeline) | FE | links CIDs |
| 2h | **Plan A Symbiotic**: registro + `slash()` | SC/BE | si bloquea → Plan B |
| 1h | Seed: registrar 5 CIDs + 2 packs | PM/BE | 3 propios, wiki root, Gutenberg |
| 1h | Simulación caída + `slash()` en vivo | BE/SC | despin de 1 CID propio |
| 1h | Seguridad mínima (roles/pausable/limits) | SC | require/modifiers |
| 1h | README + Threat model + scripts demo | PM | listo para jurado |
| 2h | Guion 120s + dry-run + video corto | Storyteller | WOW + cierre sponsors |

> **Buffer 2h** por fricciones (RPC/Symbiotic/SDK).

---

## 6) Pruebas & Dataset de demo

**CIDs (5):**  
1–3: archivos propios (PDF/CSV/PNG) en **web3.storage**.  
4: **Wikipedia snapshot root** (sólo raíz).  
5: **Gutenberg** (libro pequeño).

**Ejecución:** Cron crea 2–3 **Evidence Packs** por CID → se **despinnea** 1 CID propio → tras 2–3 fallos consecutivos (K=2, N=3), `BREACH` → **`slash()`**.

---

## 7) Demo Script (90–120s, EN)

- **Hook (10s):** “When public evidence goes offline, truth rots. CID Sentinel keeps IPFS data alive — with economic guarantees.”  
- **User Journey (60–70s):** Connect wallet → Register a CID with SLO → restake (small bond) → dashboard updates → open latest Evidence Pack (CID) → show latency & vantage points.  
- **WOW (20–30s):** Trigger live **failure** (unpin CID) → dashboard flips to **BREACH** → on-chain `Slashed` event → open Pack CID proving breach.  
- **Value Metric (15s):** “99%+ uptime for 4/5 CIDs; breach detected in <60s; automatic slash.”  
- **Close (10s):** “Built on Lisk, Symbiotic, Protocol Labs stack, and Vercel.”

---

## 8) Entregables DoraHacks (checklist)

- [ ] **Repo OSS** (MIT/Apache) con README (arquitectura + threat model).  
- [ ] **URL Vercel (prod)**.  
- [ ] **Dirección de contrato Lisk** (`EvidenceRegistry`).  
- [ ] **CIDs** de Evidence Packs + lista de CIDs monitoreados.  
- [ ] **Symbiotic**: policy/slashing config (Plan A) o **política de slashing** (Plan B) + condiciones SLO.  
- [ ] **Origen de datos**: lista de gateways/vantage; validación de pack (firma watcher).

---

## 9) Riesgos y mitigaciones

- **Symbiotic en 20h:** si SDK/infra bloquea, **Plan B** (restake+slash local) + guía de migración.  
- **libp2p en serverless:** si Edge limita dials, usar **multi-gateway HTTP** y firmas (suficiente para jurado).  
- **Falsos positivos:** regla SLO **K/N**, timeout, **vantage múltiples** y consecutivos para breach.  
- **Legales/PII:** sólo hashes/CIDs; sin PII; **disclaimer** “infra de evidencia, no consejo financiero”.  
- **Abuso/spam:** allowlist temporal de publishers/restakers; límites por CID/tiempo.

---

## 10) Métricas/KPIs (demo en vivo)

- **North Star:** % de CIDs dentro de SLO en la ventana de demo.  
- **Soporte:**  
  - **MTTD** (tiempo de detección de caída).  
  - # de eventos `EvidenceAnchored` y `Slashed`.  
  - **Latencia mediana** por vantage/gateway.

---

## 11) Fit con bounties (cómo cumplimos)

- **Symbiotic (restaking/slashing):** servicio con **SLO explícito**, slashing **determinístico** desde packs firmados; demo **breach→slash**.  
- **Protocol Labs (IPFS/libp2p/IPLD):** monitoreo multi-gateway + (opcional) dials p2p; **Evidence Packs** en IPFS; **DAG IPLD** temporal.  
- **Lisk:** anclaje on-chain de evidencias y estados; costos bajos; claridad de UI.  
- **Vercel:** cron **1 min**, API serverless, hosting del dashboard.  
- **Filecoin:** persistencia de packs y política (CID público).

---

## 12) Historias de usuario (Gherkin abreviado)

**Publisher registra CID**
```
Given conecté mi wallet
When ingreso un CID y SLO y confirmo
Then veo el CID en el dashboard con estado “OK” y un pack inicial anclado
```

**Restaker aporta stake**
```
Given hay un CID con slashing habilitado
When hago bond de un monto mínimo
Then totalStake sube y quedo expuesto a slashing si el SLO se rompe
```

**Watcher detecta breach**
```
Given un CID despinneado
When 2 de 3 vantage fallan 3 ciclos
Then se emite BreachDetected y Slashed on-chain + pack CID con evidencia
```

---

## 13) Checklist de seguridad mínima
- [ ] Validar inputs (SLO razonables; `k ≤ n`).  
- [ ] `reportPack` con `nonce`/`ts` monotónico + `onlyPolicy` o firma válida.  
- [ ] `slash` **onlyPolicy** + límites por llamada.  
- [ ] `Pausable` para emergencias.  
- [ ] Tests de propiedades (stake no negativo; monotonicidad; umbrales).

---

## 14) One-pager (para jurado)

**Problem:** IPFS data vanishes; audits break.  
**Solution:** CID Sentinel — SLO-backed availability with restaking & slashing.  
**How:** Probes → Evidence Pack (IPFS CID) → Anchor in **Lisk** → If breach → **Symbiotic slash**.  
**Why Web3:** Open, verifiable, tamper-evident evidence trail.  
**Demo WOW:** Live unpin → breach <60s → on-chain `Slashed` + pack CID.  
**Metrics:** ≥99% uptime (4/5 CIDs), MTTD < 60s, 1 slashing event.  
**Sponsors:** **Lisk** + **Symbiotic** + **Protocol Labs** + **Vercel** (+ **Filecoin**).

---

## 15) Comandos rápidos que soportamos
- `/brief` (ya integrado en este MD)  
- `/arquitectura` (esta sección)  
- `/contratos` (esta sección)  
- `/frontend` (rutas/estados arriba)  
- `/sprint48` (adaptado a 20h en tabla)  
- `/pitch` (guion 120s incluido)  
- `/riesgos` (sección 9)

---

### Nota final
- **Red:** Lisk **testnet**.  
- **Symbiotic:** intentamos integración **real** en ~20h; si no, **Plan B** equivalente.  
- **Dataset:** 5 CIDs (3 propios + Wikipedia root + Gutenberg).  
- **Pitch:** **EN**, narrativa **global** con énfasis “public evidence”.
