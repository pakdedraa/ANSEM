import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <h1 className="text-6xl font-black mb-4">$ANSEM</h1>
      <p className="text-xl text-neutral-400 mb-6">404 — Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
      >
        Return to Genesis
      </Link>
    </div>
  );
}
