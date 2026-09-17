'use client';

import Image from 'next/image';
import { ArrowUp, Heart, Shield } from 'lucide-react';
import { playTactileClick } from '@/lib/audio';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const DEX_URL = `https://dexscreener.com/solana/${CA}`;

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playTactileClick('click');
  };

  return (
    <footer id="main-footer" className="relative bg-black border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-white/20 flex items-center justify-center">
              <Image
                src="/assets/ansem-logo.png"
                alt="$ANSEM Logo"
                width={48}
                height={48}
                className="w-full h-full object-contain p-1"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-mono tracking-tight text-white">
                  $ANSEM
                </span>
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10">
                  Father of the Dog
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400 mt-1">
                The origin of dog culture on Solana.
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-400">
            <a href="#hero" className="hover:text-white transition-colors">
              Hero
            </a>
            <a href="#chart" className="hover:text-white transition-colors">
              Live Chart
            </a>
            <a href="#lore" className="hover:text-white transition-colors">
              The Origin
            </a>
            <a href="#gallery" className="hover:text-white transition-colors">
              Brand Assets
            </a>
            <a href="#contracts" className="hover:text-white transition-colors">
              Contract
            </a>
            <a
              href={DEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-neutral-200 transition-colors font-bold underline underline-offset-4"
            >
              Buy on Dexscreener ↗
            </a>
          </div>

          {/* Scroll to Top */}
          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[11px] font-mono text-neutral-500">
          <p className="max-w-2xl leading-relaxed">
            $ANSEM is a decentralized internet meme and cultural tribute token. 
            There is no roadmap, promised utility, central management, or financial expectation. 
            Meme tokens carry market risk; participate purely for cultural and community entertainment.
          </p>
          <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
            <span>© 2026 $ANSEM</span>
            <span>·</span>
            <span>All Art Rights Preserved</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
