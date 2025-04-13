import CredentialsProvider from "next-auth/providers/credentials";
export const authOptions = {
 
 
    providers: [
      CredentialsProvider({
        name: "Credentials",
        
        credentials: {
          username: { label: "username", type: "text", placeholder: "jsmith" },
          password: { label: "password", type: "password" },
          loginMod: { label: "loginMod", type: "text", placeholder: "username" },
        },
        async authorize(credentials, req) {
          if (!credentials?.username || !credentials.password || !credentials.loginMod) {
            return null;
          }
          try{
            if (credentials.loginMod === "phone") {
            const res = await fetch(process.env.Backend_URL + "/user/auth/loginWithPhone", {
              method: "POST",
              body: JSON.stringify({
                phone: credentials.username,
                password: credentials.password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!res.ok) {
              return null;
            }
    
            const user = await res.json();
            return user;

          }else if (credentials.loginMod === "email") {
            const res = await fetch(process.env.Backend_URL + "/user/auth/loginWithEmail", {
              method: "POST",
              body: JSON.stringify({
                email: credentials.username,
                password: credentials.password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (!res.ok) {
              return null;
            }
    
            const user = await res.json();
            return user;

          } else {
            const res = await fetch(process.env.Backend_URL + "/user/auth/loginWithUserName", {
              method: "POST",
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            console.log(res)
            if (!res.ok) {
              return null;
            }
    
            const user = await res.json();
            return user;

          }
          }catch(error:any){
            console.log(error.message)
            return null;
          }
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