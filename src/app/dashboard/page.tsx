"use client"
import { useSession } from "next-auth/react";


export default function Home() {
  const session = useSession();
  return (
    <div>
      hello {session.data?.user.userName}
      <br/>first name:{session.data?.user.firstName}
      <br/>last name:{session.data?.user.lastName}
    </div>
  );
}
