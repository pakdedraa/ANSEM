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
      signal: AbortSignal.timeout(3500),
    });

    if (!res.ok) {
      return NextResponse.json({ ca: CA, pair: null, timestamp: Date.now() });
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
  } catch {
    return NextResponse.json({ ca: CA, pair: null, timestamp: Date.now() });
  }
}
