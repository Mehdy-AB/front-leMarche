// app/api/user/ad/my/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = req.headers.get('authorization');
    const url = new URL(req.url);
    const take = url.searchParams.get('take');
    const skip = url.searchParams.get('skip');

    const json = await req.json();

    const res = await fetch(`${process.env.Backend_URL}/user/myAds?take=${take}&skip=${skip}`, {
      method: 'POST',
      headers: {
        Authorization: session!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.message);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
