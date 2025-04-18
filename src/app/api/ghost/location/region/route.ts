import { NextResponse } from "next/server";

// app/api/ghost/location/region/route.ts
export async function GET() {
    try {
      const res = await fetch(`${process.env.Backend_URL}/ghost/getregions`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  