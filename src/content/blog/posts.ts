import CateringWhatsappEn from './catering-whatsapp.en.mdx';
import CateringWhatsappHe from './catering-whatsapp.he.mdx';
import CrediblePortfolioEn from './credible-portfolio.en.mdx';
import CrediblePortfolioHe from './credible-portfolio.he.mdx';
import type { BlogLanguage, BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'catering-whatsapp',
    language: 'he',
    title: 'איך בניתי אתר עסקי שמוביל ל-WhatsApp',
    excerpt: 'על הפיתוי להפוך אתר קטן למערכת גדולה, ולמה לפעמים ההחלטה הכי חכמה היא להוביל לשיחת WhatsApp אחת טובה.',
    date: '2026-06-18',
    readTime: '6 דקות קריאה',
    tags: ['Case Study', 'Frontend', 'WhatsApp'],
    featured: true,
    Content: CateringWhatsappHe,
  },
  {
    slug: 'catering-whatsapp',
    language: 'en',
    title: 'How I built a business site around WhatsApp',
    excerpt: 'About the temptation to turn a small website into a large system, and why the smarter product decision was one strong WhatsApp conversation.',
    date: '2026-06-18',
    readTime: '6 min read',
    tags: ['Case Study', 'Frontend', 'WhatsApp'],
    featured: true,
    Content: CateringWhatsappEn,
  },
  {
    slug: 'credible-portfolio',
    language: 'he',
    title: 'מה למדתי מבניית פורטפוליו אמין',
    excerpt: 'למה סטאק טכנולוגי הוא לא סיפור, איך הופכים פרויקטים לקייסים קצרים, ומה גורם לפורטפוליו להרגיש באמת ניתן לבדיקה.',
    date: '2026-06-18',
    readTime: '6 דקות קריאה',
    tags: ['Portfolio', 'Product', 'Credibility'],
    featured: false,
    Content: CrediblePortfolioHe,
  },
  {
    slug: 'credible-portfolio',
    language: 'en',
    title: 'What I learned from building a credible portfolio',
    excerpt: 'Why a technology stack is not a story, how projects become short case studies, and what makes a portfolio feel genuinely verifiable.',
    date: '2026-06-18',
    readTime: '6 min read',
    tags: ['Portfolio', 'Product', 'Credibility'],
    featured: false,
    Content: CrediblePortfolioEn,
  },
];

export const getBlogPosts = (language: BlogLanguage) =>
  blogPosts
    .filter((post) => post.language === language)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

export const getBlogPost = (slug: string | undefined, language: BlogLanguage) =>
  blogPosts.find((post) => post.slug === slug && post.language === language);
