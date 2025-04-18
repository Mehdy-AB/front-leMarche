import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/category/[id]/route.ts
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
  
      const res = await fetch(`${process.env.Backend_URL}/ghost/getCategoryById/${id}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }
  