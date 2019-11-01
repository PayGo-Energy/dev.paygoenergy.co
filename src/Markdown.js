/**
 * Copied from https://www.youngdeveloper.co/posts/react-markdown-code-and-syntax-highlighting
 */

import React from 'react';
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ value }) =>(
    <SyntaxHighlighter language="javascript" style={atomDark}>
      {value}
    </SyntaxHighlighter>);

export default function Markdown({ source }) {
  return <ReactMarkdown source={source} renderers={{ code:CodeBlock }} />;
}
