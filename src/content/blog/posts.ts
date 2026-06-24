import CateringWhatsappEn from './catering-whatsapp.en.mdx';
import CateringWhatsappHe from './catering-whatsapp.he.mdx';
import CrediblePortfolioEn from './credible-portfolio.en.mdx';
import CrediblePortfolioHe from './credible-portfolio.he.mdx';
import DeploymentIsProductEn from './deployment-is-product.en.mdx';
import DeploymentIsProductHe from './deployment-is-product.he.mdx';
import GoogleTranslateNameBugEn from './google-translate-name-bug.en.mdx';
import GoogleTranslateNameBugHe from './google-translate-name-bug.he.mdx';
import PrivacySafeProductAnalyticsEn from './privacy-safe-product-analytics.en.mdx';
import PrivacySafeProductAnalyticsHe from './privacy-safe-product-analytics.he.mdx';
import SmallProjectArchitectureEn from './small-project-architecture.en.mdx';
import SmallProjectArchitectureHe from './small-project-architecture.he.mdx';
import type { BlogLanguage, BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'privacy-safe-product-analytics',
    language: 'he',
    title: 'איך מודדים מוצר בלי לקרוא את הדאטה של המשתמש',
    excerpt: 'על הוספת אנליטיקה ל-Online Converter בצורה שמודדת פעולות, לא תוכן רגיש, ושומרת על ההבטחה של כלי שרץ בצד לקוח.',
    date: '2026-06-24',
    readTime: '5 דקות קריאה',
    tags: ['Analytics', 'Privacy', 'Product'],
    featured: false,
    Content: PrivacySafeProductAnalyticsHe,
  },
  {
    slug: 'privacy-safe-product-analytics',
    language: 'en',
    title: 'Measuring product usage without reading user data',
    excerpt: 'About adding analytics to Online Converter in a way that measures actions, not sensitive content, and preserves the client-side privacy promise.',
    date: '2026-06-24',
    readTime: '5 min read',
    tags: ['Analytics', 'Privacy', 'Product'],
    featured: false,
    Content: PrivacySafeProductAnalyticsEn,
  },
  {
    slug: 'google-translate-name-bug',
    language: 'he',
    title: 'כשגוגל תרגם את השם שלי לג׳יבריש',
    excerpt: 'איך תרגום אוטומטי שיבש את השם שלי בפורטפוליו, ולמה שמות, לוגואים וזהות מותג צריכים גבולות ברורים ב-DOM.',
    date: '2026-06-24',
    readTime: '5 דקות קריאה',
    tags: ['Frontend', 'i18n', 'UX'],
    featured: false,
    Content: GoogleTranslateNameBugHe,
  },
  {
    slug: 'google-translate-name-bug',
    language: 'en',
    title: 'When Google translated my name into gibberish',
    excerpt: 'How automatic translation corrupted my portfolio name, and why names, logos, and brand identity need clear boundaries in the DOM.',
    date: '2026-06-24',
    readTime: '5 min read',
    tags: ['Frontend', 'i18n', 'UX'],
    featured: false,
    Content: GoogleTranslateNameBugEn,
  },
  {
    slug: 'small-project-architecture',
    language: 'he',
    title: 'גם פרויקט קטן צריך גבולות ברורים',
    excerpt: 'למה אתר קטן או פורטפוליו צריכים מבנה קוד שמאפשר לחזור, לעדכן ולהמשיך לעבוד בלי לפחד לשבור אמון.',
    date: '2026-06-21',
    readTime: '5 דקות קריאה',
    tags: ['Architecture', 'Frontend', 'Product'],
    featured: false,
    Content: SmallProjectArchitectureHe,
  },
  {
    slug: 'small-project-architecture',
    language: 'en',
    title: 'Even small projects need clear boundaries',
    excerpt: 'Why a small website or portfolio still needs code structure that makes it easy to return, update, and keep working without breaking trust.',
    date: '2026-06-21',
    readTime: '5 min read',
    tags: ['Architecture', 'Frontend', 'Product'],
    featured: false,
    Content: SmallProjectArchitectureEn,
  },
  {
    slug: 'deployment-is-product',
    language: 'he',
    title: 'למה פריסה היא חלק מהמוצר',
    excerpt: 'על ההבדל בין “עובד אצלי” לבין מוצר קטן שאפשר לסמוך עליו, ולמה build, דומיין ובדיקות הם חלק מחוויית המשתמש.',
    date: '2026-06-19',
    readTime: '5 דקות קריאה',
    tags: ['Deployment', 'Product', 'Credibility'],
    featured: false,
    Content: DeploymentIsProductHe,
  },
  {
    slug: 'deployment-is-product',
    language: 'en',
    title: 'Why deployment is part of the product',
    excerpt: 'About the gap between “works on my machine” and a small product people can trust, and why builds, domains, and tests shape the user experience.',
    date: '2026-06-19',
    readTime: '5 min read',
    tags: ['Deployment', 'Product', 'Credibility'],
    featured: false,
    Content: DeploymentIsProductEn,
  },
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
