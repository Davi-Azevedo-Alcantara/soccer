"use client";

import { useMemo, useState } from "react";
import {
  BadgeEuro,
  Building2,
  CalendarDays,
  Dumbbell,
  Flame,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  ListOrdered,
  MessageCircle,
  Newspaper,
  Palette,
  Play,
  RefreshCw,
  Repeat2,
  Hash,
  Shield,
  Shirt,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import {
  addNews,
  addSocialPost,
  averageAttributes,
  assignPlayerToSlot,
  autoSelect,
  calculateBuffs,
  calculateTacticalProfile,
  clubValueScore,
  createGame,
  createPlayer,
  createSponsorOffers,
  createYouth,
  GameState,
  formationDefs,
  FormationKey,
  lineupPlayers,
  matchLabel,
  money,
  nextUserMatch,
  Player,
  rating,
  refreshLegends,
  selectedPlayers,
  setFormation,
  simulateAll,
  simulateNextUserMatch,
  sortedTable,
  stadiumRevenue,
  strategies,
  StrategyKey,
  styleDefs,
  teamPower,
  userTeam,
} from "@/lib/simulation";

type View = "dashboard" | "club" | "history" | "squad" | "tactics" | "calendar" | "table" | "transfers" | "academy";

const views: Array<{ key: View; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { key: "dashboard", label: "Visão geral", icon: LayoutDashboard },
  { key: "club", label: "Clube", icon: Building2 },
  { key: "history", label: "História", icon: Newspaper },
  { key: "squad", label: "Elenco", icon: Users },
  { key: "tactics", label: "Tática", icon: Shield },
  { key: "calendar", label: "Calendário", icon: CalendarDays },
  { key: "table", label: "Tabela", icon: ListOrdered },
  { key: "transfers", label: "Transferências", icon: Repeat2 },
  { key: "academy", label: "Base", icon: GraduationCap },
];

const sectionMenus: Record<View, string[]> = {
  dashboard: ["Resumo", "Eventos", "Próximo jogo"],
  club: ["Identidade", "Estádio", "Patrocínios"],
  history: ["Memória", "Jornal", "Rede social"],
  squad: ["Elenco", "Numeração", "Contratos"],
  tactics: ["Formação", "Perfil", "Sinergias"],
  calendar: ["Jogos", "Resultados"],
  table: ["Classificação", "Critérios"],
  transfers: ["Mercado", "Alvos"],
  academy: ["Promessas", "Desenvolvimento"],
};

export default function Home() {
  const [clubName, setClubName] = useState("Aurora FC");
  const [view, setView] = useState<View>("dashboard");
  const [activeSectionMenu, setActiveSectionMenu] = useState("Resumo");
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [state, setState] = useState<GameState>(() => createGame("Aurora FC"));

  const team = userTeam(state);
  const selected = lineupPlayers(state);
  const buffs = useMemo(() => calculateBuffs(selected, state.strategy), [selected, state.strategy]);
  const tacticalProfile = useMemo(() => calculateTacticalProfile(state), [state]);
  const table = sortedTable(state);
  const position = table.findIndex((row) => row.id === team.id) + 1;
  const next = nextUserMatch(state);

  function update(mutator: (draft: GameState) => void) {
    setState((current) => {
      const draft = structuredClone(current) as GameState;
      mutator(draft);
      return draft;
    });
  }

  function resetGame() {
    setState(createGame(clubName.trim() || "Aurora FC"));
    setView("dashboard");
  }

  function changeView(nextView: View) {
    setView(nextView);
    setActiveSectionMenu(sectionMenus[nextView][0]);
  }

  function updateShirtNumber(playerId: string, shirtNumber: number) {
    update((draft) => {
      const player = userTeam(draft).squad.find((item) => item.id === playerId)
        ?? draft.market.find((item) => item.id === playerId)
        ?? draft.academy.find((item) => item.id === playerId);
      if (player) {
        player.shirtNumber = Math.max(1, Math.min(99, shirtNumber || 1));
      }
    });
  }

  function togglePlayer(id: string) {
    update((draft) => {
      const draftTeam = userTeam(draft);
      const player = draftTeam.squad.find((item) => item.id === id);
      if (!player) {
        return;
      }

      if (!player.selected && selectedPlayers(draftTeam).length >= 11) {
        draft.log.unshift("O XI já tem 11 jogadores. Remova alguém antes de escalar outro.");
        return;
      }

      if (player.selected && selectedPlayers(draftTeam).length <= 1) {
        return;
      }

      if (player.selected) {
        draft.lineup.forEach((assignment) => {
          if (assignment.playerId === player.id) {
            assignment.playerId = null;
          }
        });
      } else {
        const openSlot = draft.lineup.find((assignment) => !assignment.playerId);
        if (openSlot) {
          openSlot.playerId = player.id;
        }
      }
      player.selected = !player.selected;
    });
  }

  function buyPlayer(id: string) {
    update((draft) => {
      const player = draft.market.find((item) => item.id === id);
      if (!player || draft.budget < player.value) {
        return;
      }

      draft.budget = Number((draft.budget - player.value).toFixed(1));
      userTeam(draft).squad.push(player);
      draft.market = draft.market.filter((item) => item.id !== id);
      draft.log.unshift(`${player.name} chegou por ${money(player.value)}.`);
      addNews(draft, {
        source: "Mercado",
        title: `${player.name} é apresentado como reforço`,
        body: `A diretoria investiu ${money(player.value)} para adicionar ${styleDefs[player.styles[0]].name.toLowerCase()} ao projeto esportivo.`,
        tone: "positive",
      });
      addSocialPost(draft, {
        author: "@mercado_da_bola",
        content: `${player.name} no ${userTeam(draft).name}. Agora quero ver se encaixa no plano.`,
        sentiment: "flat",
      });
    });
  }

  function sellPlayer(id: string) {
    update((draft) => {
      const draftTeam = userTeam(draft);
      const player = draftTeam.squad.find((item) => item.id === id);
      if (!player) {
        return;
      }

      draftTeam.squad = draftTeam.squad.filter((item) => item.id !== id);
      draft.budget = Number((draft.budget + player.value * 0.7).toFixed(1));
      draft.log.unshift(`${player.name} foi vendido por ${money(player.value * 0.7)}.`);
      addNews(draft, {
        source: "Mercado",
        title: `${player.name} deixa o clube`,
        body: `A saída abre espaço no elenco e rende ${money(player.value * 0.7)} ao orçamento.`,
        tone: "neutral",
      });
    });
  }

  function promoteYouth(id: string) {
    update((draft) => {
      const player = draft.academy.find((item) => item.id === id);
      if (!player) {
        return;
      }

      userTeam(draft).squad.push(player);
      draft.academy = draft.academy.filter((item) => item.id !== id);
      draft.log.unshift(`${player.name} subiu da base com potencial ${player.potential}.`);
      addNews(draft, {
        source: "Base",
        title: `${player.name} vira nova aposta da base`,
        body: `O jovem chega ao profissional com potencial ${player.potential} e estilo ${styleDefs[player.styles[0]].name.toLowerCase()}.`,
        tone: "positive",
      });
      addSocialPost(draft, {
        author: `@${draft.history.supporterGroup.replace(/\s/g, "").toLowerCase()}`,
        content: `Cria da casa no profissional. ${player.name}, a torcida vai cobrar, mas vai abraçar também.`,
        sentiment: "up",
      });
      refreshLegends(draft);
    });
  }

  function updateClubName(name: string) {
    setClubName(name);
    update((draft) => {
      userTeam(draft).name = name.trim() || "Aurora FC";
    });
  }

  function signSponsor(id: string) {
    update((draft) => {
      const sponsor = draft.sponsors.find((item) => item.id === id);
      if (!sponsor || sponsor.signed) {
        return;
      }

      if (draft.fans < sponsor.fanExpectation) {
        draft.log.unshift(`${sponsor.name} quer uma torcida mais engajada antes de assinar.`);
        return;
      }

      sponsor.signed = true;
      draft.budget = Number((draft.budget + sponsor.upfront).toFixed(1));
      draft.log.unshift(`${sponsor.name} assinou como patrocinador ${sponsor.tier}. Entrada de ${money(sponsor.upfront)}.`);
      addNews(draft, {
        source: "Clube",
        title: `${sponsor.name} fecha com o ${userTeam(draft).name}`,
        body: `O acordo ${sponsor.tier.toLowerCase()} injeta ${money(sponsor.upfront)} e reforça o crescimento comercial do clube.`,
        tone: "positive",
      });
    });
  }

  function upgradeStadium(kind: "capacity" | "atmosphere" | "facilities") {
    update((draft) => {
      const costs = {
        capacity: 2.8,
        atmosphere: 1.4,
        facilities: 1.8,
      };
      const cost = costs[kind];

      if (draft.budget < cost) {
        draft.log.unshift("Orçamento insuficiente para essa melhoria do estádio.");
        return;
      }

      draft.budget = Number((draft.budget - cost).toFixed(1));
      if (kind === "capacity") {
        draft.stadium.capacity += 3000;
        draft.stadium.level += 1;
        draft.log.unshift(`${draft.stadium.name} ganhou novo setor. Capacidade: ${draft.stadium.capacity.toLocaleString("pt-BR")}.`);
        addNews(draft, {
          source: "Clube",
          title: `${draft.stadium.name} terá novo setor`,
          body: `A expansão aumenta a capacidade para ${draft.stadium.capacity.toLocaleString("pt-BR")} torcedores e sinaliza ambição estrutural.`,
          tone: "positive",
        });
      }
      if (kind === "atmosphere") {
        draft.stadium.atmosphere = Math.min(100, draft.stadium.atmosphere + 8);
        draft.fans = Math.min(100, draft.fans + 2);
        draft.log.unshift("A atmosfera do estádio melhorou. A torcida começa a se reconhecer mais no clube.");
        addSocialPost(draft, {
          author: `@${draft.history.supporterGroup.replace(/\s/g, "").toLowerCase()}`,
          content: `Arquibancada com mais cara de casa. Esse estádio está começando a ter alma.`,
          sentiment: "up",
        });
      }
      if (kind === "facilities") {
        draft.stadium.facilities = Math.min(100, draft.stadium.facilities + 8);
        draft.log.unshift("As instalações do clube foram modernizadas.");
        addNews(draft, {
          source: "Clube",
          title: `Instalações modernizadas no centro do projeto`,
          body: `A melhoria aumenta a estrutura para elenco e base, aproximando o clube de uma gestão mais profissional.`,
          tone: "positive",
        });
      }
    });
  }

  return (
    <main className="min-h-screen bg-[#111413] text-[#f4f1ea]">
      <header className="flex flex-col gap-4 border-b border-[#2b302d] bg-[#181c1a] px-5 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.22)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase text-[#d4af37]">Matchday room</p>
          <h1 className="text-2xl font-black text-[#f4f1ea]">Soccer Architect</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="grid gap-1 text-xs font-bold uppercase text-[#aeb7b0]">
            Clube
            <input
              value={clubName}
              maxLength={24}
              onChange={(event) => updateClubName(event.target.value)}
              className="h-10 rounded-md border border-[#343b37] bg-[#0e1110] px-3 text-sm text-[#f4f1ea] outline-none focus:border-[#d4af37]"
            />
          </label>
          <button onClick={resetGame} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#d4af37] px-4 font-extrabold text-[#111413]">
            <RefreshCw size={17} />
            Nova carreira
          </button>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="flex gap-2 overflow-x-auto border-b border-[#2b302d] bg-[#161a18] p-4 lg:flex-col lg:border-b-0 lg:border-r">
          {views.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => changeView(item.key)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-3 text-left text-sm ${
                  view === item.key ? "border-[#d4af37] bg-[#2a2518] text-[#f4f1ea]" : "border-transparent bg-[#161a18] text-[#aeb7b0] hover:border-[#3a413d] hover:text-[#f4f1ea]"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </button>
            );
          })}
        </aside>

        <section className="p-5">
          <div className="mb-5 flex flex-wrap gap-2 rounded-lg border border-[#303632] bg-[#1b201d] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {sectionMenus[view].map((item) => (
              <button
                key={item}
                onClick={() => setActiveSectionMenu(item)}
                className={`h-9 rounded-md px-3 text-sm font-bold ${
                  activeSectionMenu === item ? "bg-[#f4f1ea] text-[#111413]" : "text-[#aeb7b0] hover:bg-[#242a27] hover:text-[#f4f1ea]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {view === "dashboard" && (
            <Dashboard section={activeSectionMenu} state={state} position={position} nextLabel={next ? matchLabel(next, state) : "Temporada encerrada"} buffs={buffs.active} />
          )}

          {view === "club" && (
            <ClubView
              section={activeSectionMenu}
              state={state}
              onUpdate={update}
              onSignSponsor={signSponsor}
              onRefreshSponsors={() => update((draft) => {
                draft.sponsors = [
                  ...draft.sponsors.filter((sponsor) => sponsor.signed),
                  ...createSponsorOffers(),
                ].slice(0, 6);
                draft.log.unshift("Novas propostas de patrocínio chegaram à mesa.");
              })}
              onUpgradeStadium={upgradeStadium}
            />
          )}

          {view === "history" && (
            <HistoryView section={activeSectionMenu} state={state} />
          )}

          {view === "squad" && (
            <ViewShell title="Elenco" action={<Button onClick={() => update(autoSelect)} icon={Dumbbell}>Escalar melhores</Button>}>
              {activeSectionMenu === "Contratos" ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <Metric label="Folha estimada" value={money(team.squad.reduce((sum, player) => sum + player.value * 0.03, 0))} />
                  <Metric label="Valor do elenco" value={money(team.squad.reduce((sum, player) => sum + player.value, 0))} />
                  <Metric label="Jogadores" value={team.squad.length.toString()} />
                </div>
              ) : (
                <PlayerGrid players={team.squad} strategy={state.strategy} onNumberChange={updateShirtNumber} action={(player) => (
                  <>
                    <Button onClick={() => togglePlayer(player.id)}>{player.selected ? "Remover do XI" : "Escalar"}</Button>
                    <Button onClick={() => sellPlayer(player.id)}>Vender</Button>
                  </>
                )} />
              )}
            </ViewShell>
          )}

          {view === "tactics" && (
            <ViewShell title="Tática" action={<Button primary onClick={() => update(simulateNextUserMatch)} icon={Play}>Simular próximo jogo</Button>}>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
                <div className="min-w-0">
                  {activeSectionMenu !== "Perfil" && (
                  <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
                      Estratégia
                      <select
                        value={state.strategy}
                        onChange={(event) => update((draft) => {
                          draft.strategy = event.target.value as StrategyKey;
                          userTeam(draft).strategy = event.target.value as StrategyKey;
                        })}
                        className="h-10 rounded-md border border-[#343b37] bg-[#101312] px-3 text-[#f4f1ea]"
                      >
                        {Object.entries(strategies).map(([key, strategy]) => (
                          <option key={key} value={key}>{strategy.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
                      Esquema
                      <select
                        value={state.formation}
                        onChange={(event) => update((draft) => setFormation(draft, event.target.value as FormationKey))}
                        className="h-10 rounded-md border border-[#343b37] bg-[#101312] px-3 text-[#f4f1ea]"
                      >
                        {Object.values(formationDefs).map((formation) => (
                          <option key={formation.key} value={formation.key}>{formation.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <InfoCard title={strategies[state.strategy].name} muted={strategies[state.strategy].desc} />
                    <InfoCard title={formationDefs[state.formation].name} muted={`Forte: ${formationDefs[state.formation].strength} Fraco: ${formationDefs[state.formation].weakness}`} />
                  </div>
                  <Formation
                    state={state}
                    selectedSlotId={selectedSlotId}
                    onSelectSlot={setSelectedSlotId}
                    onCloseModal={() => setSelectedSlotId(null)}
                    onAssign={(slotId, playerId) => update((draft) => assignPlayerToSlot(draft, slotId, playerId))}
                  />
                  </>
                  )}
                </div>
                <div className="min-w-0">
                  {activeSectionMenu !== "Sinergias" && (
                  <>
                  <h3 className="mb-3 text-lg font-extrabold">Perfil coletivo</h3>
                  <div className="mb-4 grid gap-3 md:grid-cols-2">
                    <Metric label="Ofensividade" value={`${tacticalProfile.attack}/100`} />
                    <Metric label="Defesa" value={`${tacticalProfile.defense}/100`} />
                    <Metric label="Controle" value={`${tacticalProfile.control}/100`} />
                    <Metric label="Encaixe" value={`${tacticalProfile.fit}%`} />
                  </div>
                  <InfoCard
                    title={tacticalProfile.missing ? `${tacticalProfile.missing} posição sem jogador` : "XI completo"}
                    muted="Atacantes, pontas e meias aumentam ofensividade; volantes, laterais, zagueiros e goleiro fortalecem defesa. Improvisações reduzem o encaixe."
                  />
                  </>
                  )}
                  {activeSectionMenu !== "Perfil" && (
                  <>
                  <h3 className="mb-3 mt-5 text-lg font-extrabold">Sinergia por estilo</h3>
                  <div className="grid gap-3">
                    {Object.entries(styleDefs).map(([key, def]) => {
                      const count = buffs.counts[key as keyof typeof buffs.counts] ?? 0;
                      const active = count >= def.threshold;
                      return (
                        <InfoCard key={key} title={`${def.name} ${active ? "ativo" : `${count}/${def.threshold}`}`} muted={`${def.buff}: ${def.desc}`} />
                      );
                    })}
                  </div>
                  </>
                  )}
                </div>
              </div>
            </ViewShell>
          )}

          {view === "calendar" && (
            <ViewShell title="Calendário" action={<Button onClick={() => update(simulateAll)} icon={Play}>Simular até o fim</Button>}>
              <div className="grid gap-3">
                {state.schedule.filter((match) => activeSectionMenu === "Resultados" ? match.played : !match.played).map((match) => (
                  <InfoCard
                    key={match.id}
                    title={`Semana ${match.week}: ${matchLabel(match, state)}`}
                    muted={match.played ? `${match.goalsHome} x ${match.goalsAway}` : "A jogar"}
                  />
                ))}
              </div>
            </ViewShell>
          )}

          {view === "table" && (
            <ViewShell title="Tabela da liga">
              {activeSectionMenu === "Critérios" ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <InfoCard title="Pontuação" muted="Vitória vale 3 pontos, empate vale 1 ponto e derrota não pontua." />
                  <InfoCard title="Desempate" muted="A classificação usa pontos, saldo de gols e gols marcados." />
                  <InfoCard title="Seu clube" muted="A linha do clube criado aparece destacada na tabela." />
                </div>
              ) : (
              <div className="overflow-x-auto rounded-lg">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#252a26] text-xs uppercase text-[#aeb7b0]">
                      {["#", "Clube", "J", "V", "E", "D", "GP", "GC", "SG", "Pts"].map((head) => <th key={head} className="border-b border-[#303632] p-3">{head}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {table.map((row, index) => (
                      <tr key={row.id} className={row.isUser ? "bg-[#2a2518] font-extrabold" : "bg-[#1b201d]"}>
                        <td className="border-b border-[#303632] p-3">{index + 1}</td>
                        <td className="border-b border-[#303632] p-3">{row.name}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.played}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.won}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.drawn}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.lost}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.gf}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.ga}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.gf - row.stats.ga}</td>
                        <td className="border-b border-[#303632] p-3">{row.stats.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </ViewShell>
          )}

          {view === "transfers" && (
            <ViewShell title="Mercado" action={<Button onClick={() => update((draft) => {
              draft.market = Array.from({ length: 8 }, () => createPlayer({ base: 58, age: 22 }));
            })} icon={RefreshCw}>Atualizar mercado</Button>}>
              {activeSectionMenu === "Alvos" ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <InfoCard title="Sugestão" muted="Procure jogadores com estilos que faltam para ativar buffs coletivos." />
                  <InfoCard title="Orçamento" muted={`Disponível: ${money(state.budget)}`} />
                  <InfoCard title="Prioridade" muted="Contrate por encaixe tático, não apenas por OVR." />
                </div>
              ) : (
              <PlayerGrid players={state.market} strategy={state.strategy} onNumberChange={updateShirtNumber} action={(player) => (
                <Button onClick={() => buyPlayer(player.id)} disabled={state.budget < player.value} icon={BadgeEuro}>
                  Comprar {money(player.value)}
                </Button>
              )} />
              )}
            </ViewShell>
          )}

          {view === "academy" && (
            <ViewShell title="Base do clube" action={<Button primary onClick={() => update((draft) => {
              const youth = createYouth();
              draft.academy.unshift(youth);
              draft.log.unshift(`${youth.name} apareceu na base com estilo ${styleDefs[youth.styles[0]].name}.`);
              addNews(draft, {
                source: "Base",
                title: `${youth.name} chama atenção nos treinos da base`,
                body: `Olheiros internos veem potencial ${youth.potential} e traços de ${styleDefs[youth.styles[0]].name.toLowerCase()} no jovem.`,
                tone: "positive",
              });
              addSocialPost(draft, {
                author: "@base_watch",
                content: `${youth.name} é nome para guardar. Ainda cru, mas tem cheiro de projeto de longo prazo.`,
                sentiment: "up",
              });
            })} icon={Sparkles}>Gerar jovem</Button>}>
              {activeSectionMenu === "Desenvolvimento" ? (
                <div className="grid gap-3 md:grid-cols-3">
                  <Metric label="Promessas" value={state.academy.length.toString()} />
                  <Metric label="Maior potencial" value={Math.max(...state.academy.map((player) => player.potential), 0).toString()} />
                  <InfoCard title="Plano" muted="Promova jovens que combinem potencial alto com estilos ausentes no elenco principal." />
                </div>
              ) : (
              <>
              <div className="mb-4 rounded-lg border border-[#303632] bg-[#1b201d] p-4 text-[#aeb7b0]">
                <strong className="text-[#f4f1ea]">Ideia central:</strong> jovens nascem com potencial, personalidade tática e estilos raros. A graça é formar elencos que ativam buffs coletivos.
              </div>
              <PlayerGrid players={state.academy} strategy={state.strategy} onNumberChange={updateShirtNumber} action={(player) => (
                <Button onClick={() => promoteYouth(player.id)}>Promover</Button>
              )} />
              </>
              )}
            </ViewShell>
          )}
        </section>
      </div>
    </main>
  );
}

function HistoryView({ section, state }: { section: string; state: GameState }) {
  const team = userTeam(state);
  const reputation = Object.entries(state.history.reputation).sort((a, b) => b[1] - a[1]);

  return (
    <ViewShell title="História" action={<span className="rounded-full bg-[#252a26] px-3 py-2 text-sm font-bold text-[#d9eee0]">Fundado em {state.history.foundedYear}</span>}>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {section === "Memória" && (
        <section className="grid gap-4">
          <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-4">
            <div className="mb-4 flex items-center gap-4">
              <div
                className="grid h-20 w-20 place-items-center rounded-lg border-2 text-4xl font-black"
                style={{
                  backgroundColor: state.club.primaryColor,
                  borderColor: state.club.secondaryColor,
                  color: state.club.secondaryColor,
                }}
              >
                {state.club.crestSymbol.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase text-[#d4af37]">Memória do clube</p>
                <h3 className="text-3xl font-black">{team.name}</h3>
                <p className="text-[#aeb7b0]">{state.club.motto}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <InfoCard title="Rivalidade local" muted={state.history.rivalName} />
              <InfoCard title="Torcida organizada" muted={state.history.supporterGroup} />
              <InfoCard title="Maior vitória" muted={state.history.records.biggestWin} />
              <InfoCard title="Sequência invicta" muted={`${state.history.records.unbeatenRun} jogos`} />
              <InfoCard title="Artilheiro histórico" muted={`${state.history.records.topScorerName} (${state.history.records.topScorerGoals} gols)`} />
              <InfoCard title="Cara da base" muted={`${state.history.records.academyFaceName} (${state.history.records.academyFaceLegacy} legado)`} />
            </div>
          </div>

          <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Trophy size={18} />
              <h3 className="text-lg font-extrabold">Conquistas e Ídolos</h3>
            </div>
            <div className="mb-4 grid gap-2">
              {state.history.trophies.length ? state.history.trophies.map((trophy) => (
                <InfoCard key={trophy} title={trophy} muted="Título oficial do projeto" />
              )) : <InfoCard muted="Nenhuma conquista ainda. A sala de troféus espera seu primeiro capítulo." />}
            </div>
            <div className="grid gap-2">
              {state.history.legends.length ? state.history.legends.map((legend) => (
                <div key={legend.playerId} className="flex items-center justify-between gap-3 rounded-lg border border-[#303632] bg-[#101312] p-3">
                  <div>
                    <strong className="block">{legend.name}</strong>
                    <span className="text-sm text-[#aeb7b0]">{legend.reason}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#252a26] px-2 py-1 text-xs font-black text-[#d9eee0]">
                    <Star size={13} />
                    {legend.legacy}
                  </span>
                </div>
              )) : <InfoCard muted="Ídolos ainda serão construídos por jogos, gols e momentos de base." />}
            </div>
          </div>

          <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Flame size={18} />
              <h3 className="text-lg font-extrabold">Reputação por estilo</h3>
            </div>
            <div className="grid gap-3">
              {reputation.map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{strategies[key as StrategyKey].name}</span>
                    <span className="text-[#aeb7b0]">{value}/100</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#101312]">
                    <div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {section !== "Memória" && (
        <section className="grid gap-4">
          {section === "Jornal" && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Newspaper size={18} />
              <h3 className="text-lg font-extrabold">Jornal da Liga</h3>
            </div>
            <div className="grid gap-3">
              {state.history.news.map((item) => (
                <article key={item.id} className="rounded-lg border border-[#303632] bg-[#1b201d] p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-black ${item.tone === "positive" ? "bg-[#d4af37] text-[#0b0f0e]" : item.tone === "negative" ? "bg-[#e46f61] text-[#0b0f0e]" : "bg-[#252a26] text-[#d9eee0]"}`}>
                      {item.source}
                    </span>
                    <span className="text-xs font-bold uppercase text-[#aeb7b0]">Semana {item.week}</span>
                  </div>
                  <strong className="block text-lg">{item.title}</strong>
                  <p className="mt-1 text-[#aeb7b0]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
          )}

          {section === "Rede social" && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <MessageCircle size={18} />
              <h3 className="text-lg font-extrabold">Rede social</h3>
            </div>
            <div className="grid gap-3">
              {state.history.socials.map((post) => (
                <article key={post.id} className="rounded-lg border border-[#303632] bg-[#1b201d] p-3">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <strong>{post.author}</strong>
                    <span className={`rounded-full px-2 py-1 text-xs font-black ${post.sentiment === "up" ? "bg-[#d4af37] text-[#0b0f0e]" : post.sentiment === "down" ? "bg-[#e46f61] text-[#0b0f0e]" : "bg-[#252a26] text-[#d9eee0]"}`}>
                      {post.sentiment === "up" ? "alta" : post.sentiment === "down" ? "crítica" : "neutro"}
                    </span>
                  </div>
                  <p className="text-[#d9eee0]">{post.content}</p>
                  <span className="mt-2 block text-xs font-bold uppercase text-[#aeb7b0]">Semana {post.week}</span>
                </article>
              ))}
            </div>
          </div>
          )}
        </section>
        )}
      </div>
    </ViewShell>
  );
}

function ClubView({
  section,
  state,
  onUpdate,
  onSignSponsor,
  onRefreshSponsors,
  onUpgradeStadium,
}: {
  section: string;
  state: GameState;
  onUpdate: (mutator: (draft: GameState) => void) => void;
  onSignSponsor: (id: string) => void;
  onRefreshSponsors: () => void;
  onUpgradeStadium: (kind: "capacity" | "atmosphere" | "facilities") => void;
}) {
  const team = userTeam(state);
  const signedSponsors = state.sponsors.filter((sponsor) => sponsor.signed);
  const sponsorIncome = signedSponsors.reduce((sum, sponsor) => sum + sponsor.perMatch, 0);

  return (
    <ViewShell title="Clube" action={<Button onClick={onRefreshSponsors} icon={Handshake}>Buscar propostas</Button>}>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        {section === "Identidade" && (
        <section className="grid gap-4">
          <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-4">
            <div className="mb-4 flex items-center gap-4">
              <div
                className="grid h-24 w-24 shrink-0 place-items-center rounded-lg border-2 text-5xl font-black"
                style={{
                  backgroundColor: state.club.primaryColor,
                  borderColor: state.club.secondaryColor,
                  color: state.club.secondaryColor,
                }}
              >
                {state.club.crestSymbol.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase text-[#d4af37]">Identidade</p>
                <h3 className="text-3xl font-black">{team.name}</h3>
                <p className="mt-1 text-[#aeb7b0]">{state.club.motto}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
                Símbolo
                <input
                  value={state.club.crestSymbol}
                  maxLength={2}
                  onChange={(event) => onUpdate((draft) => {
                    draft.club.crestSymbol = event.target.value || "A";
                  })}
                  className="h-10 rounded-md border border-[#343b37] bg-[#101312] px-3 text-[#f4f1ea]"
                />
              </label>
              <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
                Lema
                <input
                  value={state.club.motto}
                  maxLength={48}
                  onChange={(event) => onUpdate((draft) => {
                    draft.club.motto = event.target.value;
                  })}
                  className="h-10 rounded-md border border-[#343b37] bg-[#101312] px-3 text-[#f4f1ea]"
                />
              </label>
              <ColorField label="Cor principal" value={state.club.primaryColor} onChange={(value) => onUpdate((draft) => {
                draft.club.primaryColor = value;
              })} />
              <ColorField label="Cor secundária" value={state.club.secondaryColor} onChange={(value) => onUpdate((draft) => {
                draft.club.secondaryColor = value;
              })} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Metric label="Torcida" value={`${state.fans}/100`} />
            <Metric label="Valor do clube" value={clubValueScore(state).toString()} />
            <Metric label="Receita casa" value={money(stadiumRevenue(state))} />
          </div>
        </section>
        )}

        {section !== "Identidade" && (
        <section className="grid gap-4">
          {section === "Estádio" && (
          <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-[#d4af37]">Estádio</p>
                <input
                  value={state.stadium.name}
                  maxLength={32}
                  onChange={(event) => onUpdate((draft) => {
                    draft.stadium.name = event.target.value;
                  })}
                  className="mt-1 h-10 w-full rounded-md border border-[#343b37] bg-[#101312] px-3 text-xl font-black text-[#f4f1ea] sm:w-72"
                />
              </div>
              <span className="rounded-full bg-[#252a26] px-3 py-1 text-sm font-bold text-[#d9eee0]">Nível {state.stadium.level}</span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Metric label="Capacidade" value={state.stadium.capacity.toLocaleString("pt-BR")} />
              <Metric label="Atmosfera" value={`${state.stadium.atmosphere}/100`} />
              <Metric label="Instalações" value={`${state.stadium.facilities}/100`} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Button onClick={() => onUpgradeStadium("capacity")} icon={Building2}>Expandir {money(2.8)}</Button>
              <Button onClick={() => onUpgradeStadium("atmosphere")} icon={Ticket}>Arquibancada {money(1.4)}</Button>
              <Button onClick={() => onUpgradeStadium("facilities")} icon={Dumbbell}>Instalações {money(1.8)}</Button>
            </div>

            <label className="mt-4 grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
              Preço do ingresso: €{state.stadium.ticketPrice}
              <input
                type="range"
                min={12}
                max={60}
                value={state.stadium.ticketPrice}
                onChange={(event) => onUpdate((draft) => {
                  draft.stadium.ticketPrice = Number(event.target.value);
                })}
                className="accent-[#d4af37]"
              />
            </label>
          </div>
          )}

          {section === "Patrocínios" && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-extrabold">Patrocinadores</h3>
              <span className="text-sm text-[#aeb7b0]">Fixo/jogo: {money(sponsorIncome)}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {state.sponsors.map((sponsor) => (
                <article key={sponsor.id} className="grid gap-3 rounded-lg border border-[#303632] bg-[#1b201d] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong className="block">{sponsor.name}</strong>
                      <span className="text-sm text-[#aeb7b0]">{sponsor.tier} • exige torcida {sponsor.fanExpectation}/100</span>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-black ${sponsor.signed ? "bg-[#d4af37] text-[#0b0f0e]" : "bg-[#252a26] text-[#d9eee0]"}`}>
                      {sponsor.signed ? "Ativo" : "Oferta"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <Attr label="Entrada" value={sponsor.upfront} />
                    <Attr label="Jogo" value={sponsor.perMatch} />
                    <Attr label="Vitória" value={sponsor.winBonus} />
                  </div>
                  <Button onClick={() => onSignSponsor(sponsor.id)} disabled={sponsor.signed || state.fans < sponsor.fanExpectation} icon={Handshake}>
                    {sponsor.signed ? "Contrato ativo" : "Assinar"}
                  </Button>
                </article>
              ))}
            </div>
          </div>
          )}
        </section>
        )}
      </div>
    </ViewShell>
  );
}

function Dashboard({ section, state, position, nextLabel, buffs }: { section: string; state: GameState; position: number; nextLabel: string; buffs: ReturnType<typeof calculateBuffs>["active"] }) {
  const team = userTeam(state);
  const selected = selectedPlayers(team);

  return (
    <div>
      {section === "Resumo" && (
      <>
      <div className="mb-5 grid min-h-[300px] gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col justify-center gap-3">
          <p className="text-xs font-extrabold uppercase text-[#d4af37]">Temporada {state.year}</p>
          <h2 className="max-w-3xl text-5xl font-black leading-none md:text-7xl">{team.name}: identidade antes de reputação</h2>
          <p className="max-w-2xl text-lg leading-8 text-[#aeb7b0]">Monte um XI por estilos, ative buffs coletivos e veja se a tática sobrevive a uma temporada inteira.</p>
        </div>
        <MiniPitch state={state} />
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Posição" value={`${position}º`} />
        <Metric label="Próximo jogo" value={nextLabel} />
        <Metric label="Força XI" value={Math.round(teamPower(team, state)).toString()} />
        <Metric label="Orçamento" value={money(state.budget)} />
      </div>
      </>
      )}

      {section === "Próximo jogo" && (
        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Próximo jogo" value={nextLabel} />
          <Metric label="Força XI" value={Math.round(teamPower(team, state)).toString()} />
          <Metric label="Esquema" value={formationDefs[state.formation].name} />
        </div>
      )}

      {section !== "Próximo jogo" && (
      <div className="grid gap-4 xl:grid-cols-2">
        {section === "Resumo" && (
        <section>
          <h3 className="mb-3 text-lg font-extrabold">Buffs ativos</h3>
          <div className="grid gap-3">
            {buffs.length ? buffs.map((buff) => (
              <InfoCard key={buff.key} title={`${buff.buff} +${buff.points}`} muted={`${buff.count}/${buff.threshold} jogadores com ${buff.name}. ${buff.desc}`} />
            )) : <InfoCard title="Nenhum buff ativo" muted="Escolha jogadores com estilos complementares." />}
          </div>
        </section>
        )}
        {section === "Eventos" && (
        <section>
          <h3 className="mb-3 text-lg font-extrabold">Últimos eventos</h3>
          <div className="grid gap-3">
            {state.log.slice(0, 6).map((event) => <InfoCard key={event} muted={event} />)}
          </div>
        </section>
        )}
      </div>
      )}
    </div>
  );
}

function ViewShell({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black text-[#f4f1ea]">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Button({ children, onClick, disabled, primary = false, icon: Icon }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; primary?: boolean; icon?: React.ComponentType<{ size?: number }> }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-bold ${
        primary ? "border-[#d4af37] bg-[#d4af37] text-[#111413]" : "border-[#343b37] bg-[#1b201d] text-[#f4f1ea] hover:border-[#d4af37]"
      }`}
    >
      {Icon ? <Icon size={17} /> : null}
      {children}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-4 shadow-[0_12px_28px_rgba(0,0,0,0.22)]">
      <span className="block text-xs font-bold uppercase text-[#aeb7b0]">{label}</span>
      <strong className="mt-2 block text-xl text-[#f4f1ea]">{value}</strong>
    </div>
  );
}

function InfoCard({ title, muted }: { title?: string; muted?: string }) {
  return (
    <div className="rounded-lg border border-[#303632] bg-[#1b201d] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
      {title ? <strong className="block text-[#f4f1ea]">{title}</strong> : null}
      {muted ? <span className="text-[#aeb7b0]">{muted}</span> : null}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
      {label}
      <span className="flex h-10 overflow-hidden rounded-md border border-[#343b37] bg-[#101312]">
        <span className="grid w-11 place-items-center border-r border-[#343b37]">
          <Palette size={16} />
        </span>
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-14 bg-transparent p-1" />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-[#f4f1ea]" />
      </span>
    </label>
  );
}

function PlayerGrid({
  players,
  strategy,
  onNumberChange,
  action,
}: {
  players: Player[];
  strategy: StrategyKey;
  onNumberChange: (playerId: string, shirtNumber: number) => void;
  action: (player: Player) => React.ReactNode;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {players.map((player) => (
        <article key={player.id} className="grid gap-3 rounded-lg border border-[#303632] bg-[#1b201d] p-4 shadow-[0_14px_32px_rgba(0,0,0,0.24)]">
          <div className="flex items-start gap-3">
            <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-[#d4af37]/50 bg-[#252a26] text-[#f4f1ea]">
              <Shirt size={38} strokeWidth={1.8} />
              <span className="absolute inset-x-0 top-6 text-center text-sm font-black text-[#d4af37]">{player.shirtNumber}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <strong className="block truncate text-[#f4f1ea]">{player.name}</strong>
                  <span className="text-sm text-[#aeb7b0]">{player.position} • {player.age} anos • OVR {Math.round(averageAttributes(player))} • POT {player.potential}</span>
                </div>
                <span className={`grid h-8 min-w-8 place-items-center rounded-full px-2 text-xs font-black ${player.selected ? "bg-[#d4af37] text-[#111413]" : "bg-[#101312] text-[#f4f1ea]"}`}>
                  {player.selected ? "XI" : rating(player, strategy)}
                </span>
              </div>
              <label className="mt-3 flex w-28 items-center gap-2 rounded-md border border-[#343b37] bg-[#101312] px-2 text-xs font-bold text-[#aeb7b0]">
                <Hash size={13} />
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={player.shirtNumber}
                  onChange={(event) => onNumberChange(player.id, Number(event.target.value))}
                  className="h-8 min-w-0 flex-1 bg-transparent text-[#f4f1ea] outline-none"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {player.styles.map((style) => (
              <span key={style} className="rounded-full bg-[#252a26] px-2 py-1 text-xs font-bold text-[#d8ded8]">{styleDefs[style].name}</span>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Attr label="TEC" value={player.attributes.technical} />
            <Attr label="MEN" value={player.attributes.mental} />
            <Attr label="FIS" value={player.attributes.physical} />
            <Attr label="DEF" value={player.attributes.defense} />
          </div>
          <div className="flex flex-wrap gap-2">{action(player)}</div>
        </article>
      ))}
    </div>
  );
}

function Attr({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid gap-1 rounded-md bg-[#101312] p-2 text-[#f4f1ea]">
      <small className="text-[11px] font-extrabold text-[#aeb7b0]">{label}</small>
      {value}
    </div>
  );
}

function MiniPitch({ state }: { state: GameState }) {
  const team = userTeam(state);
  const formation = formationDefs[state.formation];

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-lg border-2 border-[#b9e7c7] bg-[linear-gradient(135deg,#247348,#18573d)]">
      <div className="absolute bottom-0 left-1/2 top-0 border-l-2 border-white/70" />
      <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
      {formation.slots.map((slot) => {
        const assignment = state.lineup.find((item) => item.slotId === slot.id);
        const player = team.squad.find((item) => item.id === assignment?.playerId);

        return (
          <div key={slot.id} className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#f3f7f0] text-xs font-black text-[#122018] shadow-lg" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
            {player?.position ?? slot.label}
          </div>
        );
      })}
    </div>
  );
}

function Formation({
  state,
  selectedSlotId,
  onSelectSlot,
  onCloseModal,
  onAssign,
}: {
  state: GameState;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  onCloseModal: () => void;
  onAssign: (slotId: string, playerId: string | null) => void;
}) {
  const team = userTeam(state);
  const formation = formationDefs[state.formation];
  const selectedSlot = formation.slots.find((slot) => slot.id === selectedSlotId);
  const selectedAssignment = state.lineup.find((item) => item.slotId === selectedSlotId);
  const selectedPlayer = team.squad.find((item) => item.id === selectedAssignment?.playerId);

  return (
    <>
      <div className="relative mt-4 aspect-[16/10] w-full max-w-full overflow-hidden rounded-lg border border-[#5ed184] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.055)_0_11%,rgba(0,0,0,0.045)_11%_22%),linear-gradient(135deg,#26794e,#185b3d)] shadow-[0_20px_48px_rgba(0,0,0,0.28)]">
        <div className="absolute bottom-0 left-1/2 top-0 border-l-2 border-white/55" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/55" />
        <div className="absolute left-0 top-[30%] h-[40%] w-[15%] border-y-2 border-r-2 border-white/50" />
        <div className="absolute right-0 top-[30%] h-[40%] w-[15%] border-y-2 border-l-2 border-white/50" />

        {formation.slots.map((slot) => {
          const assignment = state.lineup.find((item) => item.slotId === slot.id);
          const player = team.squad.find((item) => item.id === assignment?.playerId);
          const fit = player ? Math.round(positionBadgeFit(player.position, slot.position) * 100) : 0;

          return (
            <button
              key={slot.id}
              onClick={() => onSelectSlot(slot.id)}
              className="absolute grid w-[78px] -translate-x-1/2 -translate-y-1/2 justify-items-center gap-1 text-center"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              title={player ? player.name : slot.label}
            >
              <span className={`relative grid h-14 w-14 place-items-center rounded-md border shadow-lg ${player ? "border-[#f4f1ea]/80 bg-[#f4f1ea] text-[#111413]" : "border-dashed border-white/70 bg-white/10 text-white"}`}>
                <Shirt size={38} strokeWidth={1.9} />
                <span className={`absolute inset-x-0 top-[22px] text-center text-sm font-black ${player ? "text-[#111413]" : "text-white"}`}>
                  {player?.shirtNumber ?? slot.label}
                </span>
                <span className={`absolute -right-2 -top-2 rounded-full px-1.5 py-0.5 text-[10px] font-black ${fit >= 95 ? "bg-[#d4af37] text-[#111413]" : fit >= 80 ? "bg-[#e0b64f] text-[#111413]" : "bg-[#e46f61] text-[#111413]"}`}>
                  {player ? fit : 0}
                </span>
              </span>
              <span className="max-w-[92px] truncate rounded bg-[#101312]/80 px-1.5 py-0.5 text-[11px] font-black text-[#f4f1ea]">
                {player ? player.name.split(" ").slice(-1)[0] : slot.label}
              </span>
            </button>
          );
        })}
      </div>

      {selectedSlot ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onCloseModal}>
          <div className="w-full max-w-xl rounded-lg border border-[#303632] bg-[#181c1a] p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase text-[#d4af37]">Posição {selectedSlot.label}</p>
                <h3 className="text-2xl font-black text-[#f4f1ea]">{selectedPlayer?.name ?? "Sem jogador escalado"}</h3>
                <p className="text-[#aeb7b0]">Encaixe: {selectedPlayer ? Math.round(positionBadgeFit(selectedPlayer.position, selectedSlot.position) * 100) : 0}%</p>
              </div>
              <button onClick={onCloseModal} className="rounded-md border border-[#343b37] px-3 py-1 text-sm font-bold text-[#f4f1ea]">Fechar</button>
            </div>

            <label className="mb-4 grid gap-2 text-xs font-bold uppercase text-[#aeb7b0]">
              Trocar jogador
              <select
                value={selectedPlayer?.id ?? ""}
                onChange={(event) => onAssign(selectedSlot.id, event.target.value || null)}
                className="h-11 rounded-md border border-[#343b37] bg-[#101312] px-3 text-[#f4f1ea]"
              >
                <option value="">Sem jogador</option>
                {team.squad.map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.position} #{candidate.shirtNumber} {candidate.name}
                  </option>
                ))}
              </select>
            </label>

            {selectedPlayer ? (
              <div className="grid gap-4 md:grid-cols-[120px_1fr]">
                <div className="relative grid h-28 w-28 place-items-center rounded-lg border border-[#d4af37]/60 bg-[#252a26] text-[#f4f1ea]">
                  <Shirt size={72} strokeWidth={1.8} />
                  <span className="absolute inset-x-0 top-[45px] text-center text-2xl font-black text-[#d4af37]">{selectedPlayer.shirtNumber}</span>
                </div>
                <div className="grid gap-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <InfoCard title="Posição natural" muted={selectedPlayer.position} />
                    <InfoCard title="Valor" muted={money(selectedPlayer.value)} />
                    <InfoCard title="Idade" muted={`${selectedPlayer.age} anos`} />
                    <InfoCard title="Potencial" muted={selectedPlayer.potential.toString()} />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Attr label="TEC" value={selectedPlayer.attributes.technical} />
                    <Attr label="MEN" value={selectedPlayer.attributes.mental} />
                    <Attr label="FIS" value={selectedPlayer.attributes.physical} />
                    <Attr label="DEF" value={selectedPlayer.attributes.defense} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlayer.styles.map((style) => (
                      <span key={style} className="rounded-full bg-[#252a26] px-2 py-1 text-xs font-bold text-[#d8ded8]">{styleDefs[style].name}</span>
                    ))}
                  </div>
                  <Button onClick={() => onAssign(selectedSlot.id, null)}>Remover da posição</Button>
                </div>
              </div>
            ) : (
              <InfoCard title="Posição vazia" muted="Escolha um jogador para ocupar este espaço no esquema." />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function positionBadgeFit(playerPosition: Player["position"], slotPosition: Player["position"]) {
  if (playerPosition === slotPosition) {
    return 1;
  }
  if (slotPosition === "GOL" || playerPosition === "GOL") {
    return 0.25;
  }

  const near: Record<Player["position"], Player["position"][]> = {
    GOL: ["GOL"],
    ZAG: ["VOL", "LE", "LD"],
    LE: ["ZAG", "VOL", "PE"],
    LD: ["ZAG", "VOL", "PD"],
    VOL: ["ZAG", "MC", "LE", "LD"],
    MC: ["VOL", "MEI", "PE", "PD"],
    MEI: ["MC", "PE", "PD", "ATA"],
    PE: ["MEI", "MC", "LE", "ATA"],
    PD: ["MEI", "MC", "LD", "ATA"],
    ATA: ["MEI", "PE", "PD"],
  };

  return near[slotPosition].includes(playerPosition) ? 0.82 : 0.58;
}
