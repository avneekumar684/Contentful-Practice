import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

// Contentful rich text is JSON, not HTML. This maps each JSON node to a React element.
export default function RichText({ document }: { document: Document }) {
  return (
    <div className="prose">
      {documentToReactComponents(document, {
        renderMark: {
          [MARKS.CODE]: (text: ReactNode) => <code>{text}</code>,
        },
        renderNode: {
          [INLINES.HYPERLINK]: (node, children) => (
            <a href={node.data.uri as string} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
          [BLOCKS.QUOTE]: (_node, children) => <blockquote>{children}</blockquote>,
        },
      })}
    </div>
  );
}
