/**
 * MarkdownRenderer.tsx — Full Modrinth-compatible Markdown + HTML renderer
 *
 * Uses react-markdown with rehype-raw (HTML support) and remark-gfm
 * (tables, strikethrough, autolinks, task lists) to match Modrinth rendering.
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  // ── Headings ──
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-foreground mt-6 mb-3 leading-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-foreground mt-5 mb-2.5 leading-tight flex items-center gap-2">
      <span className="w-1 h-5 rounded-full bg-primary flex-shrink-0 inline-block" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-foreground/90 mt-4 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold text-muted-foreground mt-3 mb-1.5 uppercase tracking-wide">{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 className="text-xs font-semibold text-muted-foreground mt-2 mb-1">{children}</h5>
  ),
  h6: ({ children }) => (
    <h6 className="text-xs font-medium text-muted-foreground/80 mt-2 mb-1">{children}</h6>
  ),

  // ── Paragraph ──
  p: ({ children, node }) => {
    // If paragraph only contains an image, render without wrapping <p> to avoid nesting issues
    const hasOnlyImage = node?.children?.length === 1 && node.children[0].type === 'element' && (node.children[0] as any).tagName === 'img';
    if (hasOnlyImage) {
      return <>{children}</>;
    }
    return <p className="text-sm text-muted-foreground leading-relaxed my-2">{children}</p>;
  },

  // ── Links ──
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  ),

  // ── Images ──
  img: ({ src, alt, width, height, ...props }) => (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className="max-w-full rounded-xl my-3 border border-border/30 inline-block"
      loading="lazy"
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      {...props}
    />
  ),

  // ── Code ──
  code: ({ children, className }) => {
    const isBlock = className?.includes('language-');
    if (isBlock) {
      return (
        <code className="text-xs font-mono text-foreground/90 whitespace-pre">
          {children}
        </code>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded-md text-[0.85em] font-mono bg-primary/10 text-primary border border-primary/20">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-4 rounded-xl border border-border/40 bg-muted/30 overflow-x-auto p-4">
      {children}
    </pre>
  ),

  // ── Lists ──
  ul: ({ children }) => (
    <ul className="my-3 pl-5 space-y-1 list-disc marker:text-primary/60">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 pl-5 space-y-1 list-decimal marker:text-primary/60">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-muted-foreground text-sm leading-relaxed">{children}</li>
  ),

  // ── Blockquote ──
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-2 border-primary/50 text-muted-foreground italic text-sm leading-relaxed bg-primary/5 py-2 pr-3 rounded-r-lg">
      {children}
    </blockquote>
  ),

  // ── Table ──
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-xl border border-border/40">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/40">{children}</thead>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left font-semibold text-foreground border-b border-border/40">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 text-muted-foreground border-b border-border/20">{children}</td>
  ),
  tr: ({ children }) => (
    <tr className="hover:bg-muted/20 transition-colors last:[&>td]:border-0">{children}</tr>
  ),

  // ── HR ──
  hr: () => <hr className="my-5 border-border/40" />,

  // ── Strong / Em / Del ──
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic text-foreground/90">{children}</em>,
  del: ({ children }) => <del className="text-muted-foreground/60">{children}</del>,

  // ── Details / Summary ──
  details: ({ children, ...props }) => (
    <details className="my-3 rounded-xl border border-border/40 bg-muted/20 overflow-hidden" {...props}>
      {children}
    </details>
  ),
  summary: ({ children }) => (
    <summary className="px-4 py-2.5 cursor-pointer text-sm font-medium text-foreground select-none hover:bg-muted/30 transition-colors">
      {children}
    </summary>
  ),

  // ── Misc HTML tags ──
  kbd: ({ children }) => (
    <kbd className="px-1.5 py-0.5 text-[0.8em] font-mono rounded border border-border bg-muted text-foreground">{children}</kbd>
  ),
  mark: ({ children }) => (
    <mark className="bg-primary/20 text-foreground px-0.5 rounded">{children}</mark>
  ),
  iframe: ({ src, title, width, height, ...props }) => (
    <div className="my-4 rounded-xl overflow-hidden border border-border/30 aspect-video">
      <iframe
        src={src}
        title={title || 'Embedded content'}
        width={width || '100%'}
        height={height || '100%'}
        className="w-full h-full"
        allowFullScreen
        loading="lazy"
        {...props}
      />
    </div>
  ),
  center: ({ children }) => <div className="text-center my-4">{children}</div>,
  div: ({ children, style, className: cn, ...props }) => (
    <div className={cn || 'my-1'} style={style} {...props}>{children}</div>
  ),
  section: ({ children }) => <div className="my-4">{children}</div>,
  figure: ({ children }) => <figure className="my-4 flex flex-col items-start">{children}</figure>,
  figcaption: ({ children }) => <figcaption className="text-xs text-muted-foreground mt-1.5">{children}</figcaption>,
  small: ({ children }) => <small className="text-[0.8em] text-muted-foreground">{children}</small>,
  sup: ({ children }) => <sup className="text-[0.7em] align-super">{children}</sup>,
  sub: ({ children }) => <sub className="text-[0.7em] align-sub">{children}</sub>,
  u: ({ children }) => <u className="underline underline-offset-2">{children}</u>,
  s: ({ children }) => <s className="text-muted-foreground/60">{children}</s>,
  br: () => <br />,

  // ── Input (task list checkboxes from GFM) ──
  input: ({ checked, type, ...props }) => {
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="mr-1.5 accent-primary"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

// Sanitize schema that allows all Modrinth-used tags
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'a', 'img', 'iframe',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'small', 'sup', 'sub', 'kbd',
  'code', 'pre',
  'ul', 'ol', 'li',
  'blockquote',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'details', 'summary',
  'div', 'span', 'section', 'center',
  'figure', 'figcaption',
  'input',
];

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content?.trim()) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
        allowedElements={undefined}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
