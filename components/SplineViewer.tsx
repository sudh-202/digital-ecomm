'use client';

import Script from 'next/script';
import {  useRef } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        url?: string;
      };
    }
  }
}

interface SplineViewerProps {
  url: string;
  className?: string;
}

export default function SplineViewer({ url, className = '' }: SplineViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);

  return (
    <>
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js" 
        strategy="afterInteractive"
      />
      <spline-viewer
        ref={viewerRef}
        url={url}
        className={className}
      />
    </>
  );
}
