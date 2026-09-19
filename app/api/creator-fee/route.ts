import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TOKEN_CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';
const USEPAID_URL = `https://usepaid.app/token/${TOKEN_CA}`;

export interface CreatorFeePayout {
  id: string;
  lamports: number;
  sol: number;
  usdMicros: number;
  usd: number;
  signature: string;
  at: number;
}

export interface CreatorFeeData {
  tokenCa: string;
  creator: {
    handle: string;
    name: string;
    xUrl: string;
    avatarUrl?: string;
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

// Fallback baseline in case usepaid.app is rate-limited or temporarily unreachable
const FALLBACK_DATA: CreatorFeeData = {
  tokenCa: TOKEN_CA,
  creator: {
    handle: 'blknoiz06',
    name: 'Ansem',
    xUrl: 'https://x.com/blknoiz06',
  },
  totalPaidUsd: 15679.50,
  formattedTotalUsd: '$15,679.50',
  totalPaidSol: 121.76,
  payoutCount: 40,
  lastPayoutAt: 1789801881000,
  payouts: [],
  sourceUrl: USEPAID_URL,
  updatedAt: Date.now(),
};

export async function GET() {
  try {
    const res = await fetch(USEPAID_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      return NextResponse.json({ ...FALLBACK_DATA, updatedAt: Date.now() });
    }

    const html = await res.text();

    // 1. Extract the main "Sent" figure (e.g. 15,679.50)
    let totalPaidUsd = FALLBACK_DATA.totalPaidUsd;
    const sentMatch = html.match(/class="[^"]*money-figure[^"]*"[^>]*>([0-9,.]+)(?:<\/span>)+<span[^>]*>Sent<\/span>/i)
      || html.match(/money-figure[^\\]*\\",\\"children\\":\\"([0-9,.]+)\\"/);

    if (sentMatch && sentMatch[1]) {
      const parsed = parseFloat(sentMatch[1].replace(/,/g, ''));
      if (!isNaN(parsed) && parsed > 0) {
        totalPaidUsd = parsed;
      }
    }

    // 2. Parse individual payout transactions from the stream
    const txnRegex = /\{\\\"id\\\":\\\"([a-f0-9-]+)\\\",\\\"lamports\\\":\\\"(\d+)\\\"(?:,[^}]+)?\\\"usdMicros\\\":\\\"(\d+)\\\",\\\"signature\\\":\\\"([A-Za-z0-9]+)\\\",\\\"at\\\":(\d+)\}/g;
    const payouts: CreatorFeePayout[] = [];
    let match: RegExpExecArray | null;

    while ((match = txnRegex.exec(html)) !== null) {
      const lamports = Number(match[2]);
      const usdMicros = Number(match[3]);
      payouts.push({
        id: match[1],
        lamports,
        sol: Number((lamports / 1e9).toFixed(4)),
        usdMicros,
        usd: Number((usdMicros / 1e6).toFixed(2)),
        signature: match[4],
        at: Number(match[5]),
      });
    }

    // Sort by most recent timestamp first
    payouts.sort((a, b) => b.at - a.at);

    const totalLamports = payouts.reduce((acc, p) => acc + p.lamports, 0);
    const totalPaidSol = totalLamports > 0 
      ? Number((totalLamports / 1e9).toFixed(2)) 
      : FALLBACK_DATA.totalPaidSol;

    const data: CreatorFeeData = {
      tokenCa: TOKEN_CA,
      creator: {
        handle: 'blknoiz06',
        name: 'Ansem',
        xUrl: 'https://x.com/blknoiz06',
      },
      totalPaidUsd,
      formattedTotalUsd: `$${totalPaidUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      totalPaidSol,
      payoutCount: payouts.length > 0 ? payouts.length : FALLBACK_DATA.payoutCount,
      lastPayoutAt: payouts.length > 0 ? payouts[0].at : FALLBACK_DATA.lastPayoutAt,
      payouts: payouts.slice(0, 20), // Top 20 recent payouts
      sourceUrl: USEPAID_URL,
      updatedAt: Date.now(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch UsePaid creator fee data:', error);
    return NextResponse.json({ ...FALLBACK_DATA, updatedAt: Date.now() });
  }
}
