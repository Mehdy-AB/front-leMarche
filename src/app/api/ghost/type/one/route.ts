import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/type/route.ts
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const name = url.searchParams.get('name');
      if (!name) {
        return NextResponse.json({ error: "No id or name provided" }, { status: 400 });
      }
      const res = await fetch(`${process.env.Backend_URL}/ghost/gettypeAndCategoryByName/${name}`);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }
  