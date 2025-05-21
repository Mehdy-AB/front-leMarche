import CredentialsProvider from "next-auth/providers/credentials";
import { loginSchema, emailSchema, phoneSchema, nameSchema } from "./validation/all.schema";
export const authOptions = {
 
 
    providers: [
      CredentialsProvider({
        name: "Credentials",
        
        credentials: {
          identifier: { label: "identifier", type: "text", placeholder: "jsmith" },
          password: { label: "password", type: "password" },
        },
        async authorize(credentials, req) {
          if (!credentials?.identifier || !credentials.password) {
            return null;
          }
          const isValidBody = loginSchema.safeParse(credentials);
                if(!isValidBody.success){
                  return null;
                }
                let type: 'loginWithPhone' | 'loginWithEmail' | 'loginWithUserName' = 'loginWithUserName' 
                  
                if (emailSchema.safeParse(isValidBody.data.identifier).success){ type = 'loginWithEmail'}
                else if (phoneSchema.safeParse(isValidBody.data.identifier).success) type = 'loginWithPhone'
                else if (nameSchema.safeParse(isValidBody.data.identifier).success) type = 'loginWithUserName'
                const res = await fetch(`${process.env.Backend_URL}/user/auth/${type}`,
                  {   
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body:JSON.stringify(isValidBody.data)
                  }
                );
                const data = await res.json();
                if(data.error){
                  return null
                }
              return data;
        },
      }),
    ],
    callbacks: {
      
      async jwt({token, user}) {
      
          if(user)return{...token, ...user}
          return token;
      },
      async session({token,session}){
          session.user = token.user;
          session.backendToken = token.backendToken;
          return session;
      }
    },
    pages:{
      signIn:"/auth/signin",
      signOut:"/auth/signout"
    }
  };