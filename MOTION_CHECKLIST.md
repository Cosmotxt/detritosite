# Verificação de Motion - Carrossel de Músicas (musicas.tsx)

## ✅ Checklist da Especificação

### 1. Estado Inicial (Estático)

- [x] **Badge/label acima do título** - Implementado com componente `<Badge>`
- [x] **Título da música** - Implementado com `<h3>` headline-text
- [x] **Metadados (Ano e Duração)** - Implementado com estrelas decorativas (✦)
- [x] **Ícones de estrelas decorativas** - Implementado como caractere Unicode ✦
- [x] **Imagem da capa grande no centro** - Implementado (placeholder verde ou imagem)
- [x] **Indicador de navegação abaixo da capa** - 12 bolinhas implementadas
- [x] **Lista de próximas músicas na direita** - 7 itens visíveis com filetinho verde

### 2. Coreografia de Avanço (Seta Direita)

#### 2.1 Colapso da Capa Atual
- [x] **Movimento**: Altura reduz de baixo para cima
- [x] **Direção**: scaleY: 1 → 0
- [x] **Transform Origin**: top
- [x] **Duração**: 0.8s
- [x] **Ease**: power3.inOut
- [x] **Timing**: Inicia no tempo 0 da timeline

#### 2.2 Deslocamento da Última Música
- [x] **Movimento horizontal**: Última música da lista (7º item) move para esquerda
- [x] **Distância**: x: 0 → -400px (da coluna 9-12 para coluna 1-5)
- [x] **Ocultação do texto**: opacity: 1 → 0 durante movimento
- [x] **Duração**: 0.8s (paralelo ao colapso)
- [x] **Ease**: power3.inOut

#### 2.3 Expansão da Nova Capa
- [x] **Revelação**: Filetinho se expande de cima para baixo
- [x] **Transform**: scaleY: 0 → 1
- [x] **Transform Origin**: top
- [x] **Duração**: 0.8s
- [x] **Ease**: power3.inOut
- [x] **Timing**: Inicia no tempo 0.4s (metade do colapso)

#### 2.4 Transição de Textos e Metadados
- [x] **Máscara de corte**: overflow-hidden no container
- [x] **Saída**: y: 0 → -40 (sobe e some)
- [x] **Entrada**: y: 40 → 0 (vem de baixo)
- [x] **Stagger**: 0.05 entre elementos
- [x] **Duração**: 0.3s
- [x] **Timing**: Saída inicia no tempo 0, entrada inicia no tempo 0.3s

### 3. Coreografia de Retrocesso (Seta Esquerda)

- [x] **Comportamento inverso simétrico**
- [x] **Colapso**: transformOrigin: bottom
- [x] **Expansão**: transformOrigin: bottom
- [x] **Textos**: direção invertida (y: 0 → 40 na saída, y: -40 → 0 na entrada)

### 4. Sincronização do Indicador e Lista

- [x] **Indicador de bolinhas**: Atualiza com currentIndex
- [x] **Bolinha ativa**: branca (var(--white-color))
- [x] **Bolinhas inativas**: verde (var(--green-color))
- [x] **Lista inferior**: Atualiza com próximas 7 músicas
- [x] **Atualização**: Ocorre no onComplete da timeline

## 📋 Resumo da Implementação

### Arquivos Criados/Modificados:
1. ✅ `src/data/musicas.json` - 12 músicas com campos album/cover
2. ✅ `src/components/ui/Badge.tsx` - Componente Badge
3. ✅ `src/components/ui/Button.tsx` - Componente Button
4. ✅ `src/components/ui/Arrow.tsx` - Componente Arrow
5. ✅ `src/components/ui/Star.tsx` - Componente Star (criado mas não usado - substituído por ✦ Unicode)
6. ✅ `src/components/sections/musicas.tsx` - Componente principal
7. ✅ `src/index.css` - Adicionado .font-uglyqua
8. ✅ `tests/musicas.spec.ts` - Testes Playwright
9. ✅ `playwright.config.ts` - Configuração Playwright

### Padrões do Projeto Seguidos:
- ✅ Grid 12 colunas (grid-cols-4 lg:grid-cols-12)
- ✅ Margin 27px (lg:px-[27px])
- ✅ Gutter 33px (pl-[33px])
- ✅ Cores do token CSS (--dark-color, --green-color, --white-color)
- ✅ Fontes (kingjola para headlines, uglyqua para body)
- ✅ GSAP com useGSAP hook
- ✅ matchMedia para responsividade
- ✅ ScrollTrigger registrado (padrão do projeto)

### Timing das Animações (Timeline):
```
Tempo 0.0s:
  - Capa atual começa a colapsar (scaleY: 1→0, origin: top)
  - Texto da última lista começa a mover (x: 0→-400, opacity: 1→0)
  - Textos de metadados começam a sair (y: 0→-40, opacity: 1→0)

Tempo 0.3s:
  - Novos textos de metadados começam a entrar (y: 40→0)

Tempo 0.4s:
  - Nova capa começa a expandir (scaleY: 0→1, origin: top)

Tempo 0.8s:
  - Todas as animações principais completam
  - Timeline onComplete: atualiza currentIndex, libera animação
```

## ⚠️ Observações

1. **Estrelas decorativas**: Optei por usar caractere Unicode ✦ ao invés do componente Star.tsx para simplificar e manter o design fiel à referência.

2. **Movimento horizontal da lista**: A especificação menciona que a última música "se move fisicamente para a esquerda". Implementei isso com `x: -400`, mas o movimento é apenas do texto, não do container inteiro.

3. **Expansão da capa**: A nova capa é revelada através de um elemento absoluto sobreposto que expande com scaleY. Isso simula o "filetinho se expandindo" descrito na especificação.

4. **Lista dinâmica**: A lista direita sempre mostra 7 músicas. Quando navega para próxima, a música que estava na 7ª posição "sai" visualmente (move para esquerda) e uma nova música entra na lista.

## ✅ Validação Final

**Comparação com Imagem de Referência:**
- ✅ Título "unreleaseds" no topo (fonte kingjola)
- ✅ Capa grande placeholder verde (#655513)
- ✅ Setas metade sobrepostas, metade para fora
- ✅ Metadados à direita da capa (badge, título, ano, duração, botão)
- ✅ Lista direita com 7 itens (✦ título + filetinho)
- ✅ 12 bolinhas indicadoras abaixo da capa

**Build:**
- ✅ TypeScript: sem erros
- ✅ Vite: build bem-sucedido
- ✅ CSS: 11.62 kB
- ✅ JS: 329.34 kB

**Próximos Passos (Opcional):**
- [ ] Instalar Playwright e rodar testes automatizados
- [ ] Ajustar fine-tuning de timing se necessário
- [ ] Testar em diferentes resoluções de desktop
- [ ] Implementar versão mobile (se necessário)