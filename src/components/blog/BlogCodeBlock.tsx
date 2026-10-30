import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Check, Copy } from 'lucide-react';
import type { BlogLanguage } from '../../content/blog/types';

type CopyState = 'idle' | 'copied' | 'error';

type BlogCodeBlockProps = ComponentPropsWithoutRef<'pre'> & {
  language: BlogLanguage;
};

const labels = {
  en: {
    code: 'Code',
    copy: 'Copy code',
    copied: 'Copied',
    error: 'Copy failed',
  },
  he: {
    code: 'קוד',
    copy: 'העתקת קוד',
    copied: 'הועתק',
    error: 'ההעתקה נכשלה',
  },
} as const;

const getLanguageLabel = (children: ReactNode) => {
  const child = Children.count(children) === 1 ? Children.only(children) : null;
  if (!isValidElement<{ className?: string }>(child)) return null;

  return child.props.className?.match(/(?:^|\s)language-([^\s]+)/)?.[1] ?? null;
};

const fallbackCopy = (text: string) => {
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.append(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  if (!copied) throw new Error('Copy command was rejected');
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopy(text);
};

const BlogCodeBlock = ({ children, language, ...props }: BlogCodeBlockProps) => {
  const preRef = useRef<HTMLPreElement>(null);
  const resetTimer = useRef<number | null>(null);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const copy = labels[language];
  const syntaxLanguage = getLanguageLabel(children);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  const handleCopy = async () => {
    const code = preRef.current?.querySelector('code')?.textContent ?? preRef.current?.textContent ?? '';

    try {
      await copyText(code.replace(/\n$/, ''));
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), 2_000);
  };

  const buttonLabel = copyState === 'copied'
    ? copy.copied
    : copyState === 'error'
      ? copy.error
      : copy.copy;

  return (
    <figure className="blog-code-block" data-copy-state={copyState}>
      <figcaption className="blog-code-block-toolbar">
        <span className="blog-code-block-language">
          {(syntaxLanguage ?? copy.code).toLocaleUpperCase(language === 'he' ? 'he-IL' : 'en-US')}
        </span>
        <button type="button" className="blog-code-block-copy" onClick={handleCopy}>
          {copyState === 'copied'
            ? <Check aria-hidden="true" />
            : <Copy aria-hidden="true" />}
          <span>{buttonLabel}</span>
        </button>
        <span className="sr-only" aria-live="polite">{copyState === 'idle' ? '' : buttonLabel}</span>
      </figcaption>
      <pre {...props} ref={preRef} dir={props.dir ?? 'auto'} tabIndex={0}>{children}</pre>
    </figure>
  );
};

export default BlogCodeBlock;
