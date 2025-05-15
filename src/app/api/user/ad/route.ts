import { createAdsSchema } from '@/lib/validation/all.schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  
  try {
    const session = req.headers.get('authorization');
    const json = await req.json();
    const isValidBody = createAdsSchema.safeParse(json);
    if(!isValidBody.success){
        return NextResponse.json({ error: 'invalide info' }, { status: 400 });
    }
    const {attributes,...other}=json
    const newAttributes = attributes.map((att:any)=>{
      return {attributeId:att.attributeId,value:att.value,attributeCollectionId:att.attributeCollectionId} })
    const body = JSON.stringify({attributes:newAttributes,...other});
    const res = await fetch(`${process.env.Backend_URL}/user/createAd`, {
      method: 'POST',
      headers: {
        Authorization: session!,
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await res.json();
    if (data.error) return NextResponse.json({ error: data.message }, { status: 500 });
    return NextResponse.json(data);
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const session = req.headers.get('authorization');
      const json = req.body;
  
      const res = await fetch(`${process.env.Backend_URL}/user/updateAd/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: session!,
          'Content-Type': 'application/json',
        },
        body: json,
        // Removed invalid 'duplex' property
      });
  
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      return NextResponse.json(data);
    } catch (err: any) {
      console.log(err)
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

export async function DELETE(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const session = req.headers.get('authorization');
  
      const res = await fetch(`${process.env.Backend_URL}/user/deleteAd/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: session!,
        },
      });
  
      const data = await res.json();
      if (data.error) throw new Error(data.message);
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
// app/api/user/ad/single/route.ts
export async function GET(req: NextRequest) {
    try {
      const session = req.headers.get('authorization');
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
  
      const res = await fetch(`${process.env.Backend_URL}/user/myAd/${id}`, {
        method: 'GET',
        headers: {
          Authorization: session!,
        },
      });
  
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  