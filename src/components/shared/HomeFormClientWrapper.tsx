'use client';
import dynamic from 'next/dynamic';
import React from 'react';

const HomeForm = dynamic(() => import('./HomeForm'), { ssr: false });

const HomeFormClientWrapper = () => {
  return <HomeForm />;
};

export default HomeFormClientWrapper; 