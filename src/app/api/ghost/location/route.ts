import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/location/city/route.ts
export async function GET(req: NextRequest) {
    try {
      const name = new URL(req.url).searchParams.get('name');
      const res = await fetch(`${process.env.Backend_URL}/ghost/getLocations/${name}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  