import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const KEY = 'bank-certificates';

export async function GET() {
  try {
    const data = await kv.get(KEY);

    return NextResponse.json(data ?? { banks: [] }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error reading bank data:', error);
    return NextResponse.json(
      { error: 'Failed to load bank data' },
      { status: 500 }
    );
  }
}
