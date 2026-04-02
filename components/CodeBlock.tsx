// components/CodeBlock.tsx
'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register only the languages actually used — keeps the bundle small
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import less from 'react-syntax-highlighter/dist/esm/languages/prism/less';
import MermaidChart from './MermaidChart';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('docker', docker);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('less', less);

// Display name → Prism language name
const DISPLAY_TO_PRISM: Record<string, string> = {
  html: 'markup',
  xml: 'markup',
};

const SUPPORTED_LANGUAGES: Record<string, string> = {
  bash: 'bash',
  shell: 'bash',
  sh: 'bash',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  python: 'python',
  py: 'python',
  go: 'go',
  golang: 'go',
  yaml: 'yaml',
  yml: 'yaml',
  json: 'json',
  html: 'html',
  xml: 'xml',
  markdown: 'markdown',
  md: 'markdown',
  dockerfile: 'docker',
  docker: 'docker',
  kubernetes: 'yaml',
  kube: 'yaml',
  k8s: 'yaml',
  sql: 'sql',
  css: 'css',
  scss: 'scss',
  less: 'less',
  mermaid: 'mermaid',
};

interface CodeBlockProps {
  children?: React.ReactNode;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  children,
  language,
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  const extractedLanguage = className?.match(/language-(\w+)/)?.[1] || language || 'text';
  const displayLanguage = SUPPORTED_LANGUAGES[extractedLanguage.toLowerCase().trim()] || 'text';
  const prismLanguage = DISPLAY_TO_PRISM[displayLanguage] ?? displayLanguage;

  useEffect(() => {
    if (typeof children === 'string') {
      setCode(children.trim());
    } else if (Array.isArray(children)) {
      setCode(children.map(child => (typeof child === 'string' ? child : '')).join('').trim());
    }
  }, [children]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  if (displayLanguage === 'mermaid') {
    return <MermaidChart chart={code} />;
  }

  return (
    <div className={`relative group my-4 ${className || ''}`}>
      <span className="absolute top-2 left-4 z-10 text-xs font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/50 select-none">
        {displayLanguage}
      </span>

      <SyntaxHighlighter
        language={prismLanguage}
        style={atomDark}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        className="rounded-lg overflow-hidden"
        customStyle={{
          padding: '2.5rem 1rem 1rem 1rem',
          paddingLeft: showLineNumbers ? '3.5rem' : '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          backgroundColor: 'hsl(210, 10%, 14%)',
          border: '2px solid hsl(210, 10%, 20%)',
          color: 'hsl(210, 10%, 90%)',
          borderRadius: '0.5rem',
          margin: 0,
        }}
        lineNumberStyle={{
          color: 'hsl(0, 0%, 76%)',
          opacity: 0.8,
          fontSize: '0.75rem',
          paddingRight: '1rem',
          userSelect: 'none',
        }}
      >
        {code}
      </SyntaxHighlighter>

      <Button
        variant="ghost"
        size="sm"
        className={`absolute top-2 right-2 z-10 p-2 rounded-md transition-all duration-200 ${
          copied
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
        title={copied ? 'Copied!' : 'Copy code'}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
