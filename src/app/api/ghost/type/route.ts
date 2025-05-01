import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/type/route.ts
export async function GET(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const name = url.searchParams.get('name');
      const id = url.searchParams.get('id');
      let Burl:string;
      if (id) {
        Burl = `${process.env.Backend_URL}/ghost/getCategoryByid/${id}`;
      } else if (name) {
        Burl = `${process.env.Backend_URL}/ghost/getCategoryByname/${name}`;
      } else {
        return NextResponse.json({ error: "No id or name provided" }, { status: 400 });
      }
      const res = await fetch(Burl);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }
  