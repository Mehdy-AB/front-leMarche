import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/ad/route.ts
export async function GET(req: NextRequest) {
    try {
      const id = new URL(req.url).searchParams.get('id');
      const res = await fetch(`${process.env.Backend_URL}/ghost/getAd/${id}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  