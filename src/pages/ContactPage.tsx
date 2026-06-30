import { Linkedin, Mail, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePageSeo } from '../hooks/usePageSeo';
import { profileLinks } from '../data/profile';

const ContactPage = () => {
  const { i18n } = useTranslation();
  const isHebrew = i18n.language === 'he';

  usePageSeo({
    title: isHebrew ? 'יצירת קשר | אביתר חזן' : 'Contact | Evyatar Hazan',
    description: isHebrew
      ? 'דרכי יצירת קשר ישירות עם אביתר חזן דרך WhatsApp, אימייל ו-LinkedIn עבור פרויקטים, ייעוץ ושיתופי פעולה.'
      : 'Direct contact options for Evyatar Hazan through WhatsApp, email, and LinkedIn for projects, consulting, and collaboration.',
    path: '/contact/'
  });

  const items = [
    {
      title: 'WhatsApp',
      href: `${profileLinks.whatsapp}?text=${encodeURIComponent(isHebrew ? 'היי אביתר, ראיתי את האתר שלך ורציתי לדבר על פרויקט.' : 'Hi Evyatar, I saw your site and wanted to talk about a project.')}`,
      description: isHebrew ? 'הדרך הכי מהירה להתחיל שיחה קצרה על צורך, מוצר או אתר.' : 'The fastest way to start a short conversation about a product, site, or delivery need.',
      icon: MessageCircle
    },
    {
      title: 'Email',
      href: profileLinks.email,
      description: isHebrew ? 'טוב להודעות מסודרות יותר, רקע, קישורים או דרישות מפורטות.' : 'Best for structured messages, background, links, and more detailed requirements.',
      icon: Mail
    },
    {
      title: 'LinkedIn',
      href: profileLinks.linkedin,
      description: isHebrew ? 'מתאים להיכרות מקצועית, הצעות שיתוף פעולה או תיאום המשך.' : 'Good for professional introductions, collaboration ideas, and follow-up coordination.',
      icon: Linkedin
    }
  ];

  return (
    <main className="min-h-screen px-6 pb-20 pt-32">
      <section className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 dark:text-white md:text-6xl">
            {isHebrew ? 'בוא נתחיל משיחה ברורה' : 'Start with a clear conversation'}
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            {isHebrew
              ? 'אם יש לך אתר עסקי, מוצר, כלי פנימי, אוטומציה או צורך לשפר חוויית מוצר קיימת, עדיף להתחיל מהקשר ישיר. מה המטרה, מה המצב הנוכחי, ואיפה צריך עזרה.'
              : 'If you have a business site, product, internal tool, automation flow, or an existing experience that needs sharpening, direct contact is the simplest place to start: goal, current state, and where help is needed.'}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(({ title, href, description, icon: Icon }) => (
            <a
              key={title}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="rounded-[1.5rem] border border-neutral-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70 dark:hover:border-primary-700"
            >
              <Icon className="h-6 w-6 text-primary-500" />
              <h2 className="mt-4 text-xl font-bold text-neutral-950 dark:text-white">{title}</h2>
              <p className="mt-3 text-base leading-8 text-neutral-600 dark:text-neutral-400">{description}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
