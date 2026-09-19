'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Terminal, ArrowUpRight, Cpu } from 'lucide-react';
import { playTactileClick } from '@/lib/audio';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const PAIR_ADDRESS = 'AjobmNq3maGBLWronsoCcoBBe7GBSFFShhnRUG8GRua6';
const DEX_URL = `https://dexscreener.com/solana/${CA}`;
const SOLSCAN_TOKEN_URL = `https://solscan.io/token/${CA}`;
const BIRDEYE_URL = `https://birdeye.so/token/${CA}?chain=solana`;
const RAYDIUM_URL = `https://raydium.io/swap/?inputMint=sol&outputMint=${CA}`;

export default function ContractTerminal() {
  const [copiedCA, setCopiedCA] = useState(false);
  const [copiedPair, setCopiedPair] = useState(false);

  const handleCopyCA = async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopiedCA(true);
      playTactileClick('copy');
      setTimeout(() => setCopiedCA(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleCopyPair = async () => {
    try {
      await navigator.clipboard.writeText(PAIR_ADDRESS);
      setCopiedPair(true);
      playTactileClick('copy');
      setTimeout(() => setCopiedPair(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="contracts" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-900/80 text-xs font-mono uppercase tracking-widest text-neutral-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verification Hub
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white uppercase">
            Token Verification
          </h2>
          <p className="text-neutral-400 font-mono text-sm mt-1">
            Always verify the exact Solana contract address before executing transactions.
          </p>
        </div>

        {/* Verification Chassis */}
        <div className="rounded-2xl border border-white/15 bg-neutral-950 p-6 sm:p-8 space-y-8 shadow-2xl">
          
          {/* Main Contract Address Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-2 text-white font-bold uppercase tracking-wider">
                <Terminal className="w-4 h-4 text-neutral-300" />
                Solana Token Mint (CA)
              </span>
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-black rounded-xl border border-white/10">
              <div className="flex-1 overflow-hidden font-mono text-xs sm:text-sm text-neutral-200 break-all select-all py-1">
                {CA}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  id="terminal-copy-ca-btn"
                  onClick={handleCopyCA}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
                    copiedCA
                      ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                      : 'bg-white hover:bg-neutral-200 text-black shadow-md shadow-white/10 active:scale-95'
                  }`}
                >
                  {copiedCA ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCA ? 'Copied' : 'Copy Address'}</span>
                </button>

                <a
                  href={SOLSCAN_TOKEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playTactileClick('click')}
                  className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-300 hover:text-white transition-colors"
                  title="View on Solscan"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            
            <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider block">Token Symbol</span>
              <span className="text-white font-bold text-sm block">$ANSEM</span>
              <span className="text-[11px] text-neutral-400">Father of the Dog</span>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider block">Blockchain</span>
              <span className="text-white font-bold text-sm block">Solana SPL</span>
              <span className="text-[11px] text-neutral-400">Mainnet-Beta</span>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider block">DEX Pair Address</span>
              <div className="flex items-center justify-between gap-1">
                <span className="text-white font-bold text-sm truncate max-w-[120px]">
                  {PAIR_ADDRESS.slice(0, 6)}...{PAIR_ADDRESS.slice(-4)}
                </span>
                <button
                  onClick={handleCopyPair}
                  className="text-neutral-400 hover:text-white text-[10px] uppercase p-1"
                >
                  {copiedPair ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <span className="text-[11px] text-neutral-400">Raydium / Pump Pool</span>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-1">
              <span className="text-neutral-500 uppercase tracking-wider block">Ecosystem Role</span>
              <span className="text-white font-bold text-sm block">Meme Culture</span>
              <span className="text-[11px] text-neutral-400">100% Community Driven</span>
            </div>

          </div>

          {/* Quick Hub External Links */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <span className="text-neutral-400 uppercase tracking-wider">
              Direct Trading & Explorers:
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={DEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick('click')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
              >
                <span>Dexscreener</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={SOLSCAN_TOKEN_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick('click')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
              >
                <span>Solscan</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={BIRDEYE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick('click')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
              >
                <span>Birdeye</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://usepaid.app/token/SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick('click')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>UsePaid Fees</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={RAYDIUM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playTactileClick('click')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
              >
                <span>Raydium</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
