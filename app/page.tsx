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
  Hash,
  LayoutDashboard,
  ListOrdered,
  MessageCircle,
  Newspaper,
  Palette,
  Play,
  RefreshCw,
  Repeat2,
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
type Icon = React.ComponentType<{ size?: number; strokeWidth?: number }>;

const views: Array<{ key: View; label: string; eyebrow: string; icon: Icon }> = [
  { key: "dashboard", label: "Capa", eyebrow: "jornal", icon: LayoutDashboard },
  { key: "club", label: "Clube", eyebrow: "diretoria", icon: Building2 },
  { key: "history", label: "Historia", eyebrow: "arquivo", icon: Newspaper },
  { key: "squad", label: "Elenco", eyebrow: "album", icon: Users },
  { key: "tactics", label: "Tatica", eyebrow: "prancheta", icon: Shield },
  { key: "calendar", label: "Agenda", eyebrow: "rodada", icon: CalendarDays },
  { key: "table", label: "Tabela", eyebrow: "liga", icon: ListOrdered },
  { key: "transfers", label: "Mercado", eyebrow: "classificados", icon: Repeat2 },
  { key: "academy", label: "Base", eyebrow: "olheiros", icon: GraduationCap },
];

const sectionMenus: Record<View, string[]> = {
  dashboard: ["Resumo", "Eventos", "Proximo jogo"],
  club: ["Identidade", "Estadio", "Patrocinios"],
  history: ["Memoria", "Jornal", "Rede social"],
  squad: ["Elenco", "Numeracao", "Contratos"],
  tactics: ["Formacao", "Perfil", "Sinergias"],
  calendar: ["Jogos", "Resultados"],
  table: ["Classificacao", "Criterios"],
  transfers: ["Mercado", "Alvos"],
  academy: ["Promessas", "Desenvolvimento"],
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
    setActiveSectionMenu("Resumo");
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
        draft.log.unshift("O XI ja tem 11 jogadores. Remova alguem antes de escalar outro.");
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
        title: `${player.name} e apresentado como reforco`,
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
        body: `A saida abre espaco no elenco e rende ${money(player.value * 0.7)} ao orcamento.`,
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
        content: `Cria da casa no profissional. ${player.name}, a torcida vai cobrar, mas vai abracar tambem.`,
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
        body: `O acordo ${sponsor.tier.toLowerCase()} injeta ${money(sponsor.upfront)} e reforca o crescimento comercial do clube.`,
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
        draft.log.unshift("Orcamento insuficiente para essa melhoria do estadio.");
        return;
      }

      draft.budget = Number((draft.budget - cost).toFixed(1));
      if (kind === "capacity") {
        draft.stadium.capacity += 3000;
        draft.stadium.level += 1;
        draft.log.unshift(`${draft.stadium.name} ganhou novo setor. Capacidade: ${draft.stadium.capacity.toLocaleString("pt-BR")}.`);
        addNews(draft, {
          source: "Clube",
          title: `${draft.stadium.name} tera novo setor`,
          body: `A expansao aumenta a capacidade para ${draft.stadium.capacity.toLocaleString("pt-BR")} torcedores e sinaliza ambicao estrutural.`,
          tone: "positive",
        });
      }
      if (kind === "atmosphere") {
        draft.stadium.atmosphere = Math.min(100, draft.stadium.atmosphere + 8);
        draft.fans = Math.min(100, draft.fans + 2);
        draft.log.unshift("A atmosfera do estadio melhorou. A torcida comeca a se reconhecer mais no clube.");
        addSocialPost(draft, {
          author: `@${draft.history.supporterGroup.replace(/\s/g, "").toLowerCase()}`,
          content: "Arquibancada com mais cara de casa. Esse estadio esta comecando a ter alma.",
          sentiment: "up",
        });
      }
      if (kind === "facilities") {
        draft.stadium.facilities = Math.min(100, draft.stadium.facilities + 8);
        draft.log.unshift("As instalacoes do clube foram modernizadas.");
        addNews(draft, {
          source: "Clube",
          title: "Instalacoes modernizadas no centro do projeto",
          body: "A melhoria aumenta a estrutura para elenco e base, aproximando o clube de uma gestao mais profissional.",
          tone: "positive",
        });
      }
    });
  }

  return (
    <main className="soccer-app min-h-screen">
      <header className="masthead">
        <div className="masthead__brand">
          <span className="kicker">Gazeta interativa</span>
          <h1>Soccer Architect</h1>
          <p>Almanaque jogavel de clube, tatico por estilos e temporada simulada.</p>
        </div>
        <div className="masthead__edition">
          <label className="club-ticket">
            <span>Clube inscrito</span>
            <input value={clubName} maxLength={24} onChange={(event) => updateClubName(event.target.value)} />
          </label>
          <Button primary onClick={resetGame} icon={RefreshCw}>Nova carreira</Button>
        </div>
      </header>

      <div className="app-frame">
        <aside className="nav-index" aria-label="Secoes do almanaque">
          {views.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button key={item.key} onClick={() => changeView(item.key)} className={cx("nav-index__item", view === item.key && "is-active")}>
                <span className="nav-index__number">{String(index + 1).padStart(2, "0")}</span>
                <IconComponent size={18} />
                <span>
                  <small>{item.eyebrow}</small>
                  {item.label}
                </span>
              </button>
            );
          })}
        </aside>

        <section className="workspace">
          <nav className="paper-tabs" aria-label="Secoes da pagina">
            {sectionMenus[view].map((item) => (
              <button key={item} onClick={() => setActiveSectionMenu(item)} className={cx("paper-tab", activeSectionMenu === item && "is-active")}>
                {item}
              </button>
            ))}
          </nav>

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
                draft.log.unshift("Novas propostas de patrocinio chegaram a mesa.");
              })}
              onUpgradeStadium={upgradeStadium}
            />
          )}

          {view === "history" && <HistoryView section={activeSectionMenu} state={state} />}

          {view === "squad" && (
            <ViewShell title="Album do elenco" eyebrow="fichario do clube" action={<Button onClick={() => update(autoSelect)} icon={Dumbbell}>Escalar melhores</Button>}>
              {activeSectionMenu === "Contratos" ? (
                <div className="mosaic-grid compact">
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
            <ViewShell title="Prancheta do tecnico" eyebrow="formacao e sinergias" action={<Button primary onClick={() => update(simulateNextUserMatch)} icon={Play}>Simular proximo jogo</Button>}>
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <div className="min-w-0">
                  {activeSectionMenu !== "Perfil" && (
                    <>
                      <div className="grid gap-3 md:grid-cols-2">
                        <PaperSelect
                          label="Estrategia"
                          value={state.strategy}
                          onChange={(value) => update((draft) => {
                            draft.strategy = value as StrategyKey;
                            userTeam(draft).strategy = value as StrategyKey;
                          })}
                          options={Object.entries(strategies).map(([key, strategy]) => ({ value: key, label: strategy.name }))}
                        />
                        <PaperSelect
                          label="Esquema"
                          value={state.formation}
                          onChange={(value) => update((draft) => setFormation(draft, value as FormationKey))}
                          options={Object.values(formationDefs).map((formation) => ({ value: formation.key, label: formation.name }))}
                        />
                      </div>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <InfoCard title={strategies[state.strategy].name} muted={strategies[state.strategy].desc} tone="green" />
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
                      <SectionTitle icon={Flame} title="Relatorio do auxiliar" />
                      <div className="mb-4 grid gap-3 sm:grid-cols-2">
                        <Metric label="Ofensividade" value={`${tacticalProfile.attack}/100`} />
                        <Metric label="Defesa" value={`${tacticalProfile.defense}/100`} />
                        <Metric label="Controle" value={`${tacticalProfile.control}/100`} />
                        <Metric label="Encaixe" value={`${tacticalProfile.fit}%`} />
                      </div>
                      <InfoCard
                        title={tacticalProfile.missing ? `${tacticalProfile.missing} posicao sem jogador` : "XI completo"}
                        muted="Atacantes, pontas e meias aumentam ofensividade; volantes, laterais, zagueiros e goleiro fortalecem defesa. Improvisacoes reduzem o encaixe."
                      />
                    </>
                  )}
                  {activeSectionMenu !== "Perfil" && (
                    <>
                      <SectionTitle className="mt-6" icon={Sparkles} title="Carimbos de estilo" />
                      <div className="grid gap-3">
                        {Object.entries(styleDefs).map(([key, def]) => {
                          const count = buffs.counts[key as keyof typeof buffs.counts] ?? 0;
                          const active = count >= def.threshold;
                          return (
                            <InfoCard key={key} title={`${def.name} ${active ? "ativo" : `${count}/${def.threshold}`}`} muted={`${def.buff}: ${def.desc}`} tone={active ? "gold" : "neutral"} />
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
            <ViewShell title="Boletim da rodada" eyebrow="agenda de temporada" action={<Button onClick={() => update(simulateAll)} icon={Play}>Simular ate o fim</Button>}>
              <div className="fixture-list">
                {state.schedule.filter((match) => activeSectionMenu === "Resultados" ? match.played : !match.played).map((match) => (
                  <FixtureStrip
                    key={match.id}
                    week={match.week}
                    label={matchLabel(match, state)}
                    result={match.played ? `${match.goalsHome} x ${match.goalsAway}` : "A jogar"}
                    played={match.played}
                  />
                ))}
              </div>
            </ViewShell>
          )}

          {view === "table" && (
            <ViewShell title="Tabela impressa da liga" eyebrow="classificacao oficial">
              {activeSectionMenu === "Criterios" ? (
                <div className="mosaic-grid compact">
                  <InfoCard title="Pontuacao" muted="Vitoria vale 3 pontos, empate vale 1 ponto e derrota nao pontua." />
                  <InfoCard title="Desempate" muted="A classificacao usa pontos, saldo de gols e gols marcados." />
                  <InfoCard title="Seu clube" muted="A linha do clube criado aparece destacada como recorte de jornal." />
                </div>
              ) : (
                <PaperTable rows={table} />
              )}
            </ViewShell>
          )}

          {view === "transfers" && (
            <ViewShell title="Classificados esportivos" eyebrow="mercado de jogadores" action={<Button onClick={() => update((draft) => {
              draft.market = Array.from({ length: 8 }, () => createPlayer({ base: 58, age: 22 }));
            })} icon={RefreshCw}>Atualizar mercado</Button>}>
              {activeSectionMenu === "Alvos" ? (
                <div className="mosaic-grid compact">
                  <InfoCard title="Sugestao" muted="Procure jogadores com estilos que faltam para ativar buffs coletivos." />
                  <InfoCard title="Orcamento" muted={`Disponivel: ${money(state.budget)}`} tone="gold" />
                  <InfoCard title="Prioridade" muted="Contrate por encaixe tatico, nao apenas por OVR." />
                </div>
              ) : (
                <PlayerGrid players={state.market} strategy={state.strategy} onNumberChange={updateShirtNumber} action={(player) => (
                  <Button onClick={() => buyPlayer(player.id)} disabled={state.budget < player.value} icon={BadgeEuro}>
                    Proposta {money(player.value)}
                  </Button>
                )} variant="classified" />
              )}
            </ViewShell>
          )}

          {view === "academy" && (
            <ViewShell title="Relatorio de olheiros" eyebrow="base do clube" action={<Button primary onClick={() => update((draft) => {
              const youth = createYouth();
              draft.academy.unshift(youth);
              draft.log.unshift(`${youth.name} apareceu na base com estilo ${styleDefs[youth.styles[0]].name}.`);
              addNews(draft, {
                source: "Base",
                title: `${youth.name} chama atencao nos treinos da base`,
                body: `Olheiros internos veem potencial ${youth.potential} e tracos de ${styleDefs[youth.styles[0]].name.toLowerCase()} no jovem.`,
                tone: "positive",
              });
              addSocialPost(draft, {
                author: "@base_watch",
                content: `${youth.name} e nome para guardar. Ainda cru, mas tem cheiro de projeto de longo prazo.`,
                sentiment: "up",
              });
            })} icon={Sparkles}>Gerar jovem</Button>}>
              {activeSectionMenu === "Desenvolvimento" ? (
                <div className="mosaic-grid compact">
                  <Metric label="Promessas" value={state.academy.length.toString()} />
                  <Metric label="Maior potencial" value={Math.max(...state.academy.map((player) => player.potential), 0).toString()} />
                  <InfoCard title="Plano" muted="Promova jovens que combinem potencial alto com estilos ausentes no elenco principal." />
                </div>
              ) : (
                <>
                  <InfoCard className="mb-4" title="Caderno da base" muted="Jovens nascem com potencial, personalidade tatica e estilos raros. A graca e formar elencos que ativam buffs coletivos." tone="green" />
                  <PlayerGrid players={state.academy} strategy={state.strategy} onNumberChange={updateShirtNumber} action={(player) => (
                    <Button onClick={() => promoteYouth(player.id)}>Promover</Button>
                  )} variant="scout" />
                </>
              )}
            </ViewShell>
          )}
        </section>
      </div>
    </main>
  );
}

function Dashboard({ section, state, position, nextLabel, buffs }: { section: string; state: GameState; position: number; nextLabel: string; buffs: ReturnType<typeof calculateBuffs>["active"] }) {
  const team = userTeam(state);

  if (section === "Proximo jogo") {
    return (
      <ViewShell title="Poster de confronto" eyebrow="proxima chamada">
        <div className="poster-grid">
          <FixturePoster team={team.name} nextLabel={nextLabel} formation={formationDefs[state.formation].name} power={Math.round(teamPower(team, state))} />
          <MiniPitch state={state} />
        </div>
      </ViewShell>
    );
  }

  if (section === "Eventos") {
    return (
      <ViewShell title="Ultimas tiras de noticia" eyebrow="radio do clube">
        <div className="news-tape-list">
          {state.log.slice(0, 8).map((event, index) => (
            <article key={`${event}-${index}`} className="news-tape">
              <span>Plantao {String(index + 1).padStart(2, "0")}</span>
              <p>{event}</p>
            </article>
          ))}
        </div>
      </ViewShell>
    );
  }

  return (
    <div className="front-page">
      <section className="front-page__hero">
        <div>
          <span className="kicker red">Temporada {state.year}</span>
          <h2>{team.name} busca identidade antes do placar</h2>
          <p>Monte um XI por estilos, ative buffs coletivos e veja se a tatica sobrevive a uma temporada inteira.</p>
        </div>
        <MiniPitch state={state} />
      </section>

      <div className="front-page__metrics">
        <Metric label="Posicao" value={`${position}o`} />
        <Metric label="Proximo jogo" value={nextLabel} />
        <Metric label="Forca XI" value={Math.round(teamPower(team, state)).toString()} />
        <Metric label="Orcamento" value={money(state.budget)} />
      </div>

      <section className="radio-block">
        <div>
          <span className="kicker">Radio do Clube</span>
          <h3>Boletim tatico da redacao</h3>
        </div>
        <p>{buffs.length ? `O XI tem ${buffs.length} carimbo(s) ativo(s), com destaque para ${buffs[0].buff}.` : "O vestiario ainda procura uma combinacao de estilos capaz de virar manchete."}</p>
      </section>

      <div className="mosaic-grid">
        {buffs.length ? buffs.map((buff) => (
          <InfoCard key={buff.key} title={`${buff.buff} +${buff.points}`} muted={`${buff.count}/${buff.threshold} jogadores com ${buff.name}. ${buff.desc}`} tone="gold" />
        )) : <InfoCard title="Nenhum buff ativo" muted="Escolha jogadores com estilos complementares para carimbar o plano de jogo." />}
      </div>
    </div>
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
    <ViewShell title="Sala da diretoria" eyebrow="documentos do clube" action={<Button onClick={onRefreshSponsors} icon={Handshake}>Buscar propostas</Button>}>
      {section === "Identidade" && (
        <div className="identity-layout">
          <section className="crest-card">
            <div
              className="crest-card__badge"
              style={{
                backgroundColor: state.club.primaryColor,
                borderColor: state.club.secondaryColor,
                color: state.club.secondaryColor,
              }}
            >
              {state.club.crestSymbol.slice(0, 2).toUpperCase()}
            </div>
            <span className="kicker">Ficha institucional</span>
            <h3>{team.name}</h3>
            <p>{state.club.motto}</p>
          </section>
          <section className="paper-card form-card">
            <div className="grid gap-3 md:grid-cols-2">
              <PaperInput label="Simbolo" value={state.club.crestSymbol} maxLength={2} onChange={(value) => onUpdate((draft) => {
                draft.club.crestSymbol = value || "A";
              })} />
              <PaperInput label="Lema" value={state.club.motto} maxLength={48} onChange={(value) => onUpdate((draft) => {
                draft.club.motto = value;
              })} />
              <ColorField label="Cor principal" value={state.club.primaryColor} onChange={(value) => onUpdate((draft) => {
                draft.club.primaryColor = value;
              })} />
              <ColorField label="Cor secundaria" value={state.club.secondaryColor} onChange={(value) => onUpdate((draft) => {
                draft.club.secondaryColor = value;
              })} />
            </div>
          </section>
          <div className="mosaic-grid compact identity-metrics">
            <Metric label="Torcida" value={`${state.fans}/100`} />
            <Metric label="Valor do clube" value={clubValueScore(state).toString()} />
            <Metric label="Receita casa" value={money(stadiumRevenue(state))} />
          </div>
        </div>
      )}

      {section === "Estadio" && (
        <section className="blueprint-card">
          <div className="blueprint-card__header">
            <div>
              <span className="kicker">Projeto de reforma</span>
              <input value={state.stadium.name} maxLength={32} onChange={(event) => onUpdate((draft) => {
                draft.stadium.name = event.target.value;
              })} />
            </div>
            <StampBadge>Nivel {state.stadium.level}</StampBadge>
          </div>
          <div className="stadium-sketch" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="mosaic-grid compact">
            <Metric label="Capacidade" value={state.stadium.capacity.toLocaleString("pt-BR")} />
            <Metric label="Atmosfera" value={`${state.stadium.atmosphere}/100`} />
            <Metric label="Instalacoes" value={`${state.stadium.facilities}/100`} />
          </div>
          <div className="button-row">
            <Button onClick={() => onUpgradeStadium("capacity")} icon={Building2}>Expandir {money(2.8)}</Button>
            <Button onClick={() => onUpgradeStadium("atmosphere")} icon={Ticket}>Arquibancada {money(1.4)}</Button>
            <Button onClick={() => onUpgradeStadium("facilities")} icon={Dumbbell}>Instalacoes {money(1.8)}</Button>
          </div>
          <label className="range-ticket">
            <span>Ingresso: {money(state.stadium.ticketPrice / 10)}</span>
            <input type="range" min={12} max={60} value={state.stadium.ticketPrice} onChange={(event) => onUpdate((draft) => {
              draft.stadium.ticketPrice = Number(event.target.value);
            })} />
          </label>
        </section>
      )}

      {section === "Patrocinios" && (
        <section>
          <div className="section-line">
            <SectionTitle icon={Handshake} title="Contratos na mesa" />
            <span>Fixo/jogo: {money(sponsorIncome)}</span>
          </div>
          <div className="sponsor-grid">
            {state.sponsors.map((sponsor) => (
              <article key={sponsor.id} className="sponsor-envelope">
                <div>
                  <span className="kicker">{sponsor.tier}</span>
                  <h3>{sponsor.name}</h3>
                  <p>Exige torcida {sponsor.fanExpectation}/100</p>
                </div>
                <StampBadge tone={sponsor.signed ? "gold" : "ink"}>{sponsor.signed ? "Ativo" : "Oferta"}</StampBadge>
                <div className="grid grid-cols-3 gap-2">
                  <Attr label="Entrada" value={sponsor.upfront} />
                  <Attr label="Jogo" value={sponsor.perMatch} />
                  <Attr label="Vitoria" value={sponsor.winBonus} />
                </div>
                <Button onClick={() => onSignSponsor(sponsor.id)} disabled={sponsor.signed || state.fans < sponsor.fanExpectation} icon={Handshake}>
                  {sponsor.signed ? "Contrato ativo" : "Assinar"}
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}
    </ViewShell>
  );
}

function HistoryView({ section, state }: { section: string; state: GameState }) {
  const team = userTeam(state);
  const reputation = Object.entries(state.history.reputation).sort((a, b) => b[1] - a[1]);

  return (
    <ViewShell title="Arquivo historico" eyebrow="memoria viva" action={<StampBadge>Fundado em {state.history.foundedYear}</StampBadge>}>
      {section === "Memoria" && (
        <div className="archive-layout">
          <section className="paper-card dossier">
            <div className="dossier__head">
              <div
                className="mini-crest"
                style={{
                  backgroundColor: state.club.primaryColor,
                  borderColor: state.club.secondaryColor,
                  color: state.club.secondaryColor,
                }}
              >
                {state.club.crestSymbol.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="kicker">Memoria do clube</span>
                <h3>{team.name}</h3>
                <p>{state.club.motto}</p>
              </div>
            </div>
            <div className="mosaic-grid compact">
              <InfoCard title="Rivalidade local" muted={state.history.rivalName} />
              <InfoCard title="Torcida organizada" muted={state.history.supporterGroup} />
              <InfoCard title="Maior vitoria" muted={state.history.records.biggestWin} />
              <InfoCard title="Sequencia invicta" muted={`${state.history.records.unbeatenRun} jogos`} />
              <InfoCard title="Artilheiro historico" muted={`${state.history.records.topScorerName} (${state.history.records.topScorerGoals} gols)`} />
              <InfoCard title="Cara da base" muted={`${state.history.records.academyFaceName} (${state.history.records.academyFaceLegacy} legado)`} />
            </div>
          </section>

          <section className="paper-card">
            <SectionTitle icon={Trophy} title="Conquistas e idolos" />
            <div className="grid gap-3">
              {state.history.trophies.length ? state.history.trophies.map((trophy) => (
                <InfoCard key={trophy} title={trophy} muted="Titulo oficial do projeto" tone="gold" />
              )) : <InfoCard muted="Nenhuma conquista ainda. A sala de trofeus espera seu primeiro capitulo." />}
              {state.history.legends.length ? state.history.legends.map((legend) => (
                <article key={legend.playerId} className="legend-strip">
                  <div>
                    <strong>{legend.name}</strong>
                    <span>{legend.reason}</span>
                  </div>
                  <StampBadge tone="gold"><Star size={13} /> {legend.legacy}</StampBadge>
                </article>
              )) : <InfoCard muted="Idolos ainda serao construidos por jogos, gols e momentos de base." />}
            </div>
          </section>

          <section className="paper-card">
            <SectionTitle icon={Flame} title="Reputacao por estilo" />
            <div className="style-bars">
              {reputation.map(([key, value]) => (
                <div key={key}>
                  <div>
                    <span>{strategies[key as StrategyKey].name}</span>
                    <strong>{value}/100</strong>
                  </div>
                  <span><i style={{ width: `${value}%` }} /></span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {section === "Jornal" && (
        <div className="newspaper-grid">
          {state.history.news.map((item) => (
            <article key={item.id} className={cx("news-card", `tone-${item.tone}`)}>
              <div>
                <StampBadge tone={item.tone === "positive" ? "gold" : item.tone === "negative" ? "red" : "ink"}>{item.source}</StampBadge>
                <span>Semana {item.week}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      )}

      {section === "Rede social" && (
        <div className="supporter-wall">
          {state.history.socials.map((post) => (
            <article key={post.id} className={cx("supporter-note", post.sentiment === "down" && "is-critical")}>
              <div>
                <strong>{post.author}</strong>
                <StampBadge tone={post.sentiment === "up" ? "gold" : post.sentiment === "down" ? "red" : "ink"}>
                  {post.sentiment === "up" ? "alta" : post.sentiment === "down" ? "critica" : "neutro"}
                </StampBadge>
              </div>
              <p>{post.content}</p>
              <span>Semana {post.week}</span>
            </article>
          ))}
        </div>
      )}
    </ViewShell>
  );
}

function ViewShell({ title, eyebrow, action, children }: { title: string; eyebrow?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="view-shell">
      <div className="view-shell__head">
        <div>
          {eyebrow ? <span className="kicker red">{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        {action ? <div className="view-shell__action">{action}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Button({ children, onClick, disabled, primary = false, icon: IconComponent }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; primary?: boolean; icon?: Icon }) {
  return (
    <button onClick={onClick} disabled={disabled} className={cx("stamp-button", primary && "is-primary")}>
      {IconComponent ? <IconComponent size={17} /> : null}
      {children}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-stamp">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoCard({ title, muted, tone = "neutral", className }: { title?: string; muted?: string; tone?: "neutral" | "gold" | "green"; className?: string }) {
  return (
    <div className={cx("paper-card info-card", `tone-${tone}`, className)}>
      {title ? <strong>{title}</strong> : null}
      {muted ? <span>{muted}</span> : null}
    </div>
  );
}

function StampBadge({ children, tone = "red" }: { children: React.ReactNode; tone?: "red" | "gold" | "ink" }) {
  return <span className={cx("stamp-badge", `tone-${tone}`)}>{children}</span>;
}

function SectionTitle({ title, icon: IconComponent, className }: { title: string; icon: Icon; className?: string }) {
  return (
    <div className={cx("section-title", className)}>
      <IconComponent size={18} />
      <h3>{title}</h3>
    </div>
  );
}

function PaperInput({ label, value, onChange, maxLength }: { label: string; value: string; onChange: (value: string) => void; maxLength?: number }) {
  return (
    <label className="paper-field">
      <span>{label}</span>
      <input value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function PaperSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="paper-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="paper-field color-field">
      <span>{label}</span>
      <div>
        <Palette size={16} />
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
  );
}

function PlayerGrid({
  players,
  strategy,
  onNumberChange,
  action,
  variant = "album",
}: {
  players: Player[];
  strategy: StrategyKey;
  onNumberChange: (playerId: string, shirtNumber: number) => void;
  action: (player: Player) => React.ReactNode;
  variant?: "album" | "classified" | "scout";
}) {
  return (
    <div className={cx("player-grid", `variant-${variant}`)}>
      {players.map((player, index) => (
        <article key={player.id} className="player-sticker" style={{ ["--tilt" as string]: `${(index % 5) - 2}deg` }}>
          <div className="player-sticker__top">
            <div className="shirt-frame">
              <Shirt size={42} strokeWidth={1.7} />
              <span>{player.shirtNumber}</span>
            </div>
            <div>
              <span className="kicker">{player.position} / {player.age} anos</span>
              <h3>{player.name}</h3>
            </div>
            <StampBadge tone={player.selected ? "gold" : "ink"}>{player.selected ? "XI" : rating(player, strategy)}</StampBadge>
          </div>
          <div className="player-sticker__meta">
            <span>OVR {Math.round(averageAttributes(player))}</span>
            <span>POT {player.potential}</span>
            <span>{money(player.value)}</span>
          </div>
          <label className="number-ticket">
            <Hash size={13} />
            <input type="number" min={1} max={99} value={player.shirtNumber} onChange={(event) => onNumberChange(player.id, Number(event.target.value))} />
          </label>
          <div className="style-chip-row">
            {player.styles.map((style) => <span key={style}>{styleDefs[style].name}</span>)}
          </div>
          <div className="attr-grid">
            <Attr label="TEC" value={player.attributes.technical} />
            <Attr label="MEN" value={player.attributes.mental} />
            <Attr label="FIS" value={player.attributes.physical} />
            <Attr label="DEF" value={player.attributes.defense} />
          </div>
          <div className="button-row">{action(player)}</div>
        </article>
      ))}
    </div>
  );
}

function Attr({ label, value }: { label: string; value: number }) {
  return (
    <div className="attr-box">
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}

function MiniPitch({ state }: { state: GameState }) {
  const team = userTeam(state);
  const formation = formationDefs[state.formation];

  return (
    <div className="paper-pitch">
      <div className="paper-pitch__line middle" />
      <div className="paper-pitch__circle" />
      <div className="paper-pitch__box left" />
      <div className="paper-pitch__box right" />
      {formation.slots.map((slot) => {
        const assignment = state.lineup.find((item) => item.slotId === slot.id);
        const player = team.squad.find((item) => item.id === assignment?.playerId);

        return (
          <div key={slot.id} className="pitch-token" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
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
      <div className="tactical-board">
        <div className="board-line middle" />
        <div className="board-circle" />
        <div className="board-box left" />
        <div className="board-box right" />
        {formation.slots.map((slot) => {
          const assignment = state.lineup.find((item) => item.slotId === slot.id);
          const player = team.squad.find((item) => item.id === assignment?.playerId);
          const fit = player ? Math.round(positionBadgeFit(player.position, slot.position) * 100) : 0;

          return (
            <button key={slot.id} onClick={() => onSelectSlot(slot.id)} className="board-piece" style={{ left: `${slot.x}%`, top: `${slot.y}%` }} title={player ? player.name : slot.label}>
              <span>
                <Shirt size={34} strokeWidth={1.8} />
                <b>{player?.shirtNumber ?? slot.label}</b>
                <i>{player ? fit : 0}</i>
              </span>
              <small>{player ? player.name.split(" ").slice(-1)[0] : slot.label}</small>
            </button>
          );
        })}
      </div>

      {selectedSlot ? (
        <div className="modal-scrim" onClick={onCloseModal}>
          <div className="modal-dossier" onClick={(event) => event.stopPropagation()}>
            <div className="modal-dossier__head">
              <div>
                <span className="kicker red">Posicao {selectedSlot.label}</span>
                <h3>{selectedPlayer?.name ?? "Sem jogador escalado"}</h3>
                <p>Encaixe: {selectedPlayer ? Math.round(positionBadgeFit(selectedPlayer.position, selectedSlot.position) * 100) : 0}%</p>
              </div>
              <Button onClick={onCloseModal}>Fechar</Button>
            </div>

            <PaperSelect
              label="Trocar jogador"
              value={selectedPlayer?.id ?? ""}
              onChange={(value) => onAssign(selectedSlot.id, value || null)}
              options={[{ value: "", label: "Sem jogador" }, ...team.squad.map((candidate) => ({ value: candidate.id, label: `${candidate.position} #${candidate.shirtNumber} ${candidate.name}` }))]}
            />

            {selectedPlayer ? (
              <div className="modal-player">
                <div className="shirt-frame large">
                  <Shirt size={72} strokeWidth={1.7} />
                  <span>{selectedPlayer.shirtNumber}</span>
                </div>
                <div className="grid gap-3">
                  <div className="mosaic-grid compact">
                    <InfoCard title="Posicao natural" muted={selectedPlayer.position} />
                    <InfoCard title="Valor" muted={money(selectedPlayer.value)} />
                    <InfoCard title="Idade" muted={`${selectedPlayer.age} anos`} />
                    <InfoCard title="Potencial" muted={selectedPlayer.potential.toString()} />
                  </div>
                  <div className="attr-grid">
                    <Attr label="TEC" value={selectedPlayer.attributes.technical} />
                    <Attr label="MEN" value={selectedPlayer.attributes.mental} />
                    <Attr label="FIS" value={selectedPlayer.attributes.physical} />
                    <Attr label="DEF" value={selectedPlayer.attributes.defense} />
                  </div>
                  <div className="style-chip-row">
                    {selectedPlayer.styles.map((style) => <span key={style}>{styleDefs[style].name}</span>)}
                  </div>
                  <Button onClick={() => onAssign(selectedSlot.id, null)}>Remover da posicao</Button>
                </div>
              </div>
            ) : (
              <InfoCard title="Posicao vazia" muted="Escolha um jogador para ocupar este espaco no esquema." />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

function FixturePoster({ team, nextLabel, formation, power }: { team: string; nextLabel: string; formation: string; power: number }) {
  return (
    <article className="fixture-poster">
      <span className="kicker">Proximo jogo</span>
      <h3>{nextLabel}</h3>
      <div>
        <Metric label="Clube" value={team} />
        <Metric label="Esquema" value={formation} />
        <Metric label="Forca XI" value={power.toString()} />
      </div>
    </article>
  );
}

function FixtureStrip({ week, label, result, played }: { week: number; label: string; result: string; played: boolean }) {
  return (
    <article className={cx("fixture-strip", played && "is-played")}>
      <span>Semana {week}</span>
      <strong>{label}</strong>
      <b>{result}</b>
    </article>
  );
}

function PaperTable({ rows }: { rows: ReturnType<typeof sortedTable> }) {
  return (
    <div className="paper-table-wrap">
      <table className="paper-table">
        <thead>
          <tr>
            {["#", "Clube", "J", "V", "E", "D", "GP", "GC", "SG", "Pts"].map((head) => <th key={head}>{head}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className={row.isUser ? "is-user" : undefined}>
              <td>{index + 1}</td>
              <td>{row.name}</td>
              <td>{row.stats.played}</td>
              <td>{row.stats.won}</td>
              <td>{row.stats.drawn}</td>
              <td>{row.stats.lost}</td>
              <td>{row.stats.gf}</td>
              <td>{row.stats.ga}</td>
              <td>{row.stats.gf - row.stats.ga}</td>
              <td>{row.stats.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
