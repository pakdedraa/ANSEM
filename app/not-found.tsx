import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-mono text-center">
      <h1 className="text-6xl font-black mb-2">404</h1>
      <p className="text-neutral-400 mb-6 uppercase tracking-wider text-sm">Page Not Found</p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors"
      >
        Back to $ANSEM
      </Link>
    </div>
  );
}
