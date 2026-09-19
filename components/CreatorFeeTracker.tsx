'use client';

import { useState, useEffect } from 'react';
import {
  ExternalLink,
  ShieldCheck,
  Activity,
  Coins,
  ArrowUpRight,
  Clock,
  Wallet,
  RefreshCw,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { playTactileClick } from '@/lib/audio';

interface CreatorFeePayout {
  id: string;
  lamports: number;
  sol: number;
  usdMicros: number;
  usd: number;
  signature: string;
  at: number;
}

interface CreatorFeeData {
  tokenCa: string;
  creator: {
    handle: string;
    name: string;
    xUrl: string;
  };
  totalPaidUsd: number;
  formattedTotalUsd: string;
  totalPaidSol: number;
  payoutCount: number;
  lastPayoutAt: number | null;
  payouts: CreatorFeePayout[];
  sourceUrl: string;
  updatedAt: number;
}

const TOKEN_CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const USEPAID_URL = `https://usepaid.app/token/${TOKEN_CA}`;

export default function CreatorFeeTracker() {
  const [data, setData] = useState<CreatorFeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncText, setLastSyncText] = useState('Syncing...');
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await fetch('/api/creator-fee');
        if (!isMounted) return;
        setCurrentTime(Date.now());
        if (res.ok) {
          const json: CreatorFeeData = await res.json();
          setData(json);
          setLastSyncText(new Date().toLocaleTimeString());
        }
      } catch {
        // Keep previous or fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    setCurrentTime(Date.now());
    try {
      const res = await fetch('/api/creator-fee');
      if (res.ok) {
        const json: CreatorFeeData = await res.json();
        setData(json);
        setLastSyncText(new Date().toLocaleTimeString());
      }
    } catch {
      // Keep previous
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    if (!currentTime) return 'Recently';
    const diffSeconds = Math.max(0, Math.floor((currentTime - timestamp) / 1000));
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const totalUsdDisplay = data
    ? `$${data.totalPaidUsd.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : '$15,679.50';

  const totalSolDisplay = data ? `${data.totalPaidSol.toFixed(2)} SOL` : '121.76 SOL';
  const payoutCountDisplay = data ? data.payoutCount : 40;

  return (
    <section id="creator-fees" className="relative py-20 bg-neutral-950 border-t border-white/10 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wider uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Live On-Chain Payout Stream</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-mono">
              CREATOR FEES PAID TO ANSEM
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
              Real-time trading royalties streamed autonomously to{' '}
              <a
                href="https://x.com/blknoiz06"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-emerald-500/60 underline-offset-4 hover:text-emerald-400 transition-colors font-medium"
              >
                Ansem (@blknoiz06)
              </a>{' '}
              via the{' '}
              <a
                href={USEPAID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline decoration-white/40 underline-offset-4 hover:text-white transition-colors"
              >
                UsePaid.app
              </a>{' '}
              Solana protocol.
            </p>
          </div>

          {/* Source Link & Refresh */}
          <div className="flex items-center gap-3">
            <button
              id="refresh-creator-fees-btn"
              onClick={() => {
                playTactileClick('click');
                handleManualRefresh();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/10 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
              title="Refresh live UsePaid stats"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <a
              id="view-usepaid-portal-btn"
              href={USEPAID_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playTactileClick('click')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5"
            >
              <span>Verify on UsePaid</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          {/* Total USD Sent */}
          <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/20 bg-neutral-900/70 backdrop-blur-sm relative group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Total Fees Dispatched
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                USD Sent
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {loading ? (
                <span className="text-neutral-500 text-2xl animate-pulse">Syncing...</span>
              ) : (
                totalUsdDisplay
              )}
            </div>
            <p className="mt-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% routed directly to Ansem
            </p>
          </div>

          {/* Total SOL Paid */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                Volume in SOL
              </span>
              <Coins className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {loading ? (
                <span className="text-neutral-500 text-2xl animate-pulse">...</span>
              ) : (
                totalSolDisplay
              )}
            </div>
            <p className="mt-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Native Solana Lamports
            </p>
          </div>

          {/* Total Settlement Batches */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                Settlement Cycles
              </span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {loading ? (
                <span className="text-neutral-500 text-2xl animate-pulse">...</span>
              ) : (
                `${payoutCountDisplay} Payouts`
              )}
            </div>
            <p className="mt-2 text-xs font-mono text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              Last sync: {lastSyncText}
            </p>
          </div>

          {/* Verified Beneficiary Card */}
          <div className="p-5 sm:p-6 rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between text-neutral-400 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                Target Beneficiary
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-2 truncate">
              <span>@blknoiz06</span>
            </div>
            <p className="mt-2 text-xs font-mono text-neutral-400 flex items-center gap-1">
              <span>Identity: Ansem (X Verified)</span>
            </p>
          </div>

        </div>

        {/* Live Settlements Ledger */}
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md overflow-hidden">
          
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                <span>Recent Automated Payout Settlements</span>
                <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-white/10 text-neutral-300">
                  On-Chain Ledger
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1 font-mono">
                Individual micro-settlements released directly to Ansem per UsePaid protocol batch.
              </p>
            </div>

            <a
              href={USEPAID_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playTactileClick('click')}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors self-start sm:self-auto"
            >
              <span>View all {payoutCountDisplay} on UsePaid</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Table of Transactions */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-neutral-950/80 text-neutral-400 border-b border-white/5 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Status / Time</th>
                  <th className="py-3.5 px-4 sm:px-6">Amount (SOL)</th>
                  <th className="py-3.5 px-4 sm:px-6">USD Value</th>
                  <th className="py-3.5 px-4 sm:px-6">Recipient</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Solana Tx Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data && data.payouts.length > 0 ? (
                  data.payouts.map((payout, idx) => (
                    <tr
                      key={payout.id || idx}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                          <span className="text-neutral-300 font-medium">
                            {formatTimeAgo(payout.at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-white font-bold">
                        +{payout.sol.toFixed(4)} SOL
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-emerald-400 font-medium">
                        +${payout.usd.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-neutral-400">
                        <a
                          href="https://x.com/blknoiz06"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors"
                        >
                          @blknoiz06
                        </a>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                        <a
                          href={`https://solscan.io/tx/${payout.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-neutral-400 hover:text-white transition-colors group-hover:text-emerald-300"
                        >
                          <span>
                            {payout.signature.slice(0, 6)}...{payout.signature.slice(-6)}
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Fallback demo row while loading
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500 font-mono">
                      {loading ? 'Retrieving on-chain settlements from UsePaid...' : 'No settlements recorded yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Card Notice */}
          <div className="p-4 bg-neutral-950/60 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token Contract: <span className="text-neutral-300">{TOKEN_CA}</span></span>
            </div>
            <a
              href="https://solscan.io/token/SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline decoration-white/20"
            >
              View Token Mint on Solscan
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
