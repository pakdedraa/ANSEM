'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Maximize2, X, Sparkles, Check, Copy } from 'lucide-react';
import TiltCard from './TiltCard';
import { playTactileClick } from '@/lib/audio';

interface ArtItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeType: 'primary' | 'lore' | 'banner';
  src: string;
  aspect: 'square' | 'wide' | 'portrait';
  description: string;
}

const ARTWORKS: ArtItem[] = [
  {
    id: 'ansem-official-logo',
    title: 'The Official $ANSEM Logo',
    subtitle: 'Primary Canonical Brand Mark',
    badge: 'OFFICIAL LOGO',
    badgeType: 'primary',
    src: '/assets/ansem-logo.png',
    aspect: 'portrait',
    description: 'The genuine $ANSEM logo mark. Signature pixelated hair contour, charismatic smirk, and bold black-and-white comic linework on pure obsidian.',
  },
  {
    id: 'ansem-dog-pack',
    title: 'Father of the Dog & The Pack',
    subtitle: 'Canonical Companion Artwork',
    badge: 'CORE IDENTITY',
    badgeType: 'lore',
    src: '/assets/ansem-artwork-1.png',
    aspect: 'square',
    description: 'High-resolution official composition featuring Ansem with the dog wearing sunglasses and the surrounding cultural vanguard.',
  },
  {
    id: 'ansem-dog-vanguard',
    title: 'The Dog & The Culture',
    subtitle: 'Genesis Movement Art',
    badge: 'CULTURAL ARCHIVE',
    badgeType: 'lore',
    src: '/assets/ansem-artwork-2.png',
    aspect: 'square',
    description: 'Official illustration capturing Ansem standing side-by-side with his iconic dog in sunglasses. The living symbol of the movement.',
  },
  {
    id: 'ansem-cinematic-banner',
    title: 'Cinematic Widescreen Banner',
    subtitle: '16:9 Official Panoramic Artwork',
    badge: 'BANNER EDITION',
    badgeType: 'banner',
    src: '/assets/ansem-banner.png',
    aspect: 'wide',
    description: 'Official panoramic widescreen artwork (1672x941). Full-bleed cinematic composition built for banners, headers, and displays.',
  },
];

export default function ArtGallery() {
  const [selectedArt, setSelectedArt] = useState<ArtItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const openModal = (art: ArtItem) => {
    setSelectedArt(art);
    playTactileClick('click');
  };

  const closeModal = () => {
    setSelectedArt(null);
    playTactileClick('switch');
  };

  const handleCopyAssetPath = async (src: string) => {
    try {
      const fullUrl = `${window.location.origin}${src}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      playTactileClick('copy');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section id="gallery" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/10">
      
      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-neutral-900/80 text-xs font-mono uppercase tracking-widest text-neutral-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              Brand Archive
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-white uppercase">
              Official Art Collection
            </h2>
            <p className="text-neutral-400 font-mono text-sm sm:text-base mt-2">
              Canonical master assets. Preserving the exact identity, proportions, and visual character of $ANSEM.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-500">
            <span>4 CANONICAL ASSETS · OFFICIAL HIGH-RES PNG</span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Official Logo (Dominant Card) */}
          <div className="lg:col-span-1">
            <TiltCard maxTilt={8} className="h-full rounded-2xl border border-white/25 bg-neutral-950 p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white text-black font-bold uppercase tracking-wider">
                    {ARTWORKS[0].badge}
                  </span>
                  <span className="text-neutral-500">OFFICIAL PNG</span>
                </div>

                <div
                  onClick={() => openModal(ARTWORKS[0])}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 p-3 cursor-pointer group flex items-center justify-center"
                >
                  <Image
                    src={ARTWORKS[0].src}
                    alt={ARTWORKS[0].title}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/90 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Inspect Full Size
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-bold font-mono text-white">
                  {ARTWORKS[0].title}
                </h3>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  {ARTWORKS[0].description}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <a
                    href={ARTWORKS[0].src}
                    download="ansem-official-logo.png"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTactileClick('click');
                    }}
                    className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAssetPath(ARTWORKS[0].src);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedLink ? 'Copied' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 2: Father of the Dog */}
          <div className="lg:col-span-1">
            <TiltCard maxTilt={8} className="h-full rounded-2xl border border-white/15 bg-neutral-950 p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-neutral-300 font-bold uppercase tracking-wider">
                    {ARTWORKS[1].badge}
                  </span>
                  <span className="text-neutral-500">OFFICIAL PNG</span>
                </div>

                <div
                  onClick={() => openModal(ARTWORKS[1])}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 p-3 cursor-pointer group flex items-center justify-center"
                >
                  <Image
                    src={ARTWORKS[1].src}
                    alt={ARTWORKS[1].title}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/90 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Inspect Full Size
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-bold font-mono text-white">
                  {ARTWORKS[1].title}
                </h3>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  {ARTWORKS[1].description}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <a
                    href={ARTWORKS[1].src}
                    download="ansem-dog-pack.png"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTactileClick('click');
                    }}
                    className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAssetPath(ARTWORKS[1].src);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedLink ? 'Copied' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 3: The Bull & The Pack */}
          <div className="lg:col-span-1">
            <TiltCard maxTilt={8} className="h-full rounded-2xl border border-white/15 bg-neutral-950 p-5 flex flex-col justify-between shadow-2xl">
              <div>
                <div className="flex items-center justify-between mb-4 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-neutral-300 font-bold uppercase tracking-wider">
                    {ARTWORKS[2].badge}
                  </span>
                  <span className="text-neutral-500">OFFICIAL PNG</span>
                </div>

                <div
                  onClick={() => openModal(ARTWORKS[2])}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-black border border-white/10 p-3 cursor-pointer group flex items-center justify-center"
                >
                  <Image
                    src={ARTWORKS[2].src}
                    alt={ARTWORKS[2].title}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-lg bg-black/90 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5" />
                      Inspect Full Size
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <h3 className="text-lg font-bold font-mono text-white">
                  {ARTWORKS[2].title}
                </h3>
                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  {ARTWORKS[2].description}
                </p>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <a
                    href={ARTWORKS[2].src}
                    download="ansem-dog-vanguard.png"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTactileClick('click');
                    }}
                    className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAssetPath(ARTWORKS[2].src);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedLink ? 'Copied' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Card 4: Panoramic Banner (Spanning 3 cols or wide card) */}
          <div className="lg:col-span-3">
            <TiltCard maxTilt={4} className="rounded-2xl border border-white/15 bg-neutral-950 p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-neutral-300 font-bold uppercase tracking-wider">
                  {ARTWORKS[3].badge}
                </span>
                <span className="text-neutral-500">16:9 PANORAMIC MASTER</span>
              </div>

              <div
                onClick={() => openModal(ARTWORKS[3])}
                className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-xl overflow-hidden bg-black border border-white/10 p-3 cursor-pointer group flex items-center justify-center"
              >
                <Image
                  src={ARTWORKS[3].src}
                  alt={ARTWORKS[3].title}
                  width={1200}
                  height={500}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-lg bg-black/90 border border-white/20 text-xs font-mono text-white flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Inspect Widescreen Wallpaper
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs font-mono">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">
                    {ARTWORKS[3].title}
                  </h3>
                  <p className="text-neutral-400 text-[11px] font-sans">
                    {ARTWORKS[3].description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <a
                    href={ARTWORKS[3].src}
                    download="ansem-cinematic-banner.png"
                    onClick={(e) => {
                      e.stopPropagation();
                      playTactileClick('click');
                    }}
                    className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Master</span>
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAssetPath(ARTWORKS[3].src);
                    }}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedLink ? 'Copied' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedArt && (
        <div
          id="art-lightbox-modal"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center bg-neutral-950 border border-white/20 rounded-2xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white text-black font-bold uppercase">
                  {selectedArt.badge}
                </span>
                <span className="text-white font-bold text-sm">
                  {selectedArt.title}
                </span>
              </div>

              <button
                id="modal-close-btn"
                onClick={closeModal}
                className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="w-full my-6 flex items-center justify-center max-h-[60vh] overflow-hidden rounded-xl bg-black border border-white/10 p-4">
              <Image
                src={selectedArt.src}
                alt={selectedArt.title}
                width={800}
                height={600}
                className="max-h-[55vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Footer */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono">
              <p className="text-neutral-400 text-xs font-sans max-w-md">
                {selectedArt.description}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopyAssetPath(selectedArt.src)}
                  className="px-3 py-2 rounded-lg border border-white/15 hover:bg-white/10 text-neutral-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy Direct Link'}</span>
                </button>

                <a
                  href={selectedArt.src}
                  download={`${selectedArt.id}.png`}
                  onClick={() => playTactileClick('click')}
                  className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
