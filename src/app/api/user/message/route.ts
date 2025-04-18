import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = req.headers.get('authorization');
    const json = await req.json();

    const res = await fetch(`${process.env.Backend_URL}/user/send-message`, {
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

export async function GET(req: NextRequest) {
    const session = req.headers.get('authorization');
  
    const res = await fetch(`${process.env.Backend_URL}/user/messages/unread-count`, {
      method: 'GET',
      headers: {
        Authorization: session!,
      },
    });
  
    const data = await res.json();
    return NextResponse.json(data);
  }