import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(
      process.cwd(),
      'src',
      'data',
      'bank-certificates.json'
    );

    const fileContents = await readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Error reading bank data:', error);

    return NextResponse.json(
      { error: 'Failed to load bank data' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
