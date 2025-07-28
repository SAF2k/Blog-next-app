// components/CodeBlock.tsx
'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import MermaidChart from './MermaidChart'; // <--- Import MermaidChart here!

type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const SUPPORTED_LANGUAGES = {
    'bash': 'bash',
    'shell': 'bash',
    'sh': 'bash',
    'javascript': 'javascript',
    'js': 'javascript',
    'typescript': 'typescript',
    'ts': 'typescript',
    'python': 'python',
    'py': 'python',
    'go': 'go',
    'golang': 'go',
    'yaml': 'yaml',
    'yml': 'yaml',
    'json': 'json',
    'html': 'html',
    'xml': 'xml',
    'markdown': 'markdown',
    'md': 'markdown',
    'dockerfile': 'dockerfile',
    'docker': 'dockerfile',
    'kubernetes': 'yaml',
    'kube': 'yaml',
    'k8s': 'yaml',
    'sql': 'sql',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    // Add 'mermaid' here so it's recognized, even though it's handled differently
    'mermaid': 'mermaid',
  } as const;

interface CodeBlockProps {
  children?: React.ReactNode;
  language?: string; // This will come from `className="language-xyz"`
  className?: string; // This will also contain `language-xyz`
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  children,
  language, // This prop might be redundant if `className` is always available
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  // Extract the language from className (e.g., "language-bash")
  const extractedLanguage = className?.match(/language-(\w+)/)?.[1] || language || 'text';
  
  // Normalize the language for display and lookup in SUPPORTED_LANGUAGES
  const normalizedDisplayLanguage = (extractedLanguage.toLowerCase().trim() as SupportedLanguage);
  const displayLanguage = SUPPORTED_LANGUAGES[normalizedDisplayLanguage] || 'text';


  useEffect(() => {
    if (typeof children === 'string') {
      setCode(children.trim());
    } else if (Array.isArray(children)) {
      setCode(children.map(child => typeof child === 'string' ? child : '').join('').trim());
    }
  }, [children]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Consider a user-facing error message here (e.g., a toast notification)
    }
  };

  // --- Crucial change here: Render MermaidChart for 'mermaid' language ---
  if (displayLanguage === 'mermaid') {
    return <MermaidChart chart={code} />;
  }
  // --- End of crucial change ---

  return (
    <div className={`relative group my-4 ${className || ''}`}>
      {/* Language label */}
      <span
        className="absolute top-2 left-4 z-10 text-xs font-mono px-2 py-0.5 rounded-md 
                   bg-blue-500/10 text-blue-500 border border-blue-500/50 
                   select-none"
      >
        {displayLanguage}
      </span>

      <SyntaxHighlighter
        language={displayLanguage}
        style={atomDark} // Base dark theme for highlighting
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        className="rounded-lg overflow-hidden"
        customStyle={{
          padding: '2.5rem 1rem 1rem 1rem',
          paddingLeft: showLineNumbers ? '3.5rem' : '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.6',
          // === UPDATED BACKGROUND AND TEXT COLORS ===
          backgroundColor: 'hsl(210, 10%, 14%)', // Darker background
          border: '2px solid hsl(210, 10%, 20%)', // Slightly lighter border
          color: 'hsl(210, 10%, 90%)', // Lighter text
          borderRadius: '0.5rem',
          margin: 0,
        }}
        lineNumberStyle={{
          color: 'hsl(0, 0.00%, 76.10%)',
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
        className={`absolute top-2 right-2 z-10 p-2 rounded-md
                    transition-all duration-200 
                    ${copied
                        ? 'bg-green-600 text-white hover:bg-green-700' // Kept distinct green for "copied" success feedback
                        : 'opacity-0 group-hover:opacity-100 hover:bg-hsl(var(--accent)) hover:text-hsl(var(--accent-foreground))'}`}
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : "Copy code to clipboard"}
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}