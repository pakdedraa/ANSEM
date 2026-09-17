'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, ArrowDown, TrendingUp, TrendingDown, Shield, Sparkles } from 'lucide-react';
import TiltCard from './TiltCard';
import { playTactileClick } from '@/lib/audio';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const DEX_URL = `https://dexscreener.com/solana/${CA}`;

interface TokenStats {
  priceUsd: string;
  priceChange24h: number;
  volume24h: number;
  liquidityUsd: number;
  marketCap: number;
}

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<TokenStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let active = true;

    const load = () => {
      fetch('/api/token')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (active && data?.pair) {
            setStats({
              priceUsd: data.pair.priceUsd || '0.00006200',
              priceChange24h: data.pair.priceChange?.h24 ?? 0,
              volume24h: data.pair.volume?.h24 ?? 0,
              liquidityUsd: data.pair.liquidity?.usd ?? 0,
              marketCap: data.pair.marketCap || data.pair.fdv || 0,
            });
            setLoadingStats(false);
          }
        })
        .catch(() => {
          if (active) setLoadingStats(false);
        });
    };

    load();
    const interval = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      playTactileClick('copy');
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-between overflow-hidden bg-black">
      
      {/* Background Architectural Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden">
        <span className="text-[14vw] font-extrabold uppercase font-mono tracking-tighter text-white/[0.03] whitespace-nowrap leading-none translate-y-[-5%]">
          FATHER OF THE DOG
        </span>
      </div>

      {/* Subtle Ambient Radial Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:32px_32px] opacity-35" />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto w-full z-10 my-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand, Narrative, CA & CTAs (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-neutral-900/80 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">
                Official Meme Lore · Solana
              </span>
            </div>

            {/* Giant Title: $ANSEM */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white font-mono leading-none">
                $ANSEM
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-300 font-sans uppercase">
                Father of the Dog
              </p>
            </div>

            {/* Narrative Copy */}
            <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed">
              Before the timeline crowned its mascots, one figure walked beside the pack and gave the dog his shades.
              No fake roadmap. No corporate utility. Just the father behind dog culture.
            </p>

            {/* CA Verification Card with One-Click Copy */}
            <div className="w-full max-w-xl rounded-xl border border-white/15 bg-neutral-950/90 p-3 sm:p-4 backdrop-blur-md space-y-2.5 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-neutral-400">
                  <Shield className="w-3.5 h-3.5 text-white/70" />
                  Contract Address (Solana)
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">Verified Token Mint</span>
              </div>
              
              <div className="flex items-center gap-2 bg-black border border-white/10 rounded-lg p-2 sm:p-2.5">
                <code
                  id="ca-display-text"
                  className="text-xs sm:text-sm font-mono text-neutral-200 tracking-wide break-all flex-1 select-all"
                >
                  {CA}
                </code>
                
                <button
                  id="hero-copy-ca-btn"
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-200 shrink-0 ${
                    copied
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-white hover:bg-neutral-200 text-black shadow-md shadow-white/10 active:scale-95'
                  }`}
                  aria-label="Copy Contract Address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>COPIED</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[2]" />
                      <span>COPY CA</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 w-full">
              <a
                id="hero-primary-buy-btn"
                href={DEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick('click')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-lg bg-white hover:bg-neutral-100 text-black font-mono font-bold text-sm tracking-wider uppercase transition-all duration-200 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-95"
              >
                <span>BUY $ANSEM</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </a>

              <a
                id="hero-scroll-chart-btn"
                href="#chart"
                onClick={() => playTactileClick('click')}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-white/20 hover:border-white/40 text-white font-mono text-sm tracking-wider uppercase transition-all duration-200 active:scale-95"
              >
                <span>LIVE CHART</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Column: Interactive 3D Card Featuring Official Logo (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <TiltCard
              maxTilt={12}
              className="w-full max-w-sm sm:max-w-md rounded-2xl border border-white/20 bg-neutral-950 p-4 sm:p-5 shadow-2xl shadow-black/90"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
                
                {/* Official Logo Image Asset */}
                <Image
                  src="/assets/ansem-logo.png"
                  alt="Official $ANSEM Logo — Father of the Dog"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  priority
                />

                {/* Subtitle Badge Inside Card */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono">
                  <span className="text-white font-bold tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                    OFFICIAL $ANSEM LOGO
                  </span>
                  <span className="text-neutral-400 text-[11px] uppercase">
                    GENUINE BRAND
                  </span>
                </div>
              </div>

              {/* Card Meta Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>IDENTITY: FATHER OF THE DOG</span>
                <span className="text-white font-semibold">100% COMMUNITY MEME</span>
              </div>
            </TiltCard>
          </div>

        </div>
      </div>

      {/* Real-time Ticker Strip */}
      <div className="relative max-w-7xl mx-auto w-full z-10 pt-6 border-t border-white/10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-mono">
          
          {/* Price */}
          <div className="p-3 sm:p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              $ANSEM Price
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
              {loadingStats ? (
                <span className="text-neutral-500 text-sm animate-pulse">Syncing Dex...</span>
              ) : (
                `$${stats?.priceUsd || '0.00006200'}`
              )}
            </div>
          </div>

          {/* 24h Change */}
          <div className="p-3 sm:p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              24h Performance
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono flex items-center gap-1.5">
              {loadingStats ? (
                <span className="text-neutral-500 text-sm animate-pulse">Calculating...</span>
              ) : (
                <>
                  {(stats?.priceChange24h ?? 0) >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                  )}
                  <span
                    className={
                      (stats?.priceChange24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }
                  >
                    {(stats?.priceChange24h ?? 0) >= 0 ? '+' : ''}
                    {(stats?.priceChange24h ?? 0).toFixed(2)}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* 24h Volume */}
          <div className="p-3 sm:p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              24h Trading Vol
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {loadingStats ? (
                <span className="text-neutral-500 text-sm animate-pulse">...</span>
              ) : (
                formatCurrency(stats?.volume24h ?? 191220)
              )}
            </div>
          </div>

          {/* Liquidity */}
          <div className="p-3 sm:p-4 rounded-xl border border-white/10 bg-neutral-950/60 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              Pooled Liquidity
            </span>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {loadingStats ? (
                <span className="text-neutral-500 text-sm animate-pulse">...</span>
              ) : (
                formatCurrency(stats?.liquidityUsd ?? 20775)
              )}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
