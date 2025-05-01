import { sendCodeDtoSchema } from "@/lib/validation/all.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
      const json = await req.json();
      const isValidEmail = sendCodeDtoSchema.safeParse(json);
      if(!isValidEmail.success){
        return NextResponse.json({ error: 'invalide email' }, { status: 400 });
      }

      const res = await fetch(`${process.env.Backend_URL}/user/auth/email-code`,
        {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(isValidEmail.data)
        }
      );
      const data = await res.json();
      if(data.error){
        return NextResponse.json({ error: data.message }, { status: data.statusCode });
      }
      
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: 'invalide email' }, { status: 500 });
    }
  }
  