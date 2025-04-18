import { NextRequest, NextResponse } from "next/server";

// app/api/user/message/conversations/route.ts
export async function GET(req: NextRequest) {
    try {
      const session = req.headers.get('authorization');
      const url = new URL(req.url);
      const take = url.searchParams.get('take');
      const skip = url.searchParams.get('skip');
  
      const res = await fetch(`${process.env.Backend_URL}/user/messagesConversations?take=${take}&skip=${skip}`, {
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
  