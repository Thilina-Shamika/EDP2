"use client";

import { Suspense } from 'react';
import BuyPageContent from './BuyPageContent';

export default function BuyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyPageContent />
    </Suspense>
  );
} 