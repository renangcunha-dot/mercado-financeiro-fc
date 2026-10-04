# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é

Mercado Financeiro FC — jogo de gestão financeira (SPA React) com tema de
mercado de transferências de futebol. O jogador escolhe 1 de 8 clubes
fictícios, recebe um elenco de 22 jogadores e administra patrocínio,
merchandising, fluxo de caixa e mercado de transferências ao longo de 5
temporadas, competindo em pontos (campeonato) e patrimônio (ranking
financeiro) contra 7 rivais controlados pelo jogo.

Nota de design importante: clubes, escudos e jogadores são inteiramente
fictícios (gerados por código), de propósito — nunca reintroduzir nomes,
escudos ou dados de clubes/jogadores reais (ver README.md para o porquê).

## Comandos

```bash
npm install       # instala dependências
npm run dev       # dev server (Vite), abre em http://localhost:5173
npm run build     # build de produção
npm run preview   # serve o build de produção localmente
```

Não há suíte de testes nem linter configurado neste projeto (sem Jest/
Vitest, sem ESLint). Validação é manual via `npm run dev`.

## Arquitetura

SPA React 18 + Vite + Tailwind, sem backend e sem roteador — tudo roda no
cliente. Progresso é salvo em `localStorage`, em até 3 slots independentes
(`src/game/saveSlots.js`).

**Separação estrita entre lógica de jogo e UI:**
- `src/game/*.js` e `src/data/*.js` — puros, sem React, sem side effects
  de DOM (exceto `sound.js` e `saveSlots.js`, que tocam `localStorage`/
  `Audio`). Todo o estado do jogo é um único objeto plano transformado por
  funções puras que recebem `state` e retornam um novo `state` (ou
  `{ ok, state, reason?, concept? }` para ações que podem falhar).
- `src/components/*.jsx` — apresentação. Não contêm regra de negócio; só
  chamam funções de `src/game/` e renderizam o resultado.
- `src/App.jsx` — único componente com estado (`useState`) e o orquestrador
  de tudo: dono do `state` do jogo, da state machine de fases da rodada, e
  do roteamento entre as abas/telas via renderização condicional (não há
  react-router).

**Fluxo de telas** (`App.jsx`): seleção de slot de save
(`SaveSlotSelect`) → seleção de clube (`ClubSelect`, só se o slot estiver
vazio) → tela principal com abas (mercado, elenco, campo, liga, fluxo de
caixa, perfil).

**State machine de rodada** (constante `PHASES` em `App.jsx`): patrocínio
(só na 1ª rodada de cada temporada) → formação → tática → investimento →
evento aleatório (condicional) → simulação (`simulateRound` em
`gameEngine.js`) → resumo da rodada. Cada fase tem seu modal dedicado em
`src/components/`.

**`src/game/gameEngine.js`** é o núcleo: cria o estado inicial
(`createInitialState`), calcula receitas/custos por rodada (bilheteria,
merchandising, patrocínio, salários, custo de estrutura, juros de dívida),
resolve compra/venda de jogadores (à vista ou financiada) e roda a
simulação de rodada (`simulateRound`) — resultado da partida, valorização/
desvalorização de jogadores, lesões. Times rivais evoluem via
`src/game/rivals.js`, que também monta a Tabela do Campeonato e o Ranking
Financeiro (propositalmente podem divergir — é a mecânica central do
jogo).

**Outras peças de `src/game/`:**
- `playerGenerator.js` — gera elenco inicial e mercado de transferências
  (nomes vêm de `data/nameBank.js`, por nacionalidade).
- `tactics.js` / `formations.js` — posturas táticas e formações, cada uma
  com efeito em `winChanceDelta`/`injuryChance` consumido por
  `simulateRound`.
- `investment.js`, `sponsorship.js`, `bidWar.js`, `events.js` — geram as
  opções apresentadas em cada modal de decisão da rodada.
- `financialHealth.js` — calcula o Índice de Saúde Financeira (0-100) e o
  título correspondente (Estagiário → CFO Lendário).
- `achievements.js` — checa as 7 conquistas a cada mudança de estado.
- `saveSlots.js` — persistência em `localStorage` (3 slots + migração de
  save legado de formato antigo).
- `shareCard.js` — geração do card de compartilhamento de resultado.
- `sound.js` — efeitos sonoros (vitória/derrota/empate/conquista) e mute.

Conceitos financeiros didáticos (glossário "vivo" mostrado via
`ConceptCard`) ficam em `src/data/concepts.js` e são desbloqueados
conforme o jogador encontra a mecânica correspondente pela primeira vez
(`unlockConcept` em `gameEngine.js`, chamado a partir de `App.jsx`).

Para estender: dados por temporada em `data/seasons.js`, clubes em
`data/clubs.js`, nomes/nacionalidades em `data/nameBank.js`, eventos
aleatórios em `game/events.js` — todos seguem o formato de arrays/objetos
já existente, basta copiar o padrão.
