export const profileLinks = {
  github: 'https://github.com/Evyatar-Hazan',
  linkedin: 'https://www.linkedin.com/in/evyatar-hazan-662235210/',
  email: 'mailto:evyatarhazan3.14@gmail.com',
  whatsapp: 'https://wa.me/972587127547',
  cv: '',
} as const;

export type Project = {
  id: string;
  tags: string[];
  githubUrl: string;
  visual: 'catering' | 'converter' | 'protocol' | 'nonprofit' | 'mobile' | 'learning' | 'branch';
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    id: 'nis_boutique',
    tags: ['React', 'TypeScript', 'Vite', 'Vercel', 'SEO', 'RTL'],
    githubUrl: 'https://github.com/Evyatar-Hazan/nis-boutique-catering',
    liveUrl: 'https://nisboutiquecatering.com/',
    visual: 'catering',
  },
  {
    id: 'online_converter',
    tags: ['React', 'TypeScript', 'Vite', 'i18n', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/online-converter',
    visual: 'converter',
  },
  {
    id: 'emergency_protocol',
    tags: ['React', 'Express', 'Prisma', 'Google OAuth', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/emergency-protocol-diagram',
    visual: 'protocol',
  },
  {
    id: 'lev_chedva',
    tags: ['Monorepo', 'React', 'Node.js', 'TypeScript', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/lev-hedva',
    visual: 'nonprofit',
  },
  {
    id: 'password_gen',
    tags: ['React Native', 'TypeScript', 'Core package', 'Privacy-first'],
    githubUrl: 'https://github.com/Evyatar-Hazan/password-generator',
    visual: 'mobile',
  },
  {
    id: 'test_yourself',
    tags: ['React', 'Express', 'TypeScript', 'Monorepo', 'CI'],
    githubUrl: 'https://github.com/Evyatar-Hazan/test-yourself',
    visual: 'learning',
  },
  {
    id: 'united_hatzalah',
    tags: ['React', 'Express', 'Prisma', 'Cloudinary', 'Render'],
    githubUrl: 'https://github.com/Evyatar-Hazan/united-hatzalah-shoham-branch',
    visual: 'branch',
  },
];
