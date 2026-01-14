import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const KEY = 'bank-certificates';

export async function POST(request: NextRequest) {
  try {
    const { banks } = await request.json();

    if (!Array.isArray(banks)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    await kv.set(KEY, { banks });

    return NextResponse.json(
      { success: true, message: 'Data saved successfully' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    console.error('Error saving bank data:', error);
    return NextResponse.json(
      { error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await kv.get(KEY);

    return NextResponse.json(data ?? { banks: [] }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error reading bank data:', error);
    return NextResponse.json(
      { error: 'Failed to read data' },
      { status: 500 }
    );
  }
}
