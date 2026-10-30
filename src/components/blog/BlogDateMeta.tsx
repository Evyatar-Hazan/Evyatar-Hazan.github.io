import { CalendarDays, Clock, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BlogLanguage, BlogPostMeta } from '../../content/blog/types';
import { presentCalendarDate } from '../../features/date-presentation/presentCalendarDate';

type BlogDateMetaProps = {
  className: string;
  language: BlogLanguage;
  post: BlogPostMeta;
  showDepth?: boolean;
};

const DateValue = ({ date, language }: { date: string; language: BlogLanguage }) => {
  const presented = presentCalendarDate(date, { language });

  return presented.dateTime ? (
    <time dateTime={presented.dateTime}>{presented.text}</time>
  ) : (
    <span>{presented.text}</span>
  );
};

const BlogDateMeta = ({ className, language, post, showDepth = false }: BlogDateMetaProps) => {
  const { t } = useTranslation();
  const updatedDate = post.updatedDate
    ? presentCalendarDate(post.updatedDate, { language })
    : null;
  const showUpdatedDate = updatedDate?.status === 'valid' && updatedDate.dateTime !== post.date;

  return (
    <div className={className} data-blog-dates>
      <span className="blog-date-item" data-date-kind="published">
        <CalendarDays aria-hidden="true" />
        <span className="blog-date-label">{t('blog.publishedOn')}</span>
        <DateValue date={post.date} language={language} />
      </span>
      {showUpdatedDate && post.updatedDate && (
        <>
          <i className="blog-date-separator" aria-hidden="true" />
          <span className="blog-date-item" data-date-kind="updated">
            <RefreshCw aria-hidden="true" />
            <span className="blog-date-label">{t('blog.updatedOn')}</span>
            <time dateTime={updatedDate.dateTime ?? undefined}>{updatedDate.text}</time>
          </span>
        </>
      )}
      <i className="blog-date-separator" aria-hidden="true" />
      <span className="blog-date-item">
        <Clock aria-hidden="true" />
        {post.readTime}
      </span>
      {showDepth && (
        <>
          <i className="blog-date-separator" aria-hidden="true" />
          <span className="blog-date-item blog-archive-depth">
            {t(`blog.library.depths.${post.depth}`)}
          </span>
        </>
      )}
    </div>
  );
};

export default BlogDateMeta;
