'use client';

import Image from 'next/image';
import TiltCard from './TiltCard';
import { Sparkles, Shield, Compass, Heart } from 'lucide-react';
import { playTactileClick } from '@/lib/audio';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';

export default function NarrativeSection() {
  return (
    <section id="lore" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden border-t border-white/10">
      
      {/* Subtle Background Lighting Accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-900/80 text-xs font-mono uppercase tracking-widest text-neutral-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            The Origin Story
          </div>
          <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white uppercase leading-tight">
            Father of the Dog
          </h2>
          <p className="text-neutral-400 font-mono text-sm sm:text-base mt-2">
            The unwritten law of the timeline. The shepherd of dog culture.
          </p>
        </div>

        {/* Narrative Split: Story & Hero Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: The Narrative Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-neutral-300 font-sans">
            
            <div className="space-y-4">
              <p className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                Every market cycle crowns a dog. But the timeline always wondered: who fathered the pack?
              </p>
              <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
                Before the mascots multiplied across decentralized exchanges, one figure stood in the center of the arena. 
                He didn&apos;t issue promises. He didn&apos;t promise artificial utility or synthetic roadmaps. 
                He put the shades on the dog, stood with the bull, and let internet culture take its rightful course.
              </p>
            </div>

            {/* Three Cultural Axioms (clean, non-corporate) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono">
              
              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  The Genesis
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  The origin of the dog meme renaissance. Born from genuine timeline culture, not marketing boards.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Shield className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  The Shades
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Unfazed by market volatility. Cool, confident, and permanently locked on the horizon.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-neutral-950/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  The Bond
                </h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                  Loyalty over speculation. The father protects the pack, and the pack honors the father.
                </p>
              </div>

            </div>

            {/* Quote Callout */}
            <div className="p-5 rounded-xl border-l-2 border-white bg-neutral-950 text-neutral-200 italic font-mono text-sm sm:text-base">
              “Culture isn&apos;t manufactured in a whitepaper. It&apos;s born when the pack knows who leads.”
            </div>

          </div>

          {/* Right Column: "Father and Dog" Interactive Artwork (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard
              maxTilt={8}
              className="w-full max-w-sm sm:max-w-md rounded-2xl border border-white/20 bg-neutral-950 p-4 sm:p-5 shadow-2xl shadow-black"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
                <Image
                  src="/assets/ansem-artwork-1.png"
                  alt="$ANSEM — Father of the Dog"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-xs font-mono flex items-center justify-between">
                  <span className="text-white font-bold tracking-wider uppercase">
                    FATHER & THE PACK
                  </span>
                  <span className="text-neutral-400 text-[10px]">
                    OFFICIAL ART PIECE
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>CANONICAL COMPOSITION</span>
                <span className="text-white font-mono">OFFICIAL PNG</span>
              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
