import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/brand/route.ts
export async function GET(req: NextRequest) {
    try {
      const id = new URL(req.url).searchParams.get('id');
      const name = new URL(req.url).searchParams.get('name');
      let url='';
      if(id)url=`${process.env.Backend_URL}/ghost/getBrands/${id}`
      else url=`${process.env.Backend_URL}/ghost/getBrandsByNameType/${name}`

      const res = await fetch(url);
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      console.log(err)
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
  }
  