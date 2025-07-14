// components/MermaidChart.tsx
'use client';

import mermaid from 'mermaid';
import { useEffect, useRef } from 'react';

interface Props {
  chart: string;
}

export default function MermaidChart({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });

    const renderMermaid = async () => {
      if (!ref.current) return;

      try {
        const { svg } = await mermaid.render('mermaid-diagram', chart);
        ref.current.innerHTML = svg;
      } catch (error) {
        if (error instanceof Error) {
          ref.current.innerHTML = `<pre>${error.message}</pre>`;
        } else {
          ref.current.innerHTML = `<pre>Unknown error</pre>`;
        }
      }
    };

    renderMermaid();
  }, [chart]);

  return <div ref={ref} />;
}
