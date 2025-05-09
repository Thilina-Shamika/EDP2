"use client";

import { Suspense } from 'react';
import CommercialPageContent from './CommercialPageContent';

export default function CommercialPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommercialPageContent />
    </Suspense>
  );
} 