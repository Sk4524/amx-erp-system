"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({
  content,
}: MarkdownMessageProps) {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}