import { cleanFilterDto } from "@/lib/functions";
import { filterDtoSchema } from "@/lib/validation/all.schema";
import { NextRequest, NextResponse } from "next/server";

// app/api/ghost/ad/search/route.ts
export async function POST(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const take = url.searchParams.get('take');
      const skip = url.searchParams.get('skip');
      const json = await req.json();
      const isValidBody = filterDtoSchema.safeParse(json);
        if(!isValidBody.success){
          return NextResponse.json({ error: 'invalide info' }, { status: 400 });
        }
      const clean  =cleanFilterDto(isValidBody.data)
      const res = await fetch(`${process.env.Backend_URL}/ghost/searchAds?take=${take}&skip=${skip}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clean),
      });
      const data = await res.json();
      if(data?.error)return NextResponse.json({ error: 'invalide info' }, { status: 400 });
      return NextResponse.json(data);
    } catch (err: any) {
      console.log(err)
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  