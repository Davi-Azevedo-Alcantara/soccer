export type AttributeKey = "technical" | "mental" | "physical" | "defense";
export type StyleKey = "conductor" | "vertical" | "presser" | "creator" | "anchor" | "runner";
export type StrategyKey = "possession" | "pressing" | "direct" | "balanced";
export type Position = "GOL" | "ZAG" | "LE" | "LD" | "VOL" | "MC" | "MEI" | "PE" | "PD" | "ATA";
export type FormationKey = "433" | "4231" | "352" | "442" | "532";

export type Player = {
  id: string;
  name: string;
  position: Position;
  shirtNumber: number;
  age: number;
  potential: number;
  selected: boolean;
  value: number;
  styles: StyleKey[];
  attributes: Record<AttributeKey, number>;
  history: {
    apps: number;
    goals: number;
    assists: number;
    youthProduct: boolean;
    legacy: number;
  };
};

export type TeamStats = {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
};

export type Team = {
  id: string;
  name: string;
  isUser: boolean;
  strategy: StrategyKey;
  squad: Player[];
  stats: TeamStats;
};

export type Match = {
  id: string;
  home: string;
  away: string;
  played: boolean;
  week: number;
  goalsHome: number | null;
  goalsAway: number | null;
};

export type ClubIdentity = {
  primaryColor: string;
  secondaryColor: string;
  crestSymbol: string;
  motto: string;
};

export type Stadium = {
  name: string;
  capacity: number;
  level: number;
  atmosphere: number;
  facilities: number;
  ticketPrice: number;
};

export type SponsorDeal = {
  id: string;
  name: string;
  tier: "Local" | "Regional" | "Nacional";
  upfront: number;
  perMatch: number;
  winBonus: number;
  fanExpectation: number;
  signed: boolean;
};

export type TacticalSlot = {
  id: string;
  label: string;
  position: Position;
  x: number;
  y: number;
};

export type LineupAssignment = {
  slotId: string;
  playerId: string | null;
};

export type FormationDef = {
  key: FormationKey;
  name: string;
  strength: string;
  weakness: string;
  modifiers: {
    attack: number;
    defense: number;
    control: number;
  };
  slots: TacticalSlot[];
};

export type NewsItem = {
  id: string;
  week: number;
  source: "Jornal" | "Clube" | "Mercado" | "Base";
  title: string;
  body: string;
  tone: "positive" | "neutral" | "negative";
};

export type SocialPost = {
  id: string;
  week: number;
  author: string;
  content: string;
  sentiment: "up" | "flat" | "down";
};

export type ClubLegend = {
  playerId: string;
  name: string;
  reason: string;
  legacy: number;
};

export type ClubHistory = {
  foundedYear: number;
  rivalName: string;
  supporterGroup: string;
  reputation: Record<StrategyKey, number>;
  trophies: string[];
  legends: ClubLegend[];
  news: NewsItem[];
  socials: SocialPost[];
  records: {
    biggestWin: string;
    biggestWinMargin: number;
    topScorerName: string;
    topScorerGoals: number;
    academyFaceName: string;
    academyFaceLegacy: number;
    unbeatenRun: number;
    currentUnbeatenRun: number;
  };
};

export type GameState = {
  year: number;
  teams: Team[];
  schedule: Match[];
  strategy: StrategyKey;
  formation: FormationKey;
  lineup: LineupAssignment[];
  budget: number;
  fans: number;
  club: ClubIdentity;
  stadium: Stadium;
  sponsors: SponsorDeal[];
  history: ClubHistory;
  academy: Player[];
  market: Player[];
  log: string[];
};

export type Buff = {
  key: StyleKey;
  name: string;
  desc: string;
  buff: string;
  threshold: number;
  effects: Partial<Record<"possession" | "control" | "attack" | "chance" | "defense", number>>;
  count: number;
  points: number;
};

export const styleDefs: Record<StyleKey, Omit<Buff, "key" | "count" | "points">> = {
  conductor: {
    name: "Condução precisa",
    desc: "Reduz perdas de bola e sustenta posse.",
    buff: "Controle de posse",
    threshold: 3,
    effects: { possession: 8, control: 5 },
  },
  vertical: {
    name: "Passe vertical",
    desc: "Acelera ataques e acha rupturas.",
    buff: "Ataque direto",
    threshold: 2,
    effects: { attack: 7, chance: 5 },
  },
  presser: {
    name: "Pressão agressiva",
    desc: "Recupera a bola em zonas altas.",
    buff: "Pressão coordenada",
    threshold: 3,
    effects: { defense: 5, possession: 4 },
  },
  creator: {
    name: "Criatividade entrelinhas",
    desc: "Gera ocasiões contra blocos fechados.",
    buff: "Imprevisibilidade",
    threshold: 2,
    effects: { chance: 8 },
  },
  anchor: {
    name: "Âncora defensiva",
    desc: "Protege a área e equilibra o time.",
    buff: "Bloco protegido",
    threshold: 2,
    effects: { defense: 8 },
  },
  runner: {
    name: "Ataque ao espaço",
    desc: "Estica defesas e melhora transições.",
    buff: "Profundidade",
    threshold: 2,
    effects: { attack: 5, chance: 4 },
  },
};

export const strategies: Record<
  StrategyKey,
  {
    name: string;
    desc: string;
    weights: Record<AttributeKey, number>;
    styleMultipliers: Partial<Record<StyleKey, number>>;
  }
> = {
  possession: {
    name: "Posse paciente",
    desc: "Valoriza controle, circulação e baixo risco.",
    weights: { technical: 0.38, mental: 0.28, physical: 0.14, defense: 0.2 },
    styleMultipliers: { conductor: 1.45, creator: 1.15, presser: 1.1 },
  },
  pressing: {
    name: "Pressão alta",
    desc: "Busca roubar rápido e sufocar a saída rival.",
    weights: { technical: 0.2, mental: 0.24, physical: 0.28, defense: 0.28 },
    styleMultipliers: { presser: 1.5, runner: 1.15, anchor: 1.1 },
  },
  direct: {
    name: "Jogo vertical",
    desc: "Acelera ataques com passes progressivos e profundidade.",
    weights: { technical: 0.25, mental: 0.2, physical: 0.25, defense: 0.3 },
    styleMultipliers: { vertical: 1.45, runner: 1.3, creator: 1.1 },
  },
  balanced: {
    name: "Equilíbrio",
    desc: "Adapta o plano conforme o adversário.",
    weights: { technical: 0.25, mental: 0.25, physical: 0.25, defense: 0.25 },
    styleMultipliers: { anchor: 1.15, conductor: 1.15, vertical: 1.15, creator: 1.15, presser: 1.15, runner: 1.15 },
  },
};

export const formationDefs: Record<FormationKey, FormationDef> = {
  "433": {
    key: "433",
    name: "4-3-3",
    strength: "Amplitude, pressão pelos lados e bom volume ofensivo.",
    weakness: "Pode expor os volantes se os pontas não recompõem.",
    modifiers: { attack: 8, defense: -2, control: 4 },
    slots: [
      { id: "gk", label: "GOL", position: "GOL", x: 7, y: 50 },
      { id: "lb", label: "LE", position: "LE", x: 28, y: 18 },
      { id: "cb1", label: "ZAG", position: "ZAG", x: 25, y: 40 },
      { id: "cb2", label: "ZAG", position: "ZAG", x: 25, y: 60 },
      { id: "rb", label: "LD", position: "LD", x: 28, y: 82 },
      { id: "dm", label: "VOL", position: "VOL", x: 47, y: 50 },
      { id: "cm1", label: "MC", position: "MC", x: 58, y: 34 },
      { id: "cm2", label: "MC", position: "MC", x: 58, y: 66 },
      { id: "lw", label: "PE", position: "PE", x: 78, y: 20 },
      { id: "st", label: "ATA", position: "ATA", x: 88, y: 50 },
      { id: "rw", label: "PD", position: "PD", x: 78, y: 80 },
    ],
  },
  "4231": {
    key: "4231",
    name: "4-2-3-1",
    strength: "Protege a defesa e cria superioridade entrelinhas.",
    weakness: "Depende muito do meia central e do atacante isolado.",
    modifiers: { attack: 4, defense: 4, control: 7 },
    slots: [
      { id: "gk", label: "GOL", position: "GOL", x: 7, y: 50 },
      { id: "lb", label: "LE", position: "LE", x: 27, y: 18 },
      { id: "cb1", label: "ZAG", position: "ZAG", x: 24, y: 40 },
      { id: "cb2", label: "ZAG", position: "ZAG", x: 24, y: 60 },
      { id: "rb", label: "LD", position: "LD", x: 27, y: 82 },
      { id: "dm1", label: "VOL", position: "VOL", x: 45, y: 39 },
      { id: "dm2", label: "VOL", position: "VOL", x: 45, y: 61 },
      { id: "am", label: "MEI", position: "MEI", x: 65, y: 50 },
      { id: "lw", label: "PE", position: "PE", x: 75, y: 22 },
      { id: "st", label: "ATA", position: "ATA", x: 88, y: 50 },
      { id: "rw", label: "PD", position: "PD", x: 75, y: 78 },
    ],
  },
  "352": {
    key: "352",
    name: "3-5-2",
    strength: "Domina o corredor central e empilha jogadores no meio.",
    weakness: "Sofre nas costas dos alas se perde a bola.",
    modifiers: { attack: 5, defense: 1, control: 9 },
    slots: [
      { id: "gk", label: "GOL", position: "GOL", x: 7, y: 50 },
      { id: "cb1", label: "ZAG", position: "ZAG", x: 24, y: 32 },
      { id: "cb2", label: "ZAG", position: "ZAG", x: 22, y: 50 },
      { id: "cb3", label: "ZAG", position: "ZAG", x: 24, y: 68 },
      { id: "lm", label: "LE", position: "LE", x: 49, y: 15 },
      { id: "dm", label: "VOL", position: "VOL", x: 45, y: 50 },
      { id: "cm1", label: "MC", position: "MC", x: 57, y: 36 },
      { id: "cm2", label: "MC", position: "MC", x: 57, y: 64 },
      { id: "rm", label: "LD", position: "LD", x: 49, y: 85 },
      { id: "st1", label: "ATA", position: "ATA", x: 83, y: 42 },
      { id: "st2", label: "ATA", position: "ATA", x: 83, y: 58 },
    ],
  },
  "442": {
    key: "442",
    name: "4-4-2",
    strength: "Simples, equilibrado e forte para atacar a área.",
    weakness: "Pode perder criatividade contra meio-campos povoados.",
    modifiers: { attack: 4, defense: 5, control: -2 },
    slots: [
      { id: "gk", label: "GOL", position: "GOL", x: 7, y: 50 },
      { id: "lb", label: "LE", position: "LE", x: 27, y: 18 },
      { id: "cb1", label: "ZAG", position: "ZAG", x: 24, y: 40 },
      { id: "cb2", label: "ZAG", position: "ZAG", x: 24, y: 60 },
      { id: "rb", label: "LD", position: "LD", x: 27, y: 82 },
      { id: "lm", label: "PE", position: "PE", x: 54, y: 20 },
      { id: "cm1", label: "MC", position: "MC", x: 52, y: 42 },
      { id: "cm2", label: "MC", position: "MC", x: 52, y: 58 },
      { id: "rm", label: "PD", position: "PD", x: 54, y: 80 },
      { id: "st1", label: "ATA", position: "ATA", x: 82, y: 42 },
      { id: "st2", label: "ATA", position: "ATA", x: 82, y: 58 },
    ],
  },
  "532": {
    key: "532",
    name: "5-3-2",
    strength: "Fecha a área e dá segurança contra times fortes.",
    weakness: "Reduz amplitude ofensiva e pode isolar os atacantes.",
    modifiers: { attack: -3, defense: 10, control: 0 },
    slots: [
      { id: "gk", label: "GOL", position: "GOL", x: 7, y: 50 },
      { id: "lwb", label: "LE", position: "LE", x: 30, y: 14 },
      { id: "cb1", label: "ZAG", position: "ZAG", x: 24, y: 34 },
      { id: "cb2", label: "ZAG", position: "ZAG", x: 22, y: 50 },
      { id: "cb3", label: "ZAG", position: "ZAG", x: 24, y: 66 },
      { id: "rwb", label: "LD", position: "LD", x: 30, y: 86 },
      { id: "cm1", label: "MC", position: "MC", x: 55, y: 36 },
      { id: "dm", label: "VOL", position: "VOL", x: 50, y: 50 },
      { id: "cm2", label: "MC", position: "MC", x: 55, y: 64 },
      { id: "st1", label: "ATA", position: "ATA", x: 82, y: 42 },
      { id: "st2", label: "ATA", position: "ATA", x: 82, y: 58 },
    ],
  },
};

const positions: Position[] = ["GOL", "ZAG", "ZAG", "LE", "LD", "VOL", "MC", "MEI", "PE", "PD", "ATA"];
const opponents = ["Litoral SC", "Ferrovia Norte", "União Serrana", "Atlético Solar", "Porto Azul", "Vila Real", "Estrela do Sul"];
const firstNames = ["Caio", "Davi", "Ruan", "Theo", "Natan", "Igor", "Breno", "Renan", "Luis", "Arthur", "Enzo", "Mikael", "Yuri", "João", "Luan"];
const lastNames = ["Matos", "Rocha", "Lima", "Nunes", "Castro", "Ribeiro", "Sales", "Duarte", "Barros", "Moura", "Campos", "Vieira", "Costa", "Prado"];
const sponsorNames = ["Banco Aurora", "Norte Energia", "Vértice Sports", "Atlas Telecom", "Cidade Viva", "Rota Express", "Pulse Nutrition", "Forge Motors"];

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(items: T[]) => items[rand(0, items.length - 1)];
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export const money = (value: number) => `€${value.toFixed(1)}M`;

function id() {
  return crypto.randomUUID();
}

function weightedStyle(): StyleKey {
  return pick(Object.keys(styleDefs) as StyleKey[]);
}

export function createPlayer(overrides: Partial<Player> & { base?: number } = {}): Player {
  const age = overrides.age ?? rand(17, 31);
  const potential = overrides.potential ?? Math.min(99, rand(48, 84) + (age <= 20 ? rand(0, 12) : 0));
  const base = overrides.base ?? Math.min(potential - 2, rand(44, 78));
  const styles = [weightedStyle()];

  if (Math.random() > 0.72) {
    styles.push(weightedStyle());
  }

  return {
    id: overrides.id ?? id(),
    name: overrides.name ?? `${pick(firstNames)} ${pick(lastNames)}`,
    position: overrides.position ?? pick(positions),
    shirtNumber: overrides.shirtNumber ?? rand(1, 99),
    age,
    potential,
    selected: overrides.selected ?? false,
    value: overrides.value ?? Number((base * 0.08 + potential * 0.05 + rand(0, 20) / 10).toFixed(1)),
    styles: overrides.styles ?? [...new Set(styles)],
    attributes: overrides.attributes ?? {
      technical: clamp(base + rand(-8, 8), 35, 95),
      mental: clamp(base + rand(-8, 8), 35, 95),
      physical: clamp(base + rand(-8, 8), 35, 95),
      defense: clamp(base + rand(-8, 8), 35, 95),
    },
    history: overrides.history ?? {
      apps: 0,
      goals: 0,
      assists: 0,
      youthProduct: false,
      legacy: 0,
    },
  };
}

export function createYouth(): Player {
  const youth = createPlayer({
    age: rand(15, 19),
    base: rand(36, 60),
    potential: rand(62, 96),
    value: Number((rand(3, 16) / 10).toFixed(1)),
  });

  youth.history.youthProduct = true;
  youth.history.legacy = 2;
  return youth;
}

export function averageAttributes(player: Player) {
  return Object.values(player.attributes).reduce((sum, value) => sum + value, 0) / 4;
}

export function rating(player: Player, strategyKey: StrategyKey) {
  const strategy = strategies[strategyKey];
  const raw = Object.entries(strategy.weights).reduce((sum, [key, weight]) => {
    return sum + player.attributes[key as AttributeKey] * weight;
  }, 0);
  const styleBonus = player.styles.reduce((sum, style) => {
    return sum + ((strategy.styleMultipliers[style] ?? 1) - 1) * 6;
  }, 0);

  return Math.round(raw + styleBonus);
}

export function createTeam(name: string, isUser = false): Team {
  const squad = Array.from({ length: isUser ? 18 : 16 }, (_, index) =>
    createPlayer({
      selected: isUser && index < 11,
      position: positions[index % positions.length],
      base: isUser ? rand(52, 74) : rand(48, 76),
    }),
  );

  return {
    id: id(),
    name,
    isUser,
    strategy: isUser ? "possession" : pick(Object.keys(strategies) as StrategyKey[]),
    squad,
    stats: { played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
  };
}

export function createSchedule(teams: Team[]): Match[] {
  const matches: Match[] = [];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      matches.push({ id: id(), home: teams[i].id, away: teams[j].id, played: false, week: 0, goalsHome: null, goalsAway: null });
    }
  }

  return matches.sort(() => Math.random() - 0.5).map((match, index) => ({ ...match, week: index + 1 }));
}

export function createSponsorOffers(): SponsorDeal[] {
  return Array.from({ length: 4 }, (_, index) => {
    const tier = index === 0 ? "Local" : index < 3 ? "Regional" : "Nacional";
    const tierPower = tier === "Local" ? 1 : tier === "Regional" ? 1.7 : 2.6;

    return {
      id: id(),
      name: pick(sponsorNames),
      tier,
      upfront: Number((rand(5, 14) * 0.1 * tierPower).toFixed(1)),
      perMatch: Number((rand(2, 8) * 0.01 * tierPower).toFixed(2)),
      winBonus: Number((rand(2, 10) * 0.01 * tierPower).toFixed(2)),
      fanExpectation: Math.round(18 * tierPower + rand(0, 16)),
      signed: false,
    };
  });
}

function createHistory(clubName: string): ClubHistory {
  const rivalName = pick(opponents);

  return {
    foundedYear: 2026,
    rivalName,
    supporterGroup: `Guarda ${clubName.split(" ")[0]}`,
    reputation: { possession: 18, pressing: 12, direct: 10, balanced: 14 },
    trophies: [],
    legends: [],
    news: [
      {
        id: id(),
        week: 0,
        source: "Jornal",
        title: `${clubName} nasce com promessa de identidade própria`,
        body: `A diretoria apresentou cores, estádio e um projeto esportivo que pretende revelar jogadores e criar uma relação forte com a arquibancada.`,
        tone: "positive",
      },
    ],
    socials: [
      {
        id: id(),
        week: 0,
        author: `@${clubName.replace(/\s/g, "").toLowerCase()}_raiz`,
        content: `Primeiro dia acompanhando o ${clubName}. Se tiver base, raça e camisa bonita, eu compro essa ideia.`,
        sentiment: "up",
      },
    ],
    records: {
      biggestWin: "Nenhuma partida oficial",
      biggestWinMargin: 0,
      topScorerName: "Sem artilheiro",
      topScorerGoals: 0,
      academyFaceName: "Nenhum jovem promovido",
      academyFaceLegacy: 0,
      unbeatenRun: 0,
      currentUnbeatenRun: 0,
    },
  };
}

export function addNews(state: GameState, item: Omit<NewsItem, "id" | "week">) {
  state.history.news.unshift({
    id: id(),
    week: currentWeek(state),
    ...item,
  });
  state.history.news = state.history.news.slice(0, 30);
}

export function addSocialPost(state: GameState, post: Omit<SocialPost, "id" | "week">) {
  state.history.socials.unshift({
    id: id(),
    week: currentWeek(state),
    ...post,
  });
  state.history.socials = state.history.socials.slice(0, 40);
}

export function refreshLegends(state: GameState) {
  const legends = [...userTeam(state).squad]
    .filter((player) => player.history.legacy >= 12)
    .sort((a, b) => b.history.legacy - a.history.legacy)
    .slice(0, 5)
    .map((player) => ({
      playerId: player.id,
      name: player.name,
      reason: player.history.youthProduct ? "Cria da base abraçada pela torcida" : "Referência técnica do projeto",
      legacy: player.history.legacy,
    }));

  state.history.legends = legends;
}

function currentWeek(state: GameState) {
  const played = state.schedule.filter((match) => match.played).length;
  return played + 1;
}

export function createGame(clubName = "Aurora FC"): GameState {
  const teams = [createTeam(clubName, true), ...opponents.map((name) => createTeam(name))];
  const game: GameState = {
    year: 2026,
    teams,
    schedule: createSchedule(teams),
    strategy: "possession",
    formation: "433",
    lineup: formationDefs["433"].slots.map((slot) => ({ slotId: slot.id, playerId: null })),
    budget: 12,
    fans: 42,
    club: {
      primaryColor: "#56c27a",
      secondaryColor: "#eff7f2",
      crestSymbol: "A",
      motto: "Formar, competir, pertencer.",
    },
    stadium: {
      name: "Estádio Aurora",
      capacity: 12000,
      level: 1,
      atmosphere: 48,
      facilities: 42,
      ticketPrice: 28,
    },
    sponsors: createSponsorOffers(),
    history: createHistory(clubName),
    academy: Array.from({ length: 4 }, () => createYouth()),
    market: Array.from({ length: 8 }, () => createPlayer({ base: rand(50, 78), age: rand(18, 29) })),
    log: ["Carreira iniciada. Monte sua identidade tática pelos estilos do elenco."],
  };

  autoSelect(game);
  return game;
}

export function userTeam(state: GameState) {
  return state.teams.find((team) => team.isUser)!;
}

export function selectedPlayers(team: Team) {
  return team.squad.filter((player) => player.selected).slice(0, 11);
}

export function lineupPlayers(state: GameState) {
  const team = userTeam(state);
  return state.lineup
    .map((assignment) => team.squad.find((player) => player.id === assignment.playerId))
    .filter((player): player is Player => Boolean(player));
}

export function setFormation(state: GameState, formation: FormationKey) {
  const currentPlayers = lineupPlayers(state).map((player) => player.id);
  state.formation = formation;
  state.lineup = formationDefs[formation].slots.map((slot, index) => ({
    slotId: slot.id,
    playerId: currentPlayers[index] ?? null,
  }));
  syncSelectedFromLineup(state);
}

export function assignPlayerToSlot(state: GameState, slotId: string, playerId: string | null) {
  if (playerId) {
    state.lineup.forEach((assignment) => {
      if (assignment.playerId === playerId) {
        assignment.playerId = null;
      }
    });
  }

  const assignment = state.lineup.find((item) => item.slotId === slotId);
  if (assignment) {
    assignment.playerId = playerId;
  }
  syncSelectedFromLineup(state);
}

export function syncSelectedFromLineup(state: GameState) {
  const assignedIds = new Set(state.lineup.map((assignment) => assignment.playerId).filter(Boolean));
  userTeam(state).squad.forEach((player) => {
    player.selected = assignedIds.has(player.id);
  });
}

export function positionFit(playerPosition: Position, slotPosition: Position) {
  if (playerPosition === slotPosition) {
    return 1;
  }
  if (slotPosition === "GOL" || playerPosition === "GOL") {
    return 0.25;
  }

  const compatible: Record<Position, Position[]> = {
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

  return compatible[slotPosition].includes(playerPosition) ? 0.82 : 0.58;
}

export function calculateTacticalProfile(state: GameState) {
  const team = userTeam(state);
  const formation = formationDefs[state.formation];
  let attack = 42 + formation.modifiers.attack;
  let defense = 42 + formation.modifiers.defense;
  let control = 42 + formation.modifiers.control;
  let fitTotal = 0;
  let filled = 0;

  formation.slots.forEach((slot) => {
    const assignment = state.lineup.find((item) => item.slotId === slot.id);
    const player = team.squad.find((item) => item.id === assignment?.playerId);
    if (!player) {
      return;
    }

    const fit = positionFit(player.position, slot.position);
    fitTotal += fit;
    filled += 1;

    const roleAttack = ["ATA", "PE", "PD", "MEI"].includes(slot.position) ? 4 : slot.position === "MC" ? 2 : 0;
    const roleDefense = ["GOL", "ZAG", "LE", "LD", "VOL"].includes(slot.position) ? 4 : slot.position === "MC" ? 2 : 0;
    const roleControl = ["VOL", "MC", "MEI", "PE", "PD"].includes(slot.position) ? 3 : 0;

    attack += ((player.attributes.technical + player.attributes.physical) / 34 + roleAttack) * fit;
    defense += ((player.attributes.defense + player.attributes.mental) / 34 + roleDefense) * fit;
    control += ((player.attributes.technical + player.attributes.mental) / 34 + roleControl) * fit;
  });

  const fit = filled ? Math.round((fitTotal / filled) * 100) : 0;
  const missingPenalty = (formation.slots.length - filled) * 5;

  return {
    attack: clamp(Math.round(attack - missingPenalty), 1, 100),
    defense: clamp(Math.round(defense - missingPenalty), 1, 100),
    control: clamp(Math.round(control - missingPenalty), 1, 100),
    fit,
    filled,
    missing: formation.slots.length - filled,
  };
}

export function calculateBuffs(players: Player[], strategyKey: StrategyKey) {
  const counts = {} as Record<StyleKey, number>;

  players.forEach((player) => {
    player.styles.forEach((style) => {
      counts[style] = (counts[style] ?? 0) + 1;
    });
  });

  const active = (Object.entries(styleDefs) as Array<[StyleKey, typeof styleDefs[StyleKey]]>).flatMap(([key, def]) => {
    const count = counts[key] ?? 0;
    if (count < def.threshold) {
      return [];
    }

    const strategyMultiplier = strategies[strategyKey].styleMultipliers[key] ?? 1;
    const points = Object.values(def.effects).reduce((sum, value) => sum + value, 0) * strategyMultiplier;
    return [{ key, ...def, count, points: Math.round(points) }];
  });

  return {
    counts,
    active,
    total: active.reduce((sum, buff) => sum + buff.points, 0),
  };
}

export function teamPower(team: Team, state: GameState) {
  const strategy = team.isUser ? state.strategy : team.strategy;
  const players = team.isUser
    ? lineupPlayers(state)
    : [...team.squad].sort((a, b) => rating(b, strategy) - rating(a, strategy)).slice(0, 11);
  const base = players.reduce((sum, player) => sum + rating(player, strategy), 0) / Math.max(1, players.length);
  const buffs = calculateBuffs(players, strategy);
  const stadiumBonus = team.isUser ? Math.min(3, state.stadium.atmosphere / 35) : 0;
  const profile = team.isUser ? calculateTacticalProfile(state) : null;
  const tacticalBonus = profile ? (profile.attack + profile.defense + profile.control - 195) / 12 : 0;

  return base + buffs.total / 2 + stadiumBonus + tacticalBonus;
}

export function stadiumRevenue(state: GameState) {
  const attendanceRate = clamp(0.42 + state.fans / 140 + state.stadium.atmosphere / 280, 0.35, 0.96);
  const gross = (state.stadium.capacity * attendanceRate * state.stadium.ticketPrice) / 1_000_000;

  return Number(gross.toFixed(2));
}

export function sponsorMatchRevenue(state: GameState, won: boolean) {
  const revenue = state.sponsors
    .filter((sponsor) => sponsor.signed)
    .reduce((sum, sponsor) => sum + sponsor.perMatch + (won ? sponsor.winBonus : 0), 0);

  return Number(revenue.toFixed(2));
}

export function clubValueScore(state: GameState) {
  const sponsorScore = state.sponsors.filter((sponsor) => sponsor.signed).length * 8;
  const stadiumScore = state.stadium.level * 10 + state.stadium.facilities / 4;

  return Math.round(state.fans + sponsorScore + stadiumScore);
}

export function sortedTable(state: GameState) {
  return [...state.teams].sort((a, b) => {
    const gdA = a.stats.gf - a.stats.ga;
    const gdB = b.stats.gf - b.stats.ga;
    return b.stats.points - a.stats.points || gdB - gdA || b.stats.gf - a.stats.gf;
  });
}

export function matchLabel(match: Match, state: GameState) {
  const home = state.teams.find((team) => team.id === match.home)!;
  const away = state.teams.find((team) => team.id === match.away)!;
  return `${home.name} x ${away.name}`;
}

export function nextUserMatch(state: GameState) {
  const id = userTeam(state).id;
  return state.schedule.find((match) => !match.played && (match.home === id || match.away === id));
}

export function autoSelect(state: GameState) {
  const team = userTeam(state);
  team.squad.forEach((player) => {
    player.selected = false;
  });
  const used = new Set<string>();
  state.lineup = formationDefs[state.formation].slots.map((slot) => {
    const player = [...team.squad]
      .filter((candidate) => !used.has(candidate.id))
      .sort((a, b) => {
        const scoreA = rating(a, state.strategy) * positionFit(a.position, slot.position);
        const scoreB = rating(b, state.strategy) * positionFit(b.position, slot.position);
        return scoreB - scoreA;
      })[0];

    if (player) {
      used.add(player.id);
      player.selected = true;
    }

    return { slotId: slot.id, playerId: player?.id ?? null };
  });
}

export function simulateNextUserMatch(state: GameState) {
  const match = nextUserMatch(state);
  if (!match) {
    state.log.unshift("Temporada concluída.");
    finalizeSeasonIfComplete(state);
    return;
  }

  state.schedule
    .filter((fixture) => !fixture.played && fixture.week <= match.week)
    .forEach((fixture) => simulateMatch(fixture, state));
  finalizeSeasonIfComplete(state);
}

export function simulateAll(state: GameState) {
  while (nextUserMatch(state)) {
    simulateNextUserMatch(state);
  }
}

function simulateMatch(match: Match, state: GameState) {
  if (match.played) {
    return;
  }

  const home = state.teams.find((team) => team.id === match.home)!;
  const away = state.teams.find((team) => team.id === match.away)!;
  const homeGoals = goalRoll(teamPower(home, state) + 3, teamPower(away, state));
  const awayGoals = goalRoll(teamPower(away, state), teamPower(home, state));

  match.played = true;
  match.goalsHome = homeGoals;
  match.goalsAway = awayGoals;
  applyResult(home, away, homeGoals, awayGoals);

  if (home.isUser || away.isUser) {
    const opponent = home.isUser ? away.name : home.name;
    const won = (home.isUser && homeGoals > awayGoals) || (away.isUser && awayGoals > homeGoals);
    const userGoals = home.isUser ? homeGoals : awayGoals;
    const opponentGoals = home.isUser ? awayGoals : homeGoals;
    const homeRevenue = home.isUser ? stadiumRevenue(state) : 0;
    const sponsorRevenue = sponsorMatchRevenue(state, won);
    const matchRevenue = Number((homeRevenue + sponsorRevenue).toFixed(2));

    state.budget = Number((state.budget + matchRevenue).toFixed(2));
    state.fans = clamp(state.fans + (won ? 3 : homeGoals === awayGoals ? 1 : -2), 10, 100);
    processClubMatch(state, opponent, userGoals, opponentGoals, won, homeGoals === awayGoals);
    state.log.unshift(`${home.name} ${homeGoals} x ${awayGoals} ${away.name}. Plano contra ${opponent} ${homeGoals === awayGoals ? "rendeu empate" : won ? "funcionou" : "foi superado"}.`);
    if (matchRevenue > 0) {
      state.log.unshift(`Receita do jogo: ${money(matchRevenue)} entre bilheteria e patrocinadores.`);
    }
    progressPlayers(state);
  }
}

function processClubMatch(state: GameState, opponent: string, userGoals: number, opponentGoals: number, won: boolean, drawn: boolean) {
  const team = userTeam(state);
  const starters = lineupPlayers(state);

  starters.forEach((player) => {
    player.history.apps += 1;
    player.history.legacy += player.history.youthProduct ? 2 : 1;
  });

  const scorers = assignScorers(starters, userGoals);
  scorers.forEach((player) => {
    player.history.goals += 1;
    player.history.legacy += player.history.youthProduct ? 4 : 3;
  });

  const margin = userGoals - opponentGoals;
  if (won && margin > state.history.records.biggestWinMargin) {
    state.history.records.biggestWin = `${team.name} ${userGoals} x ${opponentGoals} ${opponent}`;
    state.history.records.biggestWinMargin = margin;
  }

  if (won || drawn) {
    state.history.records.currentUnbeatenRun += 1;
    state.history.records.unbeatenRun = Math.max(state.history.records.unbeatenRun, state.history.records.currentUnbeatenRun);
  } else {
    state.history.records.currentUnbeatenRun = 0;
  }

  const topScorer = [...team.squad].sort((a, b) => b.history.goals - a.history.goals)[0];
  if (topScorer && topScorer.history.goals > state.history.records.topScorerGoals) {
    state.history.records.topScorerName = topScorer.name;
    state.history.records.topScorerGoals = topScorer.history.goals;
  }

  const academyFace = [...team.squad]
    .filter((player) => player.history.youthProduct)
    .sort((a, b) => b.history.legacy - a.history.legacy)[0];
  if (academyFace && academyFace.history.legacy > state.history.records.academyFaceLegacy) {
    state.history.records.academyFaceName = academyFace.name;
    state.history.records.academyFaceLegacy = academyFace.history.legacy;
  }

  state.history.reputation[state.strategy] = clamp(state.history.reputation[state.strategy] + (won ? 4 : drawn ? 2 : 1), 0, 100);
  refreshLegends(state);
  publishMatchMedia(state, opponent, userGoals, opponentGoals, won, drawn, scorers);
}

function assignScorers(players: Player[], goals: number) {
  const candidates = players.length ? players : [];
  const attacking = candidates.filter((player) => ["ATA", "PE", "PD", "MEI", "MC"].includes(player.position));
  const pool = attacking.length ? attacking : candidates;

  if (!pool.length) {
    return [];
  }

  return Array.from({ length: goals }, () => pick(pool));
}

function publishMatchMedia(state: GameState, opponent: string, userGoals: number, opponentGoals: number, won: boolean, drawn: boolean, scorers: Player[]) {
  const team = userTeam(state);
  const scorerText = scorers.length ? `com gol de ${scorers[0].name}` : "em jogo truncado";
  const resultText = `${team.name} ${userGoals} x ${opponentGoals} ${opponent}`;

  addNews(state, {
    source: "Jornal",
    title: won ? `${team.name} vence e reforça identidade ${strategies[state.strategy].name.toLowerCase()}` : drawn ? `${team.name} soma ponto em noite de ajustes` : `${team.name} sente pressão e tropeça na liga`,
    body: `${resultText}: ${scorerText}. A reputação do clube em ${strategies[state.strategy].name.toLowerCase()} agora é observada pela imprensa local.`,
    tone: won ? "positive" : drawn ? "neutral" : "negative",
  });

  addSocialPost(state, {
    author: `@${state.history.supporterGroup.replace(/\s/g, "").toLowerCase()}`,
    content: won
      ? `Esse ${team.name} começa a ter cara. ${scorers[0]?.name ?? "O time"} puxou a arquibancada hoje.`
      : drawn
        ? `Não foi lindo, mas tem entrega. Ainda dá para acreditar no projeto.`
        : `Hoje doeu. Mas clube que quer ter história precisa responder no próximo jogo.`,
    sentiment: won ? "up" : drawn ? "flat" : "down",
  });

  if (opponent === state.history.rivalName) {
    addNews(state, {
      source: "Jornal",
      title: won ? `Clássico fundador: ${team.name} supera ${opponent}` : `${opponent} aumenta temperatura da rivalidade`,
      body: `O duelo contra ${opponent} já começa a ganhar contornos próprios para a torcida. A cidade tem assunto para a semana.`,
      tone: won ? "positive" : "neutral",
    });
  }
}

function finalizeSeasonIfComplete(state: GameState) {
  if (nextUserMatch(state)) {
    return;
  }

  const title = `Liga ${state.year}`;
  if (state.history.trophies.includes(title)) {
    return;
  }

  const champion = sortedTable(state)[0];
  if (champion.isUser) {
    state.history.trophies.push(title);
    state.fans = clamp(state.fans + 12, 10, 100);
    addNews(state, {
      source: "Jornal",
      title: `${champion.name} conquista a ${title}`,
      body: `A primeira grande marca da história do clube chegou com um elenco que já tem personagens, estilo e arquibancada.`,
      tone: "positive",
    });
    addSocialPost(state, {
      author: `@${state.history.supporterGroup.replace(/\s/g, "").toLowerCase()}`,
      content: `Campeões. Agora ninguém tira isso da nossa história.`,
      sentiment: "up",
    });
  }
}

function goalRoll(attackPower: number, defensePower: number) {
  const edge = clamp((attackPower - defensePower) / 18, -1.1, 1.3);
  let goals = 0;
  const chances = 4 + Math.max(0, Math.round(edge));

  for (let i = 0; i < chances; i += 1) {
    if (Math.random() < 0.23 + edge * 0.08) {
      goals += 1;
    }
  }

  return clamp(goals, 0, 6);
}

function applyResult(home: Team, away: Team, hg: number, ag: number) {
  home.stats.played += 1;
  away.stats.played += 1;
  home.stats.gf += hg;
  home.stats.ga += ag;
  away.stats.gf += ag;
  away.stats.ga += hg;

  if (hg > ag) {
    home.stats.won += 1;
    away.stats.lost += 1;
    home.stats.points += 3;
  } else if (ag > hg) {
    away.stats.won += 1;
    home.stats.lost += 1;
    away.stats.points += 3;
  } else {
    home.stats.drawn += 1;
    away.stats.drawn += 1;
    home.stats.points += 1;
    away.stats.points += 1;
  }
}

function progressPlayers(state: GameState) {
  lineupPlayers(state).forEach((player) => {
    const current = averageAttributes(player);
    if (current >= player.potential) {
      return;
    }

    const growthChance = player.age <= 21 ? 0.72 : 0.28;
    if (Math.random() > growthChance) {
      return;
    }

    const key = pick(Object.keys(player.attributes) as AttributeKey[]);
    player.attributes[key] = clamp(player.attributes[key] + 1, 35, player.potential);
  });
}
