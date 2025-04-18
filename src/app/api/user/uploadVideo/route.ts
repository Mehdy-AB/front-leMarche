import { NextRequest, NextResponse } from "next/server";

// app/api/user/video/route.ts
export async function POST(req: NextRequest) {
    const session = req.headers.get('authorization');
    const form = await req.formData();
    console.log('form', form);
    const res = await fetch(`${process.env.Backend_URL}/user/uploadVideo`, {
      method: 'POST',
      headers: {
        Authorization: session!,
      },
      body: form,
    });
  
    const data = await res.json();
    return NextResponse.json(data);
  }
  