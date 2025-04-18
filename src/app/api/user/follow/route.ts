import { NextRequest, NextResponse } from "next/server";

// app/api/user/follow/route.ts
export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const session = req.headers.get('authorization');
  
    const res = await fetch(`${process.env.Backend_URL}/user/follow/${id}`, {
      method: 'POST',
      headers: {
        Authorization: session!,
      },
    });
  
    const data = await res.json();
    return NextResponse.json(data);
  }

  // app/api/user/follow/route.ts
export async function DELETE(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      const session = req.headers.get('authorization');
    
      const res = await fetch(`${process.env.Backend_URL}/user/unfollow/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: session!,
        },
      });
    
      const data = await res.json();
      return NextResponse.json(data);
    }catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  