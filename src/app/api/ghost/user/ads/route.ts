import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/user/ads/route.ts
export async function POST(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const take = url.searchParams.get('take');
      const skip = url.searchParams.get('skip');
      const json = await req.json();
  
      const res = await fetch(`${process.env.Backend_URL}/ghost/getUserAds/${id}?take=${take}&skip=${skip}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });
  
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  