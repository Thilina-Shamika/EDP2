'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const Footer = dynamic(() => import('./Footer'), { ssr: false });

export default function FooterClientWrapper() {
  return <Footer />;
} 