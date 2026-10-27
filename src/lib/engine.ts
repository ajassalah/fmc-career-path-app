// ─── Mock engine ──────────────────────────────────────────────
import { QUESTIONS, CAREERS, MAX_DOMAIN_SCORE } from '../data/questions';
import type { State, Domain, Question } from '../data/questions';

export type { State };

export interface Report {
  profile: string;
  top: { domain: Domain; career: string; match: number }[];
  pathway: string;
  plan: { '30 days': string; '90 days': string; '1 year': string };
}

export interface NextQuestionDone {
  done: true;
  question?: undefined;
  progress?: undefined;
}

export interface NextQuestionActive {
  done: false;
  question: { id: string; prompt: string; options: { id: string; label: string }[] };
  progress: number;
}

export type NextQuestionResult = NextQuestionDone | NextQuestionActive;

export function isQuestion(res: NextQuestionResult): res is NextQuestionActive {
  return !res.done && Boolean(res.question);
}

// ─── State helpers ────────────────────────────────────────────
function makeState(ageBand: string): State {
  return {
    ageBand,
    stage: '',
    goal: '',
    fit: '',
    maturity: 0,
    scores: { tech: 0, business: 0, health: 0, creative: 0, service: 0 },
  };
}

function stateMatches(state: State, requires?: Partial<Record<keyof State, string[]>>): boolean {
  if (!requires) return true;
  for (const [key, values] of Object.entries(requires) as [keyof State, string[]][]) {
    const sv = state[key];
    if (typeof sv === 'number') {
      if (!values.includes(String(sv))) return false;
    } else if (typeof sv === 'string') {
      if (!values.includes(sv)) return false;
    } else if (typeof sv === 'object') {
      // scores – unlikely to be in requires
    } else {
      return false;
    }
  }
  return true;
}

function applyOption(state: State, questionId: string, optionId: string): State {
  const q = QUESTIONS.find(q => q.id === questionId);
  if (!q) return state;
  const opt = q.options.find(o => o.id === optionId);
  if (!opt) return state;

  const next: State = {
    ...state,
    scores: { ...state.scores },
  };

  if (opt.sets) {
    for (const [k, v] of Object.entries(opt.sets)) {
      if (k === 'maturity' || k === 'scores') continue;
      (next as unknown as Record<string, unknown>)[k] = v;
    }
  }

  if (opt.weights) {
    for (const [k, v] of Object.entries(opt.weights) as [string, number][]) {
      if (k === '_mat') {
        next.maturity += v;
      } else {
        next.scores[k as Domain] = (next.scores[k as Domain] || 0) + v;
      }
    }
  }

  return next;
}

function getNextQuestion(state: State, answered: Set<string>): Question | null {
  const eligible = QUESTIONS.filter(
    q => !answered.has(q.id) && stateMatches(state, q.requires)
  );
  if (!eligible.length) return null;
  eligible.sort((a, b) => a.ord - b.ord);
  return eligible[0];
}

function buildReport(state: State): Report {
  const domains = Object.entries(state.scores) as [Domain, number][];
  domains.sort((a, b) => b[1] - a[1]);
  const top3 = domains.slice(0, 3).map(([domain, score]) => ({
    domain,
    career: CAREERS[domain][0],
    match: Math.min(100, Math.round((score / MAX_DOMAIN_SCORE) * 100)),
  }));

  // Profile
  let profile: string;
  if (state.maturity >= 2) profile = 'Mature planner';
  else if (state.goal === 'none') profile = 'Explorer';
  else profile = 'Focused learner';

  // Pathway
  const topCareer = top3[0]?.career || 'your ideal career';
  let pathway = '';
  const { stage, fit, maturity } = state;
  if (stage === 'school') {
    pathway = `Choose a stream or foundation programme that leads to ${topCareer}, then a degree.`;
    if (maturity >= 2) pathway += ' Fast track: start a small project or business while you study.';
  } else if (stage === 'degree') {
    pathway = `Add a certification or postgraduate study to move into ${topCareer}.`;
  } else if (stage === 'work') {
    if (fit === 'switch') {
      pathway = `Switch step by step: short course, portfolio, then a first role as ${topCareer}.`;
    } else {
      pathway = `Grow in your field and add a certification toward ${topCareer}.`;
    }
  } else if (stage === 'business') {
    pathway = 'Grow your venture with mentoring, finance and marketing skills.';
  } else {
    pathway = `Start with a counsellor session, then test ${topCareer} with a small project.`;
  }

  return {
    profile,
    top: top3,
    pathway,
    plan: {
      '30 days': 'Research the top career and talk to 2 people in it.',
      '90 days': 'Take one short course or build one small project.',
      '1 year': 'Complete a certification or first real experience.',
    },
  };
}

function buildTeaser(state: State): { teaser: string; price: number; currency: string } {
  const domains = Object.entries(state.scores) as [Domain, number][];
  domains.sort((a, b) => b[1] - a[1]);
  const top2 = domains.slice(0, 2).map(([domain]) => CAREERS[domain][0]);
  const teaser = top2.map(c => c[0] + '••••••').join(' & ');
  return { teaser, price: 99, currency: 'AED' };
}

// ─── In-memory session store ──────────────────────────────────
interface Session {
  id: string;
  state: State;
  answered: Map<string, string>; // questionId → optionId
  answeredOrder: string[];
}

const sessions = new Map<string, Session>();
const accounts = new Map<string, { username: string; password: string; report: Report; firstName: string }>();

function sessionId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Exported engine functions ────────────────────────────────
export const engine = {
  createSession(ageBand: string) {
    const id = sessionId();
    sessions.set(id, {
      id,
      state: makeState(ageBand),
      answered: new Map(),
      answeredOrder: [],
    });
    return { sessionId: id };
  },

  getNextQuestion(sid: string): NextQuestionResult {
    const session = sessions.get(sid);
    if (!session) return { done: true };
    if (session.answeredOrder.length >= 7) return { done: true };
    const q = getNextQuestion(session.state, new Set(session.answered.keys()));
    if (!q) return { done: true };
    const progress = session.answeredOrder.length / 7;
    return {
      done: false,
      question: { id: q.id, prompt: q.prompt, options: q.options.map(o => ({ id: o.id, label: o.label })) },
      progress,
    };
  },

  submitAnswer(sid: string, questionId: string, optionId: string) {
    const session = sessions.get(sid);
    if (!session) return { ok: false };
    session.state = applyOption(session.state, questionId, optionId);
    session.answered.set(questionId, optionId);
    session.answeredOrder.push(questionId);
    return { ok: true };
  },

  getPreviousQuestion(sid: string): string | null {
    const session = sessions.get(sid);
    if (!session || session.answeredOrder.length === 0) return null;
    return session.answeredOrder[session.answeredOrder.length - 1];
  },

  undoLastAnswer(sid: string) {
    const session = sessions.get(sid);
    if (!session || session.answeredOrder.length === 0) return { ok: false };
    const lastQId = session.answeredOrder.pop()!;
    session.answered.delete(lastQId);
    // Rebuild state from scratch
    const newState = makeState(session.state.ageBand);
    for (const qId of session.answeredOrder) {
      const optId = session.answered.get(qId)!;
      const newS = applyOption(newState, qId, optId);
      Object.assign(newState, newS);
      newState.scores = { ...newS.scores };
    }
    session.state = newState;
    return { ok: true };
  },

  getTeaser(sid: string) {
    const session = sessions.get(sid);
    if (!session) return { teaser: 'S•••••• & D••••••', price: 99, currency: 'AED' };
    return buildTeaser(session.state);
  },

  checkout(sid: string, details: { name: string; email: string; phone: string; country: string; consent: boolean }) {
    const session = sessions.get(sid);
    if (!session) throw new Error('Session not found');
    const report = buildReport(session.state);
    const firstName = details.name.split(' ')[0];
    const username = details.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 900 + 100);
    const password = 'Path' + Math.floor(Math.random() * 9000 + 1000) + '!';
    accounts.set(username, { username, password, report, firstName });
    return {
      username,
      password,
      portalUrl: '/portal',
      report,
    };
  },

  login(username: string, password: string) {
    const acc = accounts.get(username);
    if (!acc || acc.password !== password) throw new Error('Invalid credentials');
    const token = btoa(`${username}:${Date.now()}`);
    return { token, firstName: acc.firstName };
  },

  getReport(username: string): Report {
    const acc = accounts.get(username);
    if (!acc) throw new Error('Not found');
    return acc.report;
  },

  // Expose accounts map for demo persona pre-seeding
  _accounts: accounts,
  _sessions: sessions,
};
