import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CA = 'SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK';

export async function GET() {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CA}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; AnsemFatherOfDog/1.0)',
      },
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch Dexscreener data' }, { status: res.status });
    }

    const data = await res.json();
    const primaryPair = data.pairs?.[0] || null;

    return NextResponse.json({
      ca: CA,
      pair: primaryPair ? {
        pairAddress: primaryPair.pairAddress,
        url: primaryPair.url,
        dexId: primaryPair.dexId,
        baseToken: primaryPair.baseToken,
        quoteToken: primaryPair.quoteToken,
        priceUsd: primaryPair.priceUsd,
        priceNative: primaryPair.priceNative,
        volume: primaryPair.volume,
        priceChange: primaryPair.priceChange,
        liquidity: primaryPair.liquidity,
        marketCap: primaryPair.marketCap || primaryPair.fdv,
        fdv: primaryPair.fdv,
        txns: primaryPair.txns,
      } : null,
      timestamp: Date.now(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
