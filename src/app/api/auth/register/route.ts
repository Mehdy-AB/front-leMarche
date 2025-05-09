import { userDtoSchema } from "@/lib/validation/all.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
      const json = await req.json();
      const isValidBody = userDtoSchema.safeParse(json);
      if(!isValidBody.success){
        return NextResponse.json({ error: 'invalide user info' }, { status: 400 });
      }
      const { passwordConfirmation,firstName,token,lastName, ...otherData } = isValidBody.data;
      const res = await fetch(`${process.env.Backend_URL}/user/auth/register`,
        {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({...otherData,verificationToken:token,fullName:[firstName,lastName].join(' ')})
        }
      );
      const data = await res.json();
      if(data.error){
        return NextResponse.json({ error: 'validation failde' }, { status: 400 });
      }

      return NextResponse.json(data);
    } catch (err: any) {

      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  