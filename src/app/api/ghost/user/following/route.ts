import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/user/following/route.ts
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const take = url.searchParams.get('take');
      const skip = url.searchParams.get('skip');
  
      const res = await fetch(`${process.env.Backend_URL}/ghost/getUserFollowing/${id}?take=${take}&skip=${skip}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  