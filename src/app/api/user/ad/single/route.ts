import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const session = req.headers.get('authorization');
    const id = new URL(req.url).searchParams.get('id');
    if(!id ){
      return NextResponse.json({ error: 'invalide info' }, { status: 400 });
    }
    const res = await fetch(`${process.env.Backend_URL}/user/myAd/${id}`, {
      method: 'GET',
      headers: {
        Authorization: session!,
      }
    });

    const data = await res.json();
    if (data.error) return NextResponse.json({ error: data.error }, { status: 409 });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
