# Mercado Financeiro FC

Jogo de gestão financeira com tema de mercado de transferências de futebol.
Escolha um clube entre 8 fictícios (todos com identidade visual própria),
comece com um elenco completo de 22 jogadores, e administre patrocínio,
merchandising, fluxo de caixa e mercado internacional enquanto disputa uma
liga de 8 clubes com pontuação e ranking financeiro separados.

**Nota sobre clubes e jogadores reais:** o jogo usa 8 clubes e um mercado
de jogadores inteiramente fictícios. Reproduzir escudos e nomes de
jogadores profissionais reais envolveria marca registrada e direito de
imagem, o que é particularmente arriscado num app pensado para gerar
receita. A profundidade do jogo (22 jogadores, mercado internacional,
liga com 8 times) é a mesma; só a identidade é inventada.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Na primeira vez, você escolhe seu clube.
Progresso salvo automaticamente no `localStorage`.

## O que tem no jogo

- **Seleção de clube**: 8 clubes fictícios com escudo gerado (SVG, cores
  próprias), você escolhe 1 para jogar; os outros 7 viram rivais na liga.
- **Elenco completo de 22 jogadores** ao começar, gerado com distribuição
  realista de posição (3 goleiros, 8 defensores, 7 meio-campistas, 4
  atacantes), cada jogador com nacionalidade (8 países).
- **Mercado internacional** com 60+ jogadores disponíveis para contratar,
  além dos jogadores que você vende (voltam ao mercado).
- **Patrocínio**: a cada temporada, escolha entre 3 propostas com
  trade-off real entre valor fixo garantido e bônus por vitória.
- **Merchandising**: receita passiva que cresce com o tamanho do elenco e
  a posição na tabela.
- **Fluxo de caixa** (aba dedicada): entradas (bilheteria, merchandising,
  patrocínio) e saídas (salários do elenco, estrutura/staff, dívida)
  detalhadas rodada a rodada, com resumo acumulado da temporada.
- **Liga de 8 clubes, largada 100% igual**: todos começam com o mesmo
  orçamento; o que diferencia cada um é o estilo de gestão (Agressivo,
  Conservador, Especulador, Equilibrado).
- **Duas tabelas que podem divergir**: Tabela do Campeonato (pontos,
  V-E-D) e Ranking Financeiro (patrimônio) lado a lado — dá pra liderar o
  campeonato e estar mal financeiramente, e essa divergência é a lição
  central do jogo.
- **Índice de Saúde Financeira (0-100)**, recalculado a cada rodada, com
  título que evolui: Estagiário → Analista → Gerente → Diretor → CFO
  Lendário.
- **7 conquistas**, a maioria premiando comportamento financeiro correto,
  não resultado esportivo.
- **Loop de decisão em várias camadas por rodada**: patrocínio (só no
  início da temporada), postura tática, alocação de orçamento de
  investimento, evento aleatório quando dispara, e disputa de lance por
  jogadores "disputados" na compra (cobrir à vista, financiar parcelado
  com juros embutidos, ou desistir).

## Estrutura de arquivos

```
src/
  data/
    seasons.js          # as 5 temporadas: orçamento, rodadas, condição de avanço
    concepts.js           # os 15 conceitos financeiros, glossário vivo
    clubs.js                # os 8 clubes fictícios (cores, país, estilo)
    nameBank.js               # nomes por nacionalidade para o gerador de jogadores
  game/
    gameEngine.js            # toda a lógica: criar jogo a partir do clube, comprar, vender, simular rodada
    playerGenerator.js         # gera elencos de 22 e o mercado internacional
    tactics.js                   # as 3 posturas táticas e seu efeito em risco/retorno
    investment.js                  # alocação de orçamento de investimento por rodada
    sponsorship.js                   # propostas de patrocínio por temporada
    bidWar.js                          # geração de lance rival para jogadores disputados
    rivals.js                            # liga de 8 clubes, estilos de gestão, tabela e ranking
    financialHealth.js                     # cálculo do Índice de Saúde Financeira e título
    achievements.js                          # definição e checagem das 7 conquistas
    events.js                                  # pool de eventos aleatórios
    format.js                                    # formatação de moeda em Real (R$)
  components/
    ClubSelect.jsx           # tela de escolha de clube no início
    ClubCrest.jsx               # escudo gerado em SVG a partir das cores do clube
    Ticker.jsx                     # caixa, temporada, rodada, escudo, título e pontos
    PlayerCard.jsx                    # cartão de jogador, com nacionalidade e selo de "disputado"
    SponsorModal.jsx                     # escolha de patrocínio no início da temporada
    TacticModal.jsx                         # escolha de postura tática antes da rodada
    InvestmentModal.jsx                        # alocação do orçamento de investimento
    BidWarModal.jsx                               # disputa de lance por jogador "hot"
    FormationView.jsx                                # elenco visualizado como time em campo
    LeagueTable.jsx                                     # tabela de campeonato + ranking financeiro
    CashFlowView.jsx                                       # fluxo de caixa detalhado
    ProfileView.jsx                                           # índice de saúde financeira e conquistas
    EventModal.jsx                                               # modal de decisão de evento aleatório
    ConceptCard.jsx                                                 # modal do glossário vivo
    RoundSummary.jsx                                                   # extrato ao fim de cada rodada
    FinalReport.jsx                                                       # extrato final com título e conquistas
  App.jsx                                                                    # orquestra o fluxo completo
```

## Próximas features a considerar

- **Escalação tática**: escolher os 11 titulares entre os 22 do elenco
  antes de cada rodada (hoje todos contam igualmente para custo e força).
- **Empréstimo de jogadores** entre clubes, com opção de compra ao final.
- **Rubber-banding nos rivais**: ajustar o desempenho deles conforme a
  posição do jogador, mantendo a disputa apertada até o fim.
- **Mais nacionalidades e mais eventos**: os bancos em `nameBank.js` e
  `events.js` são fáceis de estender copiando o formato existente.
