import { userDtoSchema } from "@/app/lib/validation/all.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
      const json = await req.json();
      const body = JSON.stringify(json);
      const isValidBody = userDtoSchema.safeParse({body});
      if(!isValidBody.success){
        return NextResponse.json({ error: 'invalide user info' }, { status: 400 });
      }
      const { passwordConfirmation, ...otherData } = isValidBody.data;
      const res = await fetch(`${process.env.Backend_URL}/user/auth/register`,
        {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(otherData)
        }
      );
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  