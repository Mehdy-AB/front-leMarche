import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/category/[id]/route.ts
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const name = url.searchParams.get('name');
  
      const res = await fetch(`${process.env.Backend_URL}/ghost/getCategoryByname/${name}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }
  