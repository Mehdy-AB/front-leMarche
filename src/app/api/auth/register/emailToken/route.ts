import { otpSchema } from "@/app/lib/validation/all.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
      const json = await req.json();
      const isValidCode = otpSchema.safeParse(json);
      if(!isValidCode.success){
        console.log(json)
        return NextResponse.json({ error: 'invalide code' }, { status: 400 });
      }
      const res = await fetch(`${process.env.Backend_URL}/user/auth/verify-email-code`,
        {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                email:isValidCode.data.email,
                code:isValidCode.data.otp.join('')
              })
        }
      );
      const data = await res.json();
      if(data.error){
        return NextResponse.json({ error: data.message }, { status: data.statusCode });
      }
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  