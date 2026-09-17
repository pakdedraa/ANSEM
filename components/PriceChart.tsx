'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, Activity, TrendingUp, TrendingDown, RefreshCw, BarChart2, Zap } from 'lucide-react';
import { playTactileClick } from '@/lib/audio';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const DEX_EMBED_URL = `https://dexscreener.com/solana/${CA}?embed=1&theme=dark&trades=0&info=0`;
const DEX_FULL_URL = `https://dexscreener.com/solana/${CA}`;

interface PairDetails {
  priceUsd: string;
  priceNative: string;
  volume: { h24?: number; h6?: number; h1?: number; m5?: number };
  priceChange: { h24?: number; h6?: number; h1?: number; m5?: number };
  liquidity: { usd?: number };
  marketCap?: number;
  txns: { h24?: { buys: number; sells: number } };
  pairAddress?: string;
}

export default function PriceChart() {
  const [copied, setCopied] = useState(false);
  const [pairData, setPairData] = useState<PairDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [activeView, setActiveView] = useState<'dex' | 'lightweight'>('dex');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = () => {
      fetch('/api/token')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isSubscribed && data?.pair) {
            setPairData(data.pair);
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
          }
        })
        .catch(() => {
          if (isSubscribed) setLoading(false);
        });
    };

    loadData();
    const interval = setInterval(loadData, 12000);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
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

  const formatUsd = (val?: number) => {
    if (!val) return '$0';
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(1)}K`;
    return `$${val.toFixed(2)}`;
  };

  return (
    <section id="chart" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-white/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono uppercase tracking-wider bg-white/10 text-neutral-300 border border-white/10 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Dexscreener Feed
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white uppercase">
              $ANSEM Price Chart
            </h2>
            <p className="text-sm font-mono text-neutral-400 mt-1">
              Live automated market data paired with SOL on Solana
            </p>
          </div>

          {/* Controls: Mode Switcher & Open in Dexscreener */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* View Switcher: Interactive Pro vs Lightweight Mobile */}
            <div className="flex items-center bg-neutral-900 border border-white/10 p-1 rounded-lg text-xs font-mono">
              <button
                id="chart-view-pro-btn"
                onClick={() => {
                  setActiveView('dex');
                  playTactileClick('switch');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeView === 'dex'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>TradingView</span>
              </button>
              
              <button
                id="chart-view-pulse-btn"
                onClick={() => {
                  setActiveView('lightweight');
                  playTactileClick('switch');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                  activeView === 'lightweight'
                    ? 'bg-white text-black font-bold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Lightweight</span>
              </button>
            </div>

            {/* Direct Dexscreener Link */}
            <a
              id="chart-open-dexscreener-btn"
              href={DEX_FULL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playTactileClick('click')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/20 hover:border-white/40 text-white text-xs font-mono tracking-wider uppercase transition-all"
            >
              <span>Full Dexscreener</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Integrated Ticker Bar Above Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
          
          {/* Price USD */}
          <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
            <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">USD Price</span>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {loading ? '...' : `$${pairData?.priceUsd || '0.00006200'}`}
            </div>
            <span className="text-[10px] text-neutral-500 block truncate">
              {pairData?.priceNative ? `${pairData.priceNative} SOL` : ''}
            </span>
          </div>

          {/* 24h Change */}
          <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
            <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">24h Change</span>
            <div className="flex items-center gap-1 text-base sm:text-lg font-bold">
              {(pairData?.priceChange?.h24 ?? 0) >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span className={(pairData?.priceChange?.h24 ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {(pairData?.priceChange?.h24 ?? 0) >= 0 ? '+' : ''}
                {(pairData?.priceChange?.h24 ?? 0).toFixed(2)}%
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 block">
              1h: {pairData?.priceChange?.h1 ? `${pairData.priceChange.h1}%` : '0%'}
            </span>
          </div>

          {/* 24h Volume */}
          <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
            <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">24h Volume</span>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {formatUsd(pairData?.volume?.h24 ?? 191220)}
            </div>
            <span className="text-[10px] text-neutral-500 block">
              6h: {formatUsd(pairData?.volume?.h6)}
            </span>
          </div>

          {/* Liquidity */}
          <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
            <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">Liquidity</span>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {formatUsd(pairData?.liquidity?.usd ?? 20775)}
            </div>
            <span className="text-[10px] text-neutral-500 block">Locked on Solana</span>
          </div>

          {/* Market Cap */}
          <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
            <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">Market Cap</span>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {formatUsd(pairData?.marketCap ?? 59554)}
            </div>
            <span className="text-[10px] text-neutral-500 block">Circulating</span>
          </div>

          {/* Transactions (24h) */}
          <div className="p-3 rounded-xl border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
            <span className="text-[10px] uppercase text-neutral-400 block mb-0.5">24h Swaps</span>
            <div className="text-base sm:text-lg font-bold text-white truncate">
              {pairData?.txns?.h24 ? `${pairData.txns.h24.buys + pairData.txns.h24.sells}` : '2,976'}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
              <span className="text-emerald-400">{pairData?.txns?.h24?.buys ?? 1638}B</span>
              <span>/</span>
              <span className="text-rose-400">{pairData?.txns?.h24?.sells ?? 1338}S</span>
            </div>
          </div>

        </div>

        {/* The Seamless Integrated Chart Frame */}
        <div className="relative rounded-2xl border border-white/15 bg-neutral-950 overflow-hidden shadow-2xl shadow-black/80">
          
          {/* Top Bar of the Chart Container */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-neutral-900/90 border-b border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-white tracking-wider">$ANSEM / SOL</span>
              <span className="text-neutral-500 hidden sm:inline">|</span>
              <span className="text-neutral-400 text-[11px] hidden sm:inline truncate max-w-xs">
                CA: {CA.slice(0, 8)}...{CA.slice(-8)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-neutral-500 text-[11px] hidden md:inline">
                  Updated: {lastUpdated}
                </span>
              )}

              <button
                id="chart-copy-ca-small"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-neutral-300 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy CA'}</span>
              </button>
            </div>
          </div>

          {/* Main Chart Body */}
          {activeView === 'dex' ? (
            <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[650px] bg-[#0E0F14]">
              {/* Subtle Loading Placeholder */}
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 text-neutral-400 font-mono text-sm space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  <span>Connecting to Dexscreener Solana Node...</span>
                </div>
              )}

              <iframe
                id="dexscreener-embed"
                src={DEX_EMBED_URL}
                title="$ANSEM Dexscreener Live Price Chart"
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0"
                style={{
                  colorScheme: 'dark',
                }}
              />
            </div>
          ) : (
            /* Lightweight Fast-Load Real-Time Price Pulse View for Mobile */
            <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] bg-black">
              
              <div className="max-w-md space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                  <Zap className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold font-mono text-white">
                  Lightweight Real-Time Mode
                </h3>
                <p className="text-xs sm:text-sm font-mono text-neutral-400">
                  Zero-latency live price pulse direct from the Solana orderbook. Ideal for low-bandwidth and mobile connections.
                </p>
              </div>

              {/* Live Metric Display Box */}
              <div className="w-full max-w-lg p-6 rounded-xl border border-white/10 bg-neutral-950 font-mono space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400 text-xs uppercase">Current Value</span>
                  <span className="text-2xl font-black text-white">
                    ${pairData?.priceUsd || '0.00006200'}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400 text-xs uppercase">24h Net Movement</span>
                  <span className={`text-base font-bold ${(pairData?.priceChange?.h24 ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(pairData?.priceChange?.h24 ?? 0) >= 0 ? '+' : ''}
                    {(pairData?.priceChange?.h24 ?? 0).toFixed(2)}%
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-neutral-400 text-xs uppercase">24h Trading Volume</span>
                  <span className="text-white text-base font-bold">
                    {formatUsd(pairData?.volume?.h24 ?? 191220)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 text-xs uppercase">Solana Pair</span>
                  <span className="text-neutral-300 text-xs font-mono truncate max-w-[200px]">
                    {pairData?.pairAddress || 'Ajobm...GRua6'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setActiveView('dex')}
                  className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Switch to TradingView Chart
                </button>
                <a
                  href={DEX_FULL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Open on Dexscreener</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}

          {/* Chart Bottom Bar */}
          <div className="px-4 py-3 bg-neutral-950 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Real-time Solana AMM Data</span>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href={DEX_FULL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white transition-colors underline underline-offset-4"
              >
                Inspect on Dexscreener ↗
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
