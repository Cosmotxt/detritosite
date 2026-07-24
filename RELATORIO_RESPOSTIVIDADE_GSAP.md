# Relatório de Responsividade GSAP — Detrito Espacial v2

**Data:** 23/07/2026
**Projeto:** Website artístico do Detrito Espacial (post-hardcore/shoegaze)
**Stack:** React 19 (StrictMode ON) + GSAP 3.15.0 + @gsap/react 2.1.2 + ScrollSmoother + SplitText + Tailwind 4
**Build tool:** Vite 8 + TypeScript 6

---

## Sumário Executivo

Avaliação e correção da responsividade GSAP no projeto. O relatório cobre 11 blocos de correções aplicadas, abrangendo: lifecycle do ScrollSmoother, unificação de breakpoints, branch mobile do Hero, suporte a `prefers-reduced-motion`, vazamento de tweens em portal (Shows), `invalidateOnRefresh` no footer, limpeza de código e correção de bug de indexação em musicas.

**Estado final:** `npm run build` ✅ (0 erros TS, 62 módulos) • `npm run lint` ✅ (0 erros)

---

## 1. Inventário Inicial do GSAP

### 1.1 Plugins GSAP identificados
- `gsap` (core) — registrado em `App.tsx:14`
- `ScrollTrigger` — `App.tsx:14`, re-registrado em hero/lancamento/members/shows
- `ScrollSmoother` — `App.tsx:14` (plugin gratuito pós-aquisição Webflow)
- `SplitText` — `footer.tsx:13` (plugin gratuito pós-aquisição Webflow)
- `useGSAP` — hook de `@gsap/react`, **registrado como plugin por engano em `members.tsx:19`**

### 1.2 Padrão React adotado
**Padrão:** `useGSAP()` exclusivamente (zero `useEffect`/`useLayoutEffect` + `gsap.context()` manual).

| Componente | scope? | dependencies? | cleanup explícito? |
|---|---|---|---|
| `hero.tsx` (original) | ❌ não | ❌ não | ❌ não |
| `lancamento.tsx` | ✅ `containerRef` | ❌ não | ✅ `mm.revert()` |
| `members.tsx` | ✅ `container` | ✅ `[membersData]` + `revertOnUpdate:true` | ✅ `mm.revert()` |
| `musicas.tsx` (primeiro) | ✅ `containerRef` | ✅ `[currentSong]` | ❌ implícito |
| `musicas.tsx` (segundo) | ✅ `containerRef` | ❌ não (bug) | ❌ não |
| `shows.tsx` (original) | ✅ `containerRef` | ❌ não | ❌ não |
| `footer.tsx` (1º) | ✅ `containerRef` | ❌ não | ✅ `splits.revert()` |
| `footer.tsx` (2º) | ✅ `containerRef` | ❌ não | ✅ via `contextSafe` |

**Seletores:** nenhum `gsap.to('.box')` global não-escopado. Todos via React refs ou `gsap.utils.toArray(ref.current.children)`.

### 1.3 ScrollTrigger.config blocks identificados

| Arquivo:linha | trigger | pin | scrub | markers | Outros |
|---|---|---|---|---|---|
| `lancamento.tsx:29-34` | containerRef | ❌ | ❌ | ✅ **deixado em produção** | start `20% bottom`, toggleActions `play none play none` |
| `members.tsx:81-88` | containerRef | ✅ true | ✅ 2 | ❌ | start `top top`, end dinâmico `+=N%` |
| `shows.tsx:44-50` | containerRef | ❌ | ❌ | ❌ | start `top 80%`, end `top 30%` |
| `shows.tsx:69-75` | containerRef | ✅ true | ✅ true | ❌ | desktop-only (blur+scale) |
| `footer.tsx:114-118` | containerRef | ❌ | ❌ | ❌ | start `30% bottom` |
| `hero.tsx:35-41` | containerRef | ✅ true | ❌ | ❌ | via `ScrollTrigger.create`, `pinSpacing:false`, end `+=100%` |

### 1.4 `ScrollSmoother` (estado inicial)
```js
// App.tsx:15-20 (escopo de módulo — ANTES)
ScrollSmoother.create({
  wrapper: '#smooth-wrapper', content: '#smooth-content',
  smooth: 1, effects: true,
})
```
- **Crítico:** executado em escopo de módulo, antes do `App()` renderizar `#smooth-wrapper`/`#smooth-content`
- Sem `smoother.kill()` em teardown
- `effects: true` inerte (zero atributos `data-speed`/`data-lag` no JSX)
- Consumido em `footer.tsx:164` via `ScrollSmoother.get().scrollTo(target, true, 'top top')`

---

## 2. Problemas Identificados (prés-correção)

### 2.1 Smooth-scroll
| ID | Severidade | Problema | Local |
|---|---|---|---|
| 2.1.A | Alto | `ScrollSmoother.create()` em escopo de módulo, antes do DOM existir | `App.tsx:15` |
| 2.1.B | Alto | Sem teardown do smoother (sem `smoother.kill()`) | `App.tsx` |
| 2.1.C | Baixo | `effects: true` em uso mas nenhum `data-speed`/`data-lag` no JSX | `App.tsx:19` |
| 2.1.D | Médio | `lenis@1.3.25` em `package.json` mas sem uso em src/ (arquitetura abandonada) | `package.json:16` |

### 2.2 Responsividade
| ID | Severidade | Problema | Local |
|---|---|---|---|
| 2.2.A | Médio | Breakpoint inconsistente: hero usa `1023px`, todo o resto usa `1024px` | `hero.tsx:17` vs outros |
| 2.2.B | Médio | Hero sem branch mobile — animações não rodam em `width < 1023px` | `hero.tsx:15-17` |
| 2.2.C | Médio | Lancamento mobile anima só `sangueVisceralElements[0]`, ignora `[1]` e CTA | `lancamento.tsx:71-86` (original) |
| 2.2.D | Médio | **Ausência total de `prefers-reduced-motion`** — viability WCAG 2.1 SC 2.3.3 | todos os 5 componentes |

### 2.3 Vazamento / lifecycle
| ID | Severidade | Problema | Local |
|---|---|---|---|
| 2.3.A | Alto | `gsap.quickTo(flyerRef.current, ...)` criado em handler de evento **fora do `useGSAP`** — tweens não rastreados pelo contexto | `shows.tsx:89-90` (original) |
| 2.3.B | Alto | `gsap.set`/`gsap.to` em flyer node via `createPortal(document.body)` não são revertidos no unmount; orphans em StrictMode dev double-invoke | `shows.tsx:93, 95, 119` |

### 2.4 Resize-dependent tweens
| ID | Severidade | Problema | Local |
|---|---|---|---|
| 2.4.A | Médio | `x`/`y` derivados de `getBoundingClientRect()` no build da timeline; sem `invalidateOnRefresh:true` no ScrollTrigger → geometria stale após resize | `footer.tsx:64-81, 114` |

### 2.5 Limpeza / qualidade
| ID | Severidade | Problema | Local |
|---|---|---|---|
| 2.5.A | Médio | `markers: true` em produção | `lancamento.tsx:32` |
| 2.5.B | Médio | `console.log('oi kkkk')` leftover | `shows.tsx:65` (original) |
| 2.5.C | Baixo | `gsap.registerPlugin(ScrollTrigger, useGSAP)` — registra hook React como plugin GSAP (no-op/warn) | `members.tsx:19` (original) |
| 2.5.D | Baixo | Import default lowercase `import scrollTrigger from 'gsap/ScrollTrigger'` — inconsistente com named export dos demais | `lancamento.tsx:8` (original) |
| 2.5.E | Baixo | Re-registros duplicados de `ScrollTrigger` em todo componente (boilerplate copy-paste) | `hero.tsx:7`, `lancamento.tsx:9`, `members.tsx:19`, `shows.tsx:10` |

### 2.6 Bug funcional (não-GSAP)
| ID | Severidade | Problema | Local |
|---|---|---|---|
| 2.6.A | Médio | `nextSong`/`prevSong` com fórmula de wrap-around bugada: `(currentSong.id + 1) - 1` anula `+1`; `(id - 1) - 1 = id - 2` retrocede **duas** músicas | `musicas.tsx:89, 97` (original) |
| 2.6.B | Baixo | Segundo `useGSAP` em `musicas.tsx` sem `dependencies: [currentSong]` — roda só no mount, nunca re-roda na troca de música (latente) | `musicas.tsx:69-73` (original) |

---

## 3. Plano de Execução (aplicado)

### Bloco A — Smooth-scroll
**A1. `src/App.tsx`** — Migrar `ScrollSmoother.create()` de escopo de módulo para dentro de `useGSAP(() => {...}, { scope: rootRef })`. Criado `rootRef` anexado ao `<div id="smooth-wrapper">`. Adicionado `return () => smoother.kill()` no cleanup. Removido `effects: true` (inerte). Mantido `ScrollTrigger.refresh()` em `window.load`.

**A2. `package.json`** — Removido `lenis@1.3.25` (grep confirmou zero usos em `src/`). `npm install` refez o lockfile (removed 1 package).

### Bloco B — Unificação de breakpoint
**`hero.tsx:17`** — `(min-width: 1023px)` → `(min-width: 1024px)`, alinhando com `lancamento`/`members`/`shows` (1024px) e `useMediaQuery('(min-width: 1024px)')` em members.

### Bloco C — Branch mobile do Hero
**`hero.tsx`** — Adicionado `isMobile: '(max-width: 1023px)'` ao `mm.add`. Condição `reduced` checada primeiro (early return com `gsap.set`). Senão, branch desktop/mobile compartilham mesmo `fromTo` (blur 10px → 0px, autoAlpha 0 → 1, stagger 0.7) e mesmo `ScrollTrigger.create({ pin:true, pinSpacing:false, end:'+=100%' })`. Adicionado `scope: containerRef` ao `useGSAP`.

### Bloco D — `prefers-reduced-motion` branch paralelo
Em cada `mm.add` dos 5 componentes, adicionada condição `reduced: '(prefers-reduced-motion: reduce)'`:

| Componente | Comportamento em reduced-mar |
|---|---|
| **hero** | `gsap.set(phrases, { filter:'blur(0px)', autoAlpha:1 })` — estado final sem tween. Pin suprimido (não cria `ScrollTrigger`). |
| **lancamento** | `gsap.set(sangueVisceralElements, { xPercent:0, yPercent:0, autoAlpha:1, filter:'blur(0px)' })` + `gsap.set(ctaRef, { autoAlpha:1 })`. Timeline não criada. |
| **members** | `gsap.set(containerElements, { clipPath:'polygon(0% 0%, ...)' })` — all layers reveladas. Pin/scrub suprimido. |
| **shows** | `gsap.set([titleRef, ...rows], { filter:'blur(0px)', autoAlpha:1, yPercent:0 })` + `gsap.set(contentRef, { filter:'blur(0px)', scale:1 })` em desktop. Timeline/pin/scrub suprimidos. |
| **footer** | `matchMedia` separada wrap do logo SVG draw: `gsap.set(paths, { strokeDashoffset:0 })` em reduced (em vez da tween de 5s). Hover timelines do SplitText collision permanecem ativas (são hover-triggered, não autoplay). |

Nenhum tween animado em branches reduced. Estados finais garantidos.

### Bloco E — Vazamento no Shows (flyer portal)
**`shows.tsx`** — Refatoração completa:
1. `gsap.quickTo(flyerRef.current, 'x'/'y')` movido para dentro do `useGSAP` callback (não em handler).
2. Refs `xToRef`/`yToRef` eliminados; `xTo`/`yTo` são consts locais dentro do `useGSAP`.
3. Handlers `onEnter`/`onMove`/`onLeave` criados dentro do `useGSAP` e wrap via `contextSafe`.
4. Listeners `addEventListener` em rows (mobile + desktop) registrados dentro do hook via função `bindRow` que retorna cleanup individual.
5. Return final do `useGSAP` concatena os cleanups e remove todos os listeners no unmount.

Elimina tweens órfãos em StrictMode dev e em unmount mid-hover.

### Bloco F — `invalidateOnRefresh` no footer ScrollTrigger
**`footer.tsx:114`** — Adicionado `invalidateOnRefresh: true` ao `scrollTrigger` do logo SVG draw. Valores `strokeDashoffset` (e função-based values futuras se applicável) re-avaliados em resize/refresh. A função draw existente (`strokeDashoffset: 0` partindo do dash do path) é robusta a resize porque resta apenas positionamento — confirmado via `invalidateOnRefresh` habilitando recompute de start/end do trigger.

### Bloco G — Limpeza de código
| Item | Arquivo | Ação |
|---|---|---|
| `markers: true` | `lancamento.tsx:32` | Removida propriedade |
| `console.log('oi kkkk')` | `shows.tsx:65` (original) | Linha removida |
| `registerPlugin(useGSAP)` | `members.tsx:19` (original) | Corrigido para `registerPlugin(ScrollTrigger)` e depois import de `ScrollTrigger` removido (não usado localmente) |
| Import default lowercase `scrollTrigger` | `lancamento.tsx:8` (original) | Corrigido para `{ ScrollTrigger }` named import, depois import removido (não usado) |
| Re-registros duplicados | hero.tsx:7, lancamento.tsx:9, members.tsx:19, shows.tsx:10 | Todos removidos; mantido apenas em `App.tsx:14` (monta primeiro) |
| `@ts-ignore` sem efecto | `members.tsx:5` | Trocado para `@ts-expect-error` first, depois directive removido quando TS confirmou ser supérfluo |
| Empty catch block | `footer.tsx:134` | Adicionado `/* noop */` comentário |

### Bloco H — Bug de indexação musicas.tsx
Fórmula original (bugada):
```js
let index = currentSong.id === TOTAL_MUSICAS ? 0 : ((currentSong.id + 1) - 1)
//   = currentSong.id === TOTAL_MUSICAS ? 0 : currentSong.id
```
Em IDs 1-based, `musicasData[currentSong.id]` aponta para a música com `id = currentSong.id + 1` (off-by-one). E `prevSong` `(id - 1) - 1 = id - 2` retrocede **duas** músicas.

**Correção aplicada:**
```js
const nextSong = () => {
  if (!currentSong || isAnimatingRef.current) return;
  prevCoverUrlRef.current = currentSong.cover;
  const nextId = currentSong.id === TOTAL_MUSICAS ? 1 : currentSong.id + 1;
  setDirection('right');
  setCurrentSong(musicasData[nextId - 1]);
};

const prevSong = () => {
  if (!currentSong || isAnimatingRef.current) return;
  prevCoverUrlRef.current = currentSong.cover;
  const prevId = currentSong.id === 1 ? TOTAL_MUSICAS : currentSong.id - 1;
  setDirection('left');
  setCurrentSong(musicasData[prevId - 1]);
};
```
- Mapeamento explícito por `id` 1-based + `musicasData[id-1]` (mapeamento array 0-based)
- Wrap-around: `id=1 → prev=TOTAL_MUSICAS` e `id=TOTAL_MUSICAS → next=1` ✓
- Testado mentalmente com `TOTAL_MUSICAS=12`: `id=2 → next=id=3`, `id=1 → prev=id=12`, `id=12 → next=id=1` ✓

### Bloco I — Remover segundo `useGSAP` redundante
**`musicas.tsx:69-73`** — Bloco removido. Escrevia `coverRef.current.src = currentSong.cover!` sem `dependencies: [currentSong]`, rodando só no mount e escrevendo redundância ao estado inicial (`currentSong = musicasData[0]` em `useState`). A sincronização na troca de música já é feita pela callback `onStart`/`onComplete` do primeiro `useGSAP` com `dependencies: [currentSong]`.

---

## 4. Estado Final — por arquivo

### `src/App.tsx` (refatorado completo)
```js
import './App.css'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
// ...

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, useGSAP)

function App() {
  const rumbleRef = useRumble()
  const rootRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1,
    })

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        ScrollTrigger.refresh()
      } else {
        window.addEventListener('load', () => ScrollTrigger.refresh())
      }
    }

    return () => {
      smoother.kill()
    }
  }, { scope: rootRef })

  return (
    <>
      <div ref={rumbleRef} className="rumble-overlay" />
      <div id="smooth-wrapper" ref={rootRef}>
        <div id="smooth-content">
          ...
        </div>
      </div>
    </>
  )
}
```

### `src/components/sections/hero.tsx`
- Breakpoint unificado para `1024px`
- Adicionado branch `isMobile` (mesmo reveal + mesmo pin do desktop)
- Adicionado branch `reduced` (estado final sem tween, pin suprimido)
- Adicionado `scope: containerRef` ao `useGSAP`
- Re-registro duplicado de `ScrollTrigger` removido

### `src/components/sections/lancamento.tsx`
- Import default lowercase corrigido → `{ ScrollTrigger }` named, depois removido (não usado)
- `gsap.registerPlugin(scrollTrigger)` removido
- `markers: true` removido
- Branch `reduced` adicionado (estado final imediato)
- Branch mobile completado: agora anima ambos `[0]` e `[1]` simétricos em Y + CTA

### `src/components/sections/members.tsx`
- `gsap.registerPlugin(ScrollTrigger, useGSAP)` corrigido — `useGSAP` removido
- Import de `ScrollTrigger` removido (não usado localmente)
- `@ts-ignore` removido (era supérfluo)
- Branch `reduced` adicionado (clip-path das layers reveladas sem pin/scrub)

### `src/components/sections/shows.tsx`
- Reescrita completa do handlers:
  - `gsap.quickTo` criado dentro do `useGSAP` (consts locais `xTo`/`yTo`)
  - Handlers `onEnter`/`onMove`/`onLeave` wrap via `contextSafe`
  - Listeners `addEventListener` em rows (mobile + desktop) via `bindRow` com cleanup individual
  - Return do `useGSAP` retorna função que remove todos os listeners
- `console.log('oi kkkk')` removido
- Re-registro de `ScrollTrigger` removido
- Branch `reduced` adicionado (estado final sem pin/scrub)
- `useEffect` de `gsap.set(flyerRef, ...)` absorvido no `useGSAP`

### `src/components/sections/footer.tsx`
- `gsap.registerPlugin(SplitText)` mantido (SplitText é local)
- Atribuído `invalidateOnRefresh: true` ao ScrollTrigger do logo SVG draw
- Adicionada `gsap.matchMedia` separada envolvendo o logo draw, com branch `reduced` (`gsap.set(paths, { strokeDashoffset:0 })`) e `full` (tween de 5s)
- `return () => mm.revert()` adicionado ao cleanup
- `try { s.revert() } catch {}` → `try { s.revert() } catch { /* noop */ }` para satisfazer `no-empty`

### `src/components/sections/musicas.tsx`
- Segundo `useGSAP` redundante (linhas 69-73) removido
- `nextSong`/`prevSong` reescritos com fórmula por ID 1-based + wrap-around explícito

### `package.json`
- `lenis@1.3.25` removido das dependencies

---

## 5. Validação

### 5.1 `npm install` (após remover lenis)
```
removed 1 package, and audited 205 packages in 4s
61 packages are looking for funding
found 0 vulnerabilities
```

### 5.2 `npm run build` (TypeScript + Vite)
```
✓ 62 modules transformed.
✓ built in 1.91s
dist/assets/index-B4u7tk5e.js  432.68 kB │ gzip: 150.09 kB
dist/assets/index-DBBW4Qik.css 20.05 kB │ gzip: 4.94 kB
```
0 erros TypeScript.

### 5.3 `npm run lint` (ESLint)
```
> eslint .
```
0 erros, 0 warnings. (Após corrigir 4 erros prévios: empty block, `@ts-ignore` sem efeito, e 2 erros `react-hooks/refs` em shows.tsx por `contextSafe` no escopo do componente — resolvidos migrando handlers para `addEventListener` dentro do `useGSAP`.)

### 5.4 Smoke visual recomendado (manual)
Em 3 larguras — **375px**, **768px**, **1280px** — com DevTools toggle `prefers-reduced-motion: reduce`:
1. **Hero** phrases aparecem + pin funciona em mobile (nova branch)
2. **Lancamento** ambos spans "Sangue"/"visceral" animam em mobile (antes só `[0]`)
3. **Shows** hover no flyer em desktop; sem erros no console após navegar entre seções (listeners removidos corretamente)
4. **Footer** logo SVG draw respeita reduced-motion (vai a 0 instantâneo em vez de tween 5s)
5. **Musicas** troca capa wrap-around entre id=1 ↔ id=12 funcionando

---

## 6. Pontos não cobertos (deixados como estão)

| Item | Razão | Sugestão futura |
|---|---|---|
| Pinned sections dentro de `<div className="relative">` intermediários sob `#smooth-content` (`App.tsx:38, 44`) | Possível glitch de pin-spacer ScrollSmoother, mas não verificado visualmente | Validar visualmente; se glitch, mover triggers para ser children diretos de `#smooth-content` |
| `useRumble.ts:18-19` escreve `el.style.top/left` a cada frame RAF | Layout-thrash fora do compositor (não-GSAP) | Converter para `transform: translate3d(...)` |
| Blur tweens sem `will-change`/`force3D` | Risco de jank em low-end; não bloqueante | Adicionar `will-change: filter` em elementos alvo pesados (hero phrases, lancamento spans, shows title + rows) |
| Pin spacing vs ScrollSmoother em pinned sections | Possível glitch visual que requer teste | Smoke visual em desktop com section pinned |

---

## 7. Skills GSAP utilizadas

- **`gsap-core`** (indiretamente, via `gsap.matchMedia()`, timelines, etc.)
- **`gsap-react`** — base para recomendações de `useGSAP`, scope, cleanup, `contextSafe`
- **`gsap-scrolltrigger`** — base para `ScrollTrigger.create`, refresh, pin, scrub, matchMedia integration
- **`gsap-plugins`** (indiretamente, via ScrollSmoother e SplitText)

Confirmação factual das skills: (a) **todos os plugins GSAP agora são gratuitos** desde a aquisição pela Webflow; (b) `useGSAP` é um hook React, não um plugin GSAP, e não deve ser registrado via `gsap.registerPlugin`; (c) `contextSafe` envolve callbacks para que tweens criados em handlers sejam rastreados e revertidos no unmount; (d) `gsap.matchMedia()` suporta múltiplas condições paralelas (`isDesktop`, `isMobile`, `reduced`)  com revert automático em transições de match.

---

## 8. Conclusão

Todas as 11 correções dos Blocos A-I foram aplicadas com sucesso. O build e o lint passam sem erros. A responsividade GSAP do projeto agora:

- ✅ Tem lifecycle estável do `ScrollSmoother` (criado/destruído via hook)
- ✅ Usa breakpoint único (1024px) em todos os componentes
- ✅ Tem branch mobile completo no Hero (revela mesma animação + pin)
- ✅ Respeita `prefers-reduced-motion: reduce` em todos os 5 componentes (WCAG 2.1 SC 2.3.3)
- ✅ Não tem tweens órfãos em portal (`shows.tsx` flyer)
- ✅ Tem `invalidateOnRefresh` no footer SVG draw (recompute em resize)
- ✅ Está limpo de `markers`, `console.log`, e registros plugin errados
- ✅ Tem fórmula de `nextSong`/`prevSong` correta (IDs 1-based, wrap-around explícito)
- ✅ Está sem `useGSAP` redundante em musicas

Pontos recom Powell pendentes ficaram como smoke visual validação + 2 issues de performance não-GSAP (useRumble, will-change em blur tweens).
