// ─── Question bank and engine ─────────────────────────────────

export type Domain = 'tech' | 'business' | 'health' | 'creative' | 'service';

export const CAREERS: Record<Domain, string[]> = {
  tech:     ['Software Engineer', 'Data & AI Specialist', 'Cybersecurity Analyst'],
  business: ['Entrepreneur / Founder', 'Business & Product Manager', 'Finance & Investment'],
  health:   ['Healthcare Professional', 'Health-Tech Specialist', 'Sports & Wellness Coach'],
  creative: ['UX / Visual Designer', 'Media & Content Creator', 'Marketing & Brand Strategist'],
  service:  ['Teacher & Trainer', 'HR & Career Counsellor', 'Public Sector & Social Impact'],
};

export const MAX_DOMAIN_SCORE = 10; // Approx maximum accumulated per domain

export interface Option {
  id: string;
  label: string;
  sets?: Partial<State>;
  weights?: Partial<Record<Domain | '_mat', number>>;
}

export interface Question {
  id: string;
  prompt: string;
  options: Option[];
  ord: number;
  requires?: Partial<Record<keyof State, string[]>>;
}

export interface State {
  ageBand: string;
  stage: string;
  goal: string;
  fit: string;
  maturity: number;
  scores: Record<Domain, number>;
}

export const QUESTIONS: Question[] = [
  {
    id: 'q1', ord: 1,
    prompt: 'Where are you right now?',
    options: [
      { id: 'q1a', label: 'Still studying',         sets: { stage: 'school', goal: 'some' } },
      { id: 'q1b', label: 'Finished a degree',       sets: { stage: 'degree', goal: 'some' } },
      { id: 'q1c', label: 'Working',                 sets: { stage: 'work',   goal: 'some' } },
      { id: 'q1d', label: 'Running my own business', sets: { stage: 'business', goal: 'some' }, weights: { _mat: 1 } },
      { id: 'q1e', label: 'Not sure yet',            sets: { stage: 'unsure', goal: 'none' } },
    ],
  },
  {
    id: 'q2', ord: 2, requires: { stage: ['school'] },
    prompt: 'Which subject makes time fly?',
    options: [
      { id: 'q2a', label: 'Computers & science',  weights: { tech: 2 } },
      { id: 'q2b', label: 'Business & money',     weights: { business: 2 } },
      { id: 'q2c', label: 'Biology & health',     weights: { health: 2 } },
      { id: 'q2d', label: 'Art, design & media',  weights: { creative: 2 } },
      { id: 'q2e', label: 'People & society',     weights: { service: 2 } },
    ],
  },
  {
    id: 'q3', ord: 2, requires: { stage: ['degree'] },
    prompt: 'What did you study?',
    options: [
      { id: 'q3a', label: 'Technology / engineering', weights: { tech: 2 } },
      { id: 'q3b', label: 'Business / finance',       weights: { business: 2 } },
      { id: 'q3c', label: 'Health / science',         weights: { health: 2 } },
      { id: 'q3d', label: 'Arts / media',             weights: { creative: 2 } },
      { id: 'q3e', label: 'Education / social',       weights: { service: 2 } },
    ],
  },
  {
    id: 'q4', ord: 2, requires: { stage: ['work'] },
    prompt: 'What takes most of your work day?',
    options: [
      { id: 'q4a', label: 'Solving technical problems', weights: { tech: 2 } },
      { id: 'q4b', label: 'Managing money or people',   weights: { business: 2 } },
      { id: 'q4c', label: 'Caring for people',          weights: { health: 2 } },
      { id: 'q4d', label: 'Creating content or design', weights: { creative: 2 } },
      { id: 'q4e', label: 'Teaching or supporting',     weights: { service: 2 } },
    ],
  },
  {
    id: 'q5', ord: 3, requires: { stage: ['work'], ageBand: ['26-30', '31-35', '36+'] },
    prompt: 'Is your current job right for you?',
    options: [
      { id: 'q5a', label: 'Yes, I like it',   sets: { fit: 'good' },   weights: { _mat: 1 } },
      { id: 'q5b', label: 'It is okay',       sets: { fit: 'ok' } },
      { id: 'q5c', label: 'I want a change',  sets: { fit: 'switch' } },
    ],
  },
  {
    id: 'q6', ord: 2, requires: { stage: ['business'] },
    prompt: 'What kind of business is it?',
    options: [
      { id: 'q6a', label: 'Tech or online',          weights: { tech: 2 } },
      { id: 'q6b', label: 'Trading or services',     weights: { business: 2 } },
      { id: 'q6c', label: 'Health or wellness',      weights: { health: 2 } },
      { id: 'q6d', label: 'Creative or media',       weights: { creative: 2 } },
      { id: 'q6e', label: 'Education or community',  weights: { service: 2 } },
    ],
  },
  {
    id: 'q7', ord: 2, requires: { goal: ['none'] },
    prompt: 'One free year, no money worries. On day one you…',
    options: [
      { id: 'q7a', label: 'Build or fix something',     weights: { tech: 2 } },
      { id: 'q7b', label: 'Start my own thing',         weights: { business: 2 } },
      { id: 'q7c', label: 'Meet and help people',       weights: { health: 2 } },
      { id: 'q7d', label: 'Create something new',       weights: { creative: 2 } },
      { id: 'q7e', label: 'Learn and teach',            weights: { service: 2 } },
    ],
  },
  {
    id: 'q8', ord: 3, requires: { goal: ['none'] },
    prompt: 'What bothers you most in the world?',
    options: [
      { id: 'q8a', label: 'Broken or inefficient things',      weights: { tech: 2 } },
      { id: 'q8b', label: 'Wasted money and weak businesses',  weights: { business: 2 } },
      { id: 'q8c', label: 'People who are unwell',             weights: { health: 2 } },
      { id: 'q8d', label: 'Ugly or boring design',             weights: { creative: 2 } },
      { id: 'q8e', label: 'People left behind',                weights: { service: 2 } },
    ],
  },
  {
    id: 'q9', ord: 8,
    prompt: 'At 35, what matters most?',
    options: [
      { id: 'q9a', label: 'Being a respected expert',   weights: { tech: 1, health: 1 } },
      { id: 'q9b', label: 'Freedom and wealth',         weights: { business: 2, _mat: 1 } },
      { id: 'q9c', label: 'Helping others',             weights: { service: 1, health: 1 } },
      { id: 'q9d', label: 'Creating things people love', weights: { creative: 2 } },
    ],
  },
  {
    id: 'q10', ord: 9,
    prompt: 'Which sounds most like you?',
    options: [
      { id: 'q10a', label: 'I plan years ahead',        weights: { _mat: 1 } },
      { id: 'q10b', label: 'I take it one step at a time', weights: {} },
      { id: 'q10c', label: 'I try things and see',      weights: { creative: 1 } },
    ],
  },
];
