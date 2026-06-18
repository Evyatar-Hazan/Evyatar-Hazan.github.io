export const profileLinks = {
  github: 'https://github.com/Evyatar-Hazan',
  linkedin: 'https://www.linkedin.com/in/evyatar-hazan-662235210/',
  email: 'mailto:evyatarhazan3.14@gmail.com',
  whatsapp: 'https://wa.me/972587127547',
  cv: '',
} as const;

export type Project = {
  id: string;
  category: 'business' | 'fullstack' | 'nonprofit' | 'tool' | 'mobile';
  featured: boolean;
  status: 'live' | 'active' | 'fullstack' | 'monorepo' | 'privacy' | 'learning' | 'nonprofit';
  tags: string[];
  githubUrl: string;
  visual: 'catering' | 'converter' | 'protocol' | 'nonprofit' | 'mobile' | 'learning' | 'branch';
  summaryKey: string;
  impactKey: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'nis_boutique',
    category: 'business',
    featured: true,
    status: 'live',
    tags: ['React', 'TypeScript', 'Vite', 'Vercel', 'SEO', 'RTL'],
    githubUrl: 'https://github.com/Evyatar-Hazan/nis-boutique-catering',
    liveUrl: 'https://nisboutiquecatering.com/',
    visual: 'catering',
    summaryKey: 'projects.items.nis_boutique.summary',
    impactKey: 'projects.items.nis_boutique.impact',
  },
  {
    id: 'online_converter',
    category: 'tool',
    featured: true,
    status: 'active',
    tags: ['React', 'TypeScript', 'Vite', 'i18n', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/online-converter',
    liveUrl: 'https://online-converter.evyatarhazan.com/',
    visual: 'converter',
    summaryKey: 'projects.items.online_converter.summary',
    impactKey: 'projects.items.online_converter.impact',
  },
  {
    id: 'emergency_protocol',
    category: 'fullstack',
    featured: true,
    status: 'fullstack',
    tags: ['React', 'Express', 'Prisma', 'Google OAuth', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/emergency-protocol-diagram',
    liveUrl: 'https://bls-protocol.evyatarhazan.com/',
    visual: 'protocol',
    summaryKey: 'projects.items.emergency_protocol.summary',
    impactKey: 'projects.items.emergency_protocol.impact',
  },
  {
    id: 'lev_chedva',
    category: 'nonprofit',
    featured: false,
    status: 'monorepo',
    tags: ['Monorepo', 'React', 'Node.js', 'TypeScript', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/lev-hedva',
    liveUrl: 'https://lev-chedva.evyatarhazan.com/',
    visual: 'nonprofit',
    summaryKey: 'projects.items.lev_chedva.summary',
    impactKey: 'projects.items.lev_chedva.impact',
  },
  {
    id: 'password_gen',
    category: 'mobile',
    featured: false,
    status: 'privacy',
    tags: ['React Native', 'TypeScript', 'Core package', 'Privacy-first'],
    githubUrl: 'https://github.com/Evyatar-Hazan/password-generator',
    visual: 'mobile',
    summaryKey: 'projects.items.password_gen.summary',
    impactKey: 'projects.items.password_gen.impact',
  },
  {
    id: 'test_yourself',
    category: 'fullstack',
    featured: false,
    status: 'learning',
    tags: ['React', 'Express', 'TypeScript', 'Monorepo', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/test-yourself',
    visual: 'learning',
    summaryKey: 'projects.items.test_yourself.summary',
    impactKey: 'projects.items.test_yourself.impact',
  },
  {
    id: 'united_hatzalah',
    category: 'nonprofit',
    featured: true,
    status: 'nonprofit',
    tags: ['React', 'Express', 'Prisma', 'Cloudinary', 'Render'],
    githubUrl: 'https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch',
    visual: 'branch',
    summaryKey: 'projects.items.united_hatzalah.summary',
    impactKey: 'projects.items.united_hatzalah.impact',
  },
];
