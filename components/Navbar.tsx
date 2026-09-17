'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Copy, Check, ExternalLink, Volume2, VolumeX, Activity } from 'lucide-react';
import { playTactileClick, toggleAudio } from '@/lib/audio';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const DEX_URL = `https://dexscreener.com/solana/${CA}`;

export default function Navbar() {
  const [copied, setCopied] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      playTactileClick('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleToggleAudio = () => {
    const nextState = toggleAudio();
    setAudioActive(nextState);
    if (nextState) {
      playTactileClick('switch');
    }
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/80'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Mark & Title */}
          <Link
            id="nav-brand-link"
            href="#"
            className="flex items-center gap-3 group"
            onClick={() => playTactileClick('click')}
          >
            <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-white/20 bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-white/50">
              <Image
                src="/assets/ansem-logo.png"
                alt="$ANSEM Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain p-0.5"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono leading-none group-hover:text-neutral-200 transition-colors">
                  $ANSEM
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-white/10 text-neutral-300 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SOLANA
                </span>
              </div>
              <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase leading-tight mt-0.5 hidden sm:inline-block">
                Father of the Dog
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-widest uppercase text-neutral-400">
            <a
              id="nav-link-chart"
              href="#chart"
              className="hover:text-white transition-colors py-1"
              onClick={() => playTactileClick('click')}
            >
              Live Chart
            </a>
            <a
              id="nav-link-lore"
              href="#lore"
              className="hover:text-white transition-colors py-1"
              onClick={() => playTactileClick('click')}
            >
              The Origin
            </a>
            <a
              id="nav-link-gallery"
              href="#gallery"
              className="hover:text-white transition-colors py-1"
              onClick={() => playTactileClick('click')}
            >
              Brand Archive
            </a>
            <a
              id="nav-link-contracts"
              href="#contracts"
              className="hover:text-white transition-colors py-1"
              onClick={() => playTactileClick('click')}
            >
              Contract
            </a>
          </nav>

          {/* Actions: CA Copy, Sound, Buy Button */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick CA Pill */}
            <button
              id="nav-copy-ca-btn"
              onClick={handleCopy}
              title="Copy Contract Address"
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-all duration-200 border ${
                copied
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 border-white/10 text-neutral-300 hover:border-white/25'
              }`}
            >
              <span className="text-neutral-500">CA:</span>
              <span className="text-neutral-300">SPqT...JhSK</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </button>

            {/* Audio Toggle */}
            <button
              id="nav-audio-toggle"
              onClick={handleToggleAudio}
              aria-label={audioActive ? 'Mute sound effects' : 'Enable sound effects'}
              title={audioActive ? 'Sound Effects Active' : 'Enable Tactile Audio'}
              className={`p-2 rounded-md border text-xs transition-colors ${
                audioActive
                  ? 'bg-white/10 border-white/30 text-white'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 border-white/10 text-neutral-400'
              }`}
            >
              {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Primary BUY $ANSEM CTA */}
            <a
              id="nav-buy-cta"
              href={DEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playTactileClick('click')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 shadow-md shadow-white/10 active:scale-95 whitespace-nowrap"
            >
              <span>BUY $ANSEM</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
