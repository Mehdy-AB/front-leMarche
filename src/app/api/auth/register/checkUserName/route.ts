import { usernameSchemaObject } from "@/lib/validation/all.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    
    try {
      const json = await req.json();
      const isValid = usernameSchemaObject.safeParse(json);
      if(!isValid.success){
        return NextResponse.json({ error: 'invalide userName' }, { status: 400 });
      }

      const res = await fetch(`${process.env.Backend_URL}/user/auth/checkUserName/${isValid.data.username}`,
        {   
            method: 'GET',

        }
      );
      const data = await res.json();
      if(data.error){
        return NextResponse.json({ error: data.message }, { status: data.statusCode });
      }
      
      return NextResponse.json(data);
    } catch (err: any) {
      return NextResponse.json({ error: 'invalide userName' }, { status: 500 });
    }
  }
  