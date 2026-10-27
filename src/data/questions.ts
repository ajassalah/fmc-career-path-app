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
  labelAr?: string;
  sets?: Partial<State>;
  weights?: Partial<Record<Domain | '_mat', number>>;
}

export interface Question {
  id: string;
  prompt: string;
  promptAr?: string;
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

export const QUESTION_TRANSLATIONS: Record<string, { promptAr: string; options: Record<string, string> }> = {
  q1: {
    promptAr: 'أين أنت الآن؟',
    options: {
      q1a: 'ما زلت أدرس',
      q1b: 'أنهيت دراستي الجامعية',
      q1c: 'أعمل حالياً',
      q1d: 'أدير مشروعي الخاص',
      q1e: 'لست متأكداً بعد',
    },
  },
  q2: {
    promptAr: 'أي مادة دراسية يمر معها الوقت سريعاً؟',
    options: {
      q2a: 'الحاسوب والعلوم',
      q2b: 'الأعمال والمالية',
      q2c: 'الأحياء والصحة',
      q2d: 'الفن والتصميم والإعلام',
      q2e: 'الإنسان والمجتمع',
    },
  },
  q3: {
    promptAr: 'ماذا درست؟',
    options: {
      q3a: 'التكنولوجيا / الهندسة',
      q3b: 'إدارة الأعمال / المالية',
      q3c: 'العلوم الصحية / الطب',
      q3d: 'الفنون / الإعلام',
      q3e: 'التعليم / العلوم الاجتماعية',
    },
  },
  q4: {
    promptAr: 'ما الذي يستغرق معظم يوم عملك؟',
    options: {
      q4a: 'حل المشكلات التقنية',
      q4b: 'إدارة الأموال أو قيادة الفرق',
      q4c: 'رعاية الناس ومساعدتهم',
      q4d: 'صناعة المحتوى أو التصميم',
      q4e: 'التعليم أو تقديم الدعم',
    },
  },
  q5: {
    promptAr: 'هل تشعر أن عملك الحالي مناسب لك؟',
    options: {
      q5a: 'نعم، يعجبني جداً',
      q5b: 'هو لا بأس به',
      q5c: 'أرغب في التغيير',
    },
  },
  q6: {
    promptAr: 'ما هو مجال مشروعك؟',
    options: {
      q6a: 'تقني أو رقمي عبر الإنترنت',
      q6b: 'تجارة أو خدمات',
      q6c: 'صحة أو لياقة ورفاهية',
      q6d: 'إبداعي أو إعلامي',
      q6e: 'تعليمي أو مجتمعي',
    },
  },
  q7: {
    promptAr: 'لديك سنة كاملة بدون قلق مالي. في اليوم الأول تبدأ بـ…',
    options: {
      q7a: 'بناء أو إصلاح شيء ما',
      q7b: 'إطلاق مشروعي الخاص',
      q7c: 'لقاء الناس ومساعدتهم',
      q7d: 'ابتكار شيء جديد ومبدع',
      q7e: 'التعلم ونقل المعرفة',
    },
  },
  q8: {
    promptAr: 'ما أكثر شيء يزعجك في العالم؟',
    options: {
      q8a: 'الأشياء المعطلة أو غير الفعالة',
      q8b: 'الأموال المهدورة والمشاريع الضعيفة',
      q8c: 'معاناة المرضى وضعف الصحة',
      q8d: 'التصاميم الرديئة أو المملة',
      q8e: 'تهميش الأفراد وغياب الدعم',
    },
  },
  q9: {
    promptAr: 'في عمر الـ ٣٥، ما هو الأهم بالنسبة لك؟',
    options: {
      q9a: 'أن أكون خبيراً مرموقاً ومحترماً',
      q9b: 'الحرية المالية والاستقلالية',
      q9c: 'مساعدة الآخرين وترك أثر إيجابي',
      q9d: 'صناعة أشياء يحبها الناس',
    },
  },
  q10: {
    promptAr: 'أي من هذه العبارات تمثلك أكثر؟',
    options: {
      q10a: 'أخطط لسنوات مسبقاً',
      q10b: 'أمضي خطوة بخطوة',
      q10c: 'أجرّب وأرى ما يحدث',
    },
  },
};

export const QUESTIONS: Question[] = [
  {
    id: 'q1', ord: 1,
    prompt: 'Where are you right now?',
    promptAr: 'أين أنت الآن؟',
    options: [
      { id: 'q1a', label: 'Still studying',         labelAr: 'ما زلت أدرس',             sets: { stage: 'school', goal: 'some' } },
      { id: 'q1b', label: 'Finished a degree',       labelAr: 'أنهيت دراستي الجامعية',    sets: { stage: 'degree', goal: 'some' } },
      { id: 'q1c', label: 'Working',                 labelAr: 'أعمل حالياً',             sets: { stage: 'work',   goal: 'some' } },
      { id: 'q1d', label: 'Running my own business', labelAr: 'أدير مشروعي الخاص',         sets: { stage: 'business', goal: 'some' }, weights: { _mat: 1 } },
      { id: 'q1e', label: 'Not sure yet',            labelAr: 'لست متأكداً بعد',         sets: { stage: 'unsure', goal: 'none' } },
    ],
  },
  {
    id: 'q2', ord: 2, requires: { stage: ['school'] },
    prompt: 'Which subject makes time fly?',
    promptAr: 'أي مادة دراسية يمر معها الوقت سريعاً؟',
    options: [
      { id: 'q2a', label: 'Computers & science',  labelAr: 'الحاسوب والعلوم',       weights: { tech: 2 } },
      { id: 'q2b', label: 'Business & money',     labelAr: 'الأعمال والمالية',      weights: { business: 2 } },
      { id: 'q2c', label: 'Biology & health',     labelAr: 'الأحياء والصحة',        weights: { health: 2 } },
      { id: 'q2d', label: 'Art, design & media',  labelAr: 'الفن والتصميم والإعلام', weights: { creative: 2 } },
      { id: 'q2e', label: 'People & society',     labelAr: 'الإنسان والمجتمع',      weights: { service: 2 } },
    ],
  },
  {
    id: 'q3', ord: 2, requires: { stage: ['degree'] },
    prompt: 'What did you study?',
    promptAr: 'ماذا درست؟',
    options: [
      { id: 'q3a', label: 'Technology / engineering', labelAr: 'التكنولوجيا / الهندسة',       weights: { tech: 2 } },
      { id: 'q3b', label: 'Business / finance',       labelAr: 'إدارة الأعمال / المالية',      weights: { business: 2 } },
      { id: 'q3c', label: 'Health / science',         labelAr: 'العلوم الصحية / الطب',        weights: { health: 2 } },
      { id: 'q3d', label: 'Arts / media',             labelAr: 'الفنون / الإعلام',             weights: { creative: 2 } },
      { id: 'q3e', label: 'Education / social',       labelAr: 'التعليم / العلوم الاجتماعية', weights: { service: 2 } },
    ],
  },
  {
    id: 'q4', ord: 2, requires: { stage: ['work'] },
    prompt: 'What takes most of your work day?',
    promptAr: 'ما الذي يستغرق معظم يوم عملك؟',
    options: [
      { id: 'q4a', label: 'Solving technical problems', labelAr: 'حل المشكلات التقنية',          weights: { tech: 2 } },
      { id: 'q4b', label: 'Managing money or people',   labelAr: 'إدارة الأموال أو قيادة الفرق', weights: { business: 2 } },
      { id: 'q4c', label: 'Caring for people',          labelAr: 'رعاية الناس ومساعدتهم',        weights: { health: 2 } },
      { id: 'q4d', label: 'Creating content or design', labelAr: 'صناعة المحتوى أو التصميم',    weights: { creative: 2 } },
      { id: 'q4e', label: 'Teaching or supporting',     labelAr: 'التعليم أو تقديم الدعم',      weights: { service: 2 } },
    ],
  },
  {
    id: 'q5', ord: 3, requires: { stage: ['work'], ageBand: ['26-30', '31-35', '36+'] },
    prompt: 'Is your current job right for you?',
    promptAr: 'هل تشعر أن عملك الحالي مناسب لك؟',
    options: [
      { id: 'q5a', label: 'Yes, I like it',   labelAr: 'نعم، يعجبني جداً', sets: { fit: 'good' },   weights: { _mat: 1 } },
      { id: 'q5b', label: 'It is okay',       labelAr: 'هو لا بأس به',    sets: { fit: 'ok' } },
      { id: 'q5c', label: 'I want a change',  labelAr: 'أرغب في التغيير', sets: { fit: 'switch' } },
    ],
  },
  {
    id: 'q6', ord: 2, requires: { stage: ['business'] },
    prompt: 'What kind of business is it?',
    promptAr: 'ما هو مجال مشروعك؟',
    options: [
      { id: 'q6a', label: 'Tech or online',          labelAr: 'تقني أو رقمي عبر الإنترنت', weights: { tech: 2 } },
      { id: 'q6b', label: 'Trading or services',     labelAr: 'تجارة أو خدمات',             weights: { business: 2 } },
      { id: 'q6c', label: 'Health or wellness',      labelAr: 'صحة أو لياقة ورفاهية',        weights: { health: 2 } },
      { id: 'q6d', label: 'Creative or media',       labelAr: 'إبداعي أو إعلامي',           weights: { creative: 2 } },
      { id: 'q6e', label: 'Education or community',  labelAr: 'تعليمي أو مجتمعي',           weights: { service: 2 } },
    ],
  },
  {
    id: 'q7', ord: 2, requires: { goal: ['none'] },
    prompt: 'One free year, no money worries. On day one you…',
    promptAr: 'لديك سنة كاملة بدون قلق مالي. في اليوم الأول تبدأ بـ…',
    options: [
      { id: 'q7a', label: 'Build or fix something',     labelAr: 'بناء أو إصلاح شيء ما',     weights: { tech: 2 } },
      { id: 'q7b', label: 'Start my own thing',         labelAr: 'إطلاق مشروعي الخاص',       weights: { business: 2 } },
      { id: 'q7c', label: 'Meet and help people',       labelAr: 'لقاء الناس ومساعدتهم',     weights: { health: 2 } },
      { id: 'q7d', label: 'Create something new',       labelAr: 'ابتكار شيء جديد ومبدع',    weights: { creative: 2 } },
      { id: 'q7e', label: 'Learn and teach',            labelAr: 'التعلم ونقل المعرفة',      weights: { service: 2 } },
    ],
  },
  {
    id: 'q8', ord: 3, requires: { goal: ['none'] },
    prompt: 'What bothers you most in the world?',
    promptAr: 'ما أكثر شيء يزعجك في العالم؟',
    options: [
      { id: 'q8a', label: 'Broken or inefficient things',      labelAr: 'الأشياء المعطلة أو غير الفعالة',    weights: { tech: 2 } },
      { id: 'q8b', label: 'Wasted money and weak businesses',  labelAr: 'الأموال المهدورة والمشاريع الضعيفة', weights: { business: 2 } },
      { id: 'q8c', label: 'People who are unwell',             labelAr: 'معاناة المرضى وضعف الصحة',          weights: { health: 2 } },
      { id: 'q8d', label: 'Ugly or boring design',             labelAr: 'التصاميم الرديئة أو المملة',        weights: { creative: 2 } },
      { id: 'q8e', label: 'People left behind',                labelAr: 'تهميش الأفراد وغياب الدعم',         weights: { service: 2 } },
    ],
  },
  {
    id: 'q9', ord: 8,
    prompt: 'At 35, what matters most?',
    promptAr: 'في عمر الـ ٣٥، ما هو الأهم بالنسبة لك؟',
    options: [
      { id: 'q9a', label: 'Being a respected expert',   labelAr: 'أن أكون خبيراً مرموقاً ومحترماً',   weights: { tech: 1, health: 1 } },
      { id: 'q9b', label: 'Freedom and wealth',         labelAr: 'الحرية المالية والاستقلالية',       weights: { business: 2, _mat: 1 } },
      { id: 'q9c', label: 'Helping others',             labelAr: 'مساعدة الآخرين وترك أثر إيجابي',   weights: { service: 1, health: 1 } },
      { id: 'q9d', label: 'Creating things people love', labelAr: 'صناعة أشياء يحبها الناس',         weights: { creative: 2 } },
    ],
  },
  {
    id: 'q10', ord: 9,
    prompt: 'Which sounds most like you?',
    promptAr: 'أي من هذه العبارات تمثلك أكثر؟',
    options: [
      { id: 'q10a', label: 'I plan years ahead',        labelAr: 'أخطط لسنوات مسبقاً', weights: { _mat: 1 } },
      { id: 'q10b', label: 'I take it one step at a time', labelAr: 'أمضي خطوة بخطوة', weights: {} },
      { id: 'q10c', label: 'I try things and see',      labelAr: 'أجرّب وأرى ما يحدث', weights: { creative: 1 } },
    ],
  },
];
