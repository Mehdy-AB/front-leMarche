import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/category/[id]/route.ts
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const category = url.searchParams.get('category');
      const type = url.searchParams.get('type');

      const res = await fetch(`${process.env.Backend_URL}/ghost/getCategoryByname/${category}/${type}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }
  