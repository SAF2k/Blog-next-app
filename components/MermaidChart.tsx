// components/MermaidChart.tsx
'use client';

import mermaid from 'mermaid';
import { useEffect, useRef, useState } from 'react';

interface Props {
  chart: string; // The Mermaid diagram code
}

// Global initialization or wrapped in a custom hook to ensure it runs once
// and only on the client side.
// For simplicity in this example, we'll keep it within the useEffect,
// but be aware of its implications for re-renders.

export default function MermaidChart({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>(''); // To store SVG output
  const [error, setError] = useState<string | null>(null); // To store rendering errors
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    // Only initialize if not already initialized or if there's a need to change theme/config
    // It's generally better to ensure mermaid.initialize() is called once globally
    // for performance and to prevent re-initialization issues.
    // For a simple setup like this, inside useEffect is often acceptable,
    // but a more robust solution for a production app might involve a separate setup file
    // or a custom hook that guarantees single initialization.
    mermaid.initialize({
      startOnLoad: false, // We'll manually render
      theme: 'dark',      // Or your preferred theme
      securityLevel: 'loose', // Important for allowing external links, if needed. Be cautious.
      // Other options like font size, etc.
    });

    const renderMermaid = async () => {
      setIsLoading(true); // Start loading
      setSvgContent(''); // Clear previous content
      setError(null);    // Clear previous error

      if (!chart || !ref.current) {
        setIsLoading(false);
        return;
      }

      try {
        const chartId = `mermaid-chart-${Math.random().toString(36).substring(2, 9)}`;
        
        const { svg, bindFunctions } = await mermaid.render(chartId, chart);
        
        setSvgContent(svg); // Set the SVG content
        setIsLoading(false); // Done loading

        // If there are bindFunctions (e.g., for interactivity), apply them
        if (bindFunctions && ref.current) { // Ensure ref.current is not null
          bindFunctions(ref.current);
        }
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('Mermaid rendering error:', errorMessage);
        setError(`Failed to render diagram: ${errorMessage}`);
        setIsLoading(false);
        setSvgContent('');
      }
    };

    renderMermaid();

    // No explicit cleanup needed for most simple Mermaid diagrams as mermaid.render
    // tends to replace the content of the target element.
    // For highly interactive or complex diagrams, you might need a custom cleanup.
  }, [chart]); // Dependency on 'chart' ensures re-render if chart content changes

  // Conditional rendering based on state
  if (isLoading) {
    return (
      <div className="mermaid-chart-container my-6 flex justify-center items-center overflow-auto p-4 border rounded-lg bg-muted/20">
        <div className="text-muted-foreground animate-pulse">Loading diagram...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <strong className="font-bold">Error Rendering Diagram:</strong>
        <span className="block sm:inline ml-2">{error}</span>
        <pre className="mt-2 text-xs overflow-auto">{chart}</pre> {/* Show the problematic code */}
      </div>
    );
  }

  // Only render with dangerouslySetInnerHTML when svgContent is available and no error
  return (
    <div
      ref={ref}
      className="mermaid-chart-container my-6 flex justify-center items-center overflow-auto p-4 border rounded-lg bg-muted/20"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}