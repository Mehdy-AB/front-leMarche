import { NextRequest, NextResponse } from "next/server";

// app/api/user/favorite/route.ts
export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const session = req.headers.get('authorization');
  
    const res = await fetch(`${process.env.Backend_URL}/user/favorite/${id}`, {
      method: 'POST',
      headers: {
        Authorization: session!,
      },
    });
  
    const data = await res.json();
    return NextResponse.json(data);
  }

  // app/api/user/favorite/route.ts
export async function DELETE(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    const session = req.headers.get('authorization');
  
    const res = await fetch(`${process.env.Backend_URL}/user/unfavorite/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: session!,
      },
    });
  
    const data = await res.json();
    return NextResponse.json(data);
  }

  // app/api/user/favorite/list/route.ts
export async function GET(req: NextRequest) {
    const session = req.headers.get('authorization');
    const url = new URL(req.url);
    const take = url.searchParams.get('take');
    const skip = url.searchParams.get('skip');
  
    const res = await fetch(`${process.env.Backend_URL}/user/favorites?take=${take}&skip=${skip}`, {
      method: 'GET',
      headers: {
        Authorization: session!,
      },
    });
  
    const data = await res.json();
    return NextResponse.json(data);
  }
  