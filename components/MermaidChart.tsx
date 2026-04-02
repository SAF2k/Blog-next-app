// components/MermaidChart.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export default function MermaidChart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chart) {
      setIsLoading(false);
      return;
    }

    const renderMermaid = async () => {
      setIsLoading(true);
      setSvgContent('');
      setError(null);

      try {
        // Dynamically import mermaid — keeps it out of the initial JS bundle
        const { default: mermaid } = await import('mermaid');

        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
        });

        const chartId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg, bindFunctions } = await mermaid.render(chartId, chart);
        setSvgContent(svg);

        if (bindFunctions && ref.current) {
          bindFunctions(ref.current);
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('Mermaid rendering error:', errorMessage);
        setError(`Failed to render diagram: ${errorMessage}`);
        setSvgContent('');
      } finally {
        setIsLoading(false);
      }
    };

    renderMermaid();
  }, [chart]);

  if (isLoading) {
    return (
      <div className="my-6 flex justify-center items-center overflow-auto p-4 border rounded-lg bg-muted/20 min-h-[120px] animate-pulse">
        <span className="text-muted-foreground text-sm">Loading diagram...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg my-4">
        <strong className="font-bold">Diagram error:</strong>
        <span className="block sm:inline ml-2">{error}</span>
        <pre className="mt-2 text-xs overflow-auto opacity-70">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center items-center overflow-auto p-4 border rounded-lg bg-muted/20"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
