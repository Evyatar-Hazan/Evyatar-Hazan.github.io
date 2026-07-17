import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useMemo,
} from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
} from '@phosphor-icons/react';
import {
  blogPostMetadata,
  getBlogPostMetadata,
} from '../../../../src/content/blog/metadata.ts';
import { profileLinks } from '../../../../src/data/profile.ts';
import { localizedInternalPath, localizedStoryPath } from '../navigation.js';

const articleModules = import.meta.glob('../../../../src/content/blog/*.mdx');

const copy = {
  en: {
    indexEyebrow: 'FIELD NOTES / WRITING',
    indexTitle: 'Ideas become useful when they survive contact with production.',
    indexBody: 'Practical notes from building, debugging and shipping real products — where product decisions, interface craft and engineering constraints meet.',
    indexAction: 'Explore the notes',
    homeAction: 'Back to the portfolio',
    archiveEyebrow: 'THE COMPLETE NOTEBOOK',
    archiveTitle: 'Thinking, tested in the work.',
    archiveBody: 'Each note starts with a concrete problem and keeps the implementation, tradeoff or lesson visible enough to reuse.',
    read: 'Read the note',
    featured: 'Featured',
    published: 'Published',
    postEyebrow: 'FIELD NOTE / PRODUCTION LEARNING',
    back: 'Back to all writing',
    reading: 'Reading progress',
    notePosition: 'Note',
    loading: 'The article is loading inside the current experience…',
    loadError: 'The article body could not load. The rest of the portfolio is still available.',
    retryIndex: 'Return to all writing',
    notFoundEyebrow: 'NOTE NOT FOUND',
    notFoundTitle: 'This note is not in the current notebook.',
    notFoundBody: 'The link may be outdated, or the note may not exist in this language.',
    next: 'Continue with the next note',
    closeEyebrow: 'FROM NOTE TO NEXT SYSTEM',
    closeTitle: 'Have a problem worth thinking through together?',
    closeBody: 'Send the real constraint. We can turn it into a clearer product decision, a buildable path and evidence that the result works.',
    whatsapp: 'Start on WhatsApp',
    email: 'Send an email',
    work: 'Explore the project work',
  },
  he: {
    indexEyebrow: 'רשימות שטח / כתיבה',
    indexTitle: 'רעיונות הופכים לשימושיים כשהם פוגשים פרודקשן אמיתי.',
    indexBody: 'רשימות מעשיות מבנייה, דיבוג ופרסום של מוצרים אמיתיים — במקום שבו החלטות מוצר, מלאכת ממשק ומגבלות הנדסיות נפגשות.',
    indexAction: 'לכל הרשימות',
    homeAction: 'חזרה לפורטפוליו',
    archiveEyebrow: 'המחברת המלאה',
    archiveTitle: 'חשיבה שנבדקה בתוך העבודה.',
    archiveBody: 'כל רשימה מתחילה מבעיה קונקרטית ומשאירה את היישום, הפשרה או הלקח גלויים מספיק כדי להשתמש בהם שוב.',
    read: 'לקריאת הרשימה',
    featured: 'נבחר',
    published: 'פורסם',
    postEyebrow: 'רשימת שטח / למידה מפרודקשן',
    back: 'חזרה לכל הכתיבה',
    reading: 'התקדמות בקריאה',
    notePosition: 'רשימה',
    loading: 'המאמר נטען בתוך החוויה הנוכחית…',
    loadError: 'גוף המאמר לא הצליח להיטען. שאר הפורטפוליו עדיין זמין.',
    retryIndex: 'חזרה לכל הכתיבה',
    notFoundEyebrow: 'הרשימה לא נמצאה',
    notFoundTitle: 'הרשימה הזאת לא קיימת במחברת הנוכחית.',
    notFoundBody: 'ייתכן שהקישור התיישן, או שהרשימה לא קיימת בשפה הזאת.',
    next: 'להמשיך לרשימה הבאה',
    closeEyebrow: 'מהרשימה למערכת הבאה',
    closeTitle: 'יש בעיה ששווה לחשוב עליה יחד?',
    closeBody: 'שלחו את המגבלה האמיתית. אפשר להפוך אותה להחלטת מוצר ברורה יותר, למסלול שאפשר לבנות ולהוכחה שהתוצאה עובדת.',
    whatsapp: 'מתחילים ב־WhatsApp',
    email: 'שליחת אימייל',
    work: 'להמשך לפרויקטים',
  },
};

function ArrowForLanguage({ language, size = 18 }) {
  return language === 'he'
    ? <ArrowLeft size={size} weight="light" aria-hidden="true" />
    : <ArrowRight size={size} weight="light" aria-hidden="true" />;
}

function BackArrowForLanguage({ language, size = 18 }) {
  return language === 'he'
    ? <ArrowRight size={size} weight="light" aria-hidden="true" />
    : <ArrowLeft size={size} weight="light" aria-hidden="true" />;
}

function formatDate(date, language) {
  return new Intl.DateTimeFormat(language === 'he' ? 'he-IL' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

function getPosts(language) {
  return blogPostMetadata
    .filter((post) => post.language === language)
    .sort((first, second) => Date.parse(second.date) - Date.parse(first.date));
}

class ArticleLoadBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

function ArticleBody({ language, slug, ui }) {
  const loader = articleModules[`../../../../src/content/blog/${slug}.${language}.mdx`];
  const Article = useMemo(() => (loader ? lazy(loader) : null), [loader]);

  if (!Article) {
    return <p role="status" className="writing-load-state">{ui.loadError}</p>;
  }

  return (
    <ArticleLoadBoundary
      key={`${slug}:${language}`}
      fallback={<p role="status" className="writing-load-state">{ui.loadError}</p>}
    >
      <Suspense fallback={<p role="status" className="writing-load-state">{ui.loading}</p>}>
        <Article />
      </Suspense>
    </ArticleLoadBoundary>
  );
}

function WritingClose({ language, onStoryNavigate }) {
  const ui = copy[language];
  const emailAddress = profileLinks.email.replace(/^mailto:/, '');
  const emailSubject = language === 'he' ? 'שיחה בעקבות הפורטפוליו' : 'A conversation after reading your portfolio';
  const emailBody = language === 'he'
    ? 'היי אביתר, קראתי באתר ורציתי לדבר על בעיה או פרויקט.'
    : 'Hi Evyatar, I read your site and wanted to talk about a problem or project.';
  const emailHref = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  const whatsappHref = `${profileLinks.whatsapp}?text=${encodeURIComponent(emailBody)}`;

  return (
    <section
      className="writing-close-track"
      data-cinema-track
      data-cinema-id="writing-close"
      data-cinema-title={language === 'he' ? 'סוגרים מעגל' : 'Close the loop'}
      data-cinema-theme="contact"
      data-journey-label={language === 'he' ? '03 / שיחה' : '03 / CONVERSATION'}
      data-journey-phase="writing-close"
      data-journey-route="writing"
      data-journey-theme="contact"
      aria-labelledby="writing-close-title"
    >
      <div className="cinema-pin writing-close-pin">
        <div className="writing-close-copy" data-cinema-window="0.04,1" data-journey-beat="invitation">
          <p className="eyebrow">{ui.closeEyebrow}</p>
          <h2 id="writing-close-title">{ui.closeTitle}</h2>
          <p>{ui.closeBody}</p>
        </div>
        <div className="writing-close-actions" data-cinema-window="0.28,1" data-journey-beat="ready">
          <a className="button button-primary" href={whatsappHref} target="_blank" rel="noreferrer">
            {ui.whatsapp}<ArrowUpRight size={19} weight="light" aria-hidden="true" />
          </a>
          <a className="button button-secondary" href={emailHref}>
            {ui.email}<ArrowUpRight size={19} weight="light" aria-hidden="true" />
          </a>
          <a href={localizedStoryPath('#work', language)} onClick={(event) => onStoryNavigate(event, '#work')} className="writing-work-link">
            {ui.work}<ArrowForLanguage language={language} />
          </a>
        </div>
      </div>
    </section>
  );
}

export function BlogIndex({ language }) {
  const { onProjectNavigate, onStoryNavigate } = useOutletContext();
  const posts = getPosts(language);
  const ui = copy[language];

  useEffect(() => {
    document.title = language === 'he'
      ? 'כתיבה — אביתר חזן'
      : 'Writing — Evyatar Hazan';
  }, [language]);

  return (
    <main id="main-content" className="route-main writing-route" tabIndex="-1" data-focus-target>
      <section
        className="writing-hero-track"
        data-cinema-track
        data-cinema-id="writing-intro"
        data-cinema-title={language === 'he' ? 'המחברת נפתחת' : 'Open the notebook'}
        data-cinema-theme="lab"
        data-journey-label={language === 'he' ? '01 / כתיבה' : '01 / WRITING'}
        data-journey-phase="writing-intro"
        data-journey-route="writing"
        data-journey-theme="lab"
        aria-labelledby="writing-index-title"
      >
        <div className="cinema-pin writing-hero-pin">
          <div className="writing-hero-copy" data-cinema-window="0,0.86" data-journey-beat="premise">
            <p className="eyebrow">{ui.indexEyebrow}</p>
            <h1 id="writing-index-title">{ui.indexTitle}</h1>
            <p>{ui.indexBody}</p>
            <div className="writing-hero-actions">
              <a className="button button-primary" href="#writing-index">
                {ui.indexAction}<ArrowDown size={18} weight="light" aria-hidden="true" />
              </a>
              <a className="button button-secondary" href={localizedStoryPath('#lab', language)} onClick={(event) => onStoryNavigate(event, '#lab')}>
                {ui.homeAction}<BackArrowForLanguage language={language} />
              </a>
            </div>
          </div>
          <p className="writing-hero-count" data-cinema-window="0.3,1" aria-hidden="true">
            {String(posts.length).padStart(2, '0')} / NOTES
          </p>
        </div>
      </section>

      <section
        id="writing-index"
        className="writing-index-track"
        data-cinema-track
        data-cinema-id="writing-index"
        data-cinema-title={language === 'he' ? 'כל הרשימות' : 'All field notes'}
        data-cinema-theme="light"
        data-cinema-anchor="0"
        data-journey-label={language === 'he' ? '02 / המחברת' : '02 / NOTEBOOK'}
        data-journey-phase="writing-index"
        data-journey-route="writing"
        data-journey-theme="lab"
        aria-labelledby="writing-archive-title"
        tabIndex="-1"
        data-focus-target
      >
        <div className="writing-index-inner">
          <header className="writing-index-heading">
            <div>
              <p className="eyebrow">{ui.archiveEyebrow}</p>
              <h2 id="writing-archive-title">{ui.archiveTitle}</h2>
            </div>
            <p>{ui.archiveBody}</p>
          </header>

          <div className="writing-card-grid">
            {posts.map((post, index) => {
              const destination = localizedInternalPath(`/blog/${post.slug}/`, language);
              return (
                <article className="writing-card" key={post.slug} data-journey-beat={`note-${index + 1}`}>
                  <div className="writing-card-meta">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span>{formatDate(post.date, language)}</span>
                    <span><Clock size={14} weight="light" aria-hidden="true" />{post.readTime}</span>
                  </div>
                  {post.featured && <p className="writing-featured">{ui.featured}</p>}
                  <h3>
                    <a
                      id={`writing-card-${post.slug}`}
                      href={destination}
                      onClick={(event) => onProjectNavigate(event, destination)}
                    >
                      <span aria-hidden="true" />
                      {post.title}
                    </a>
                  </h3>
                  <p>{post.excerpt}</p>
                  <ul aria-label={language === 'he' ? 'נושאים' : 'Topics'}>
                    {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <p className="writing-card-action">{ui.read}<ArrowForLanguage language={language} /></p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <WritingClose language={language} onStoryNavigate={onStoryNavigate} />
    </main>
  );
}

export function BlogPost({ language }) {
  const { slug } = useParams();
  const {
    onProjectNavigate,
    onRouteBack,
    onStoryNavigate,
  } = useOutletContext();
  const ui = copy[language];
  const post = getBlogPostMetadata(slug || '', language);
  const posts = getPosts(language);
  const postIndex = posts.findIndex((candidate) => candidate.slug === slug);
  const nextPost = postIndex >= 0 ? posts[(postIndex + 1) % posts.length] : null;
  const indexDestination = localizedInternalPath('/blog/', language);

  useEffect(() => {
    document.title = post
      ? `${post.title} — ${language === 'he' ? 'אביתר חזן' : 'Evyatar Hazan'}`
      : (language === 'he' ? 'הרשימה לא נמצאה — אביתר חזן' : 'Note not found — Evyatar Hazan');
  }, [language, post]);

  if (!post) {
    return (
      <main id="main-content" className="route-main writing-route" tabIndex="-1" data-focus-target>
        <section
          className="writing-hero-track writing-missing-track"
          data-cinema-track
          data-cinema-id="writing-intro"
          data-cinema-title={ui.notFoundEyebrow}
          data-cinema-theme="lab"
          data-journey-label={ui.notFoundEyebrow}
          data-journey-phase="writing-intro"
          data-journey-route="writing"
          data-journey-theme="lab"
        >
          <div className="cinema-pin writing-hero-pin">
            <div className="writing-hero-copy" data-cinema-window="0,1">
              <p className="eyebrow">{ui.notFoundEyebrow}</p>
              <h1>{ui.notFoundTitle}</h1>
              <p>{ui.notFoundBody}</p>
              <a
                className="button button-primary"
                href={indexDestination}
                onClick={(event) => onProjectNavigate(event, indexDestination)}
              >
                {ui.retryIndex}<ArrowForLanguage language={language} />
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const nextDestination = nextPost
    ? localizedInternalPath(`/blog/${nextPost.slug}/`, language)
    : indexDestination;

  return (
    <main id="main-content" className="route-main writing-route" tabIndex="-1" data-focus-target>
      <section
        className="writing-post-hero-track"
        data-cinema-track
        data-cinema-id="writing-intro"
        data-cinema-title={post.title}
        data-cinema-theme="lab"
        data-journey-label={ui.postEyebrow}
        data-journey-phase="writing-intro"
        data-journey-route="writing"
        data-journey-theme="lab"
        aria-labelledby="writing-post-title"
      >
        <div className="cinema-pin writing-post-hero-pin">
          <div className="writing-post-hero-copy" data-cinema-window="0,0.94" data-journey-beat="title">
            <a
              className="writing-back-link"
              href={indexDestination}
              onClick={(event) => onRouteBack(event, indexDestination)}
            >
              <BackArrowForLanguage language={language} />{ui.back}
            </a>
            <p className="eyebrow">{ui.postEyebrow}</p>
            <h1 id="writing-post-title">{post.title}</h1>
            <p className="writing-post-excerpt">{post.excerpt}</p>
            <div className="writing-post-meta">
              <span>{ui.published} {formatDate(post.date, language)}</span>
              <span><Clock size={15} weight="light" aria-hidden="true" />{post.readTime}</span>
              <span>{post.tags.join(' / ')}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="writing-reading-track"
        data-cinema-track
        data-cinema-id="writing-index"
        data-cinema-title={post.title}
        data-cinema-theme="light"
        data-journey-label={language === 'he' ? '02 / קריאה' : '02 / READING'}
        data-journey-phase="writing-index"
        data-journey-route="writing"
        data-journey-theme="lab"
      >
        <div className="writing-reading-layout">
          <aside className="writing-reading-rail" aria-label={ui.reading}>
            <span>{ui.reading}</span>
            <i aria-hidden="true"><b /></i>
            <strong>{ui.notePosition} {String(postIndex + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}</strong>
          </aside>
          <article className="writing-prose">
            <ArticleBody language={language} slug={post.slug} ui={ui} />
            {nextPost && (
              <a
                id={`writing-next-${nextPost.slug}`}
                className="writing-next-note"
                href={nextDestination}
                onClick={(event) => onProjectNavigate(event, nextDestination)}
              >
                <span>{ui.next}</span>
                <strong>{nextPost.title}</strong>
                <ArrowForLanguage language={language} size={22} />
              </a>
            )}
          </article>
        </div>
      </section>

      <WritingClose language={language} onStoryNavigate={onStoryNavigate} />
    </main>
  );
}
