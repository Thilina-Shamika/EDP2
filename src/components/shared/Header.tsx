'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const menu = [
  { label: 'BUY', href: '/buy' },
  { label: 'COMMERCIAL', href: '/commercial' },
  { label: 'OFF PLAN', href: '/off-plan' },
  { label: 'COMMUNITIES', href: '/communities' },
  { label: 'MEDIA CENTER', href: '/media-center' },
  { label: 'LIST YOUR PROPERTY', href: '/list-property' },
];

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeaderBackground = () => {
    if (!transparent) return 'bg-[#393e46]';
    return scrolled ? 'bg-[#393e46]/70 backdrop-blur-md' : 'bg-transparent';
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${getHeaderBackground()}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:px-8">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 z-50">
            <Image
              src="/images/logo.webp"
              alt="Elite Destination Property"
              width={190}
              height={190}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-semibold hover:text-primary transition-colors text-sm uppercase tracking-wide"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full bg-white text-black font-semibold px-6 py-2 ml-2 shadow hover:bg-primary hover:text-white transition-colors text-sm"
            >
              CONTACT US
            </Link>
          </nav>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-white z-50 p-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Flyout Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          {/* Flyout */}
          <div className="fixed right-0 top-0 h-full w-64 bg-[#393e46] p-6 flex flex-col">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/images/logo.webp"
                  alt="Elite Destination Property"
                  width={190}
                  height={190}
                  className="h-9 w-auto"
                />
                
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white p-2"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4 mt-8">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white text-base font-medium py-2 px-2 rounded hover:bg-white/10 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="mt-4 block w-full text-center rounded-full bg-white !text-black font-semibold px-6 py-3 shadow hover:bg-primary hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                CONTACT US
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 