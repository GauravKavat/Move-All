'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="weMOVEitALL home">
          <Logo size="md" />
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[#EDEDDF]/60 hover:text-white text-sm font-mono tracking-wide transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/client"
            className="text-[#EDEDDF]/60 hover:text-white text-sm font-mono transition-colors"
          >
            Client Login
          </Link>
          <Link
            href="/client"
            className="bg-[#f37a2a] text-black font-bold text-sm px-4 py-2 rounded hover:bg-[#f37a2a]/90 transition-all font-mono tracking-wide"
          >
            GET STARTED →
          </Link>
        </div>

        <button
          className="md:hidden text-[#EDEDDF]/60 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span className="font-mono text-lg">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/10 px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-[#EDEDDF]/60 hover:text-white text-sm font-mono py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/client"
            className="block bg-[#f37a2a] text-black font-bold text-sm px-4 py-2 rounded text-center font-mono mt-2"
          >
            GET STARTED →
          </Link>
        </div>
      )}
    </header>
  );
}
