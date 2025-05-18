"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { EmailRegister } from "@/components/auth/EmailRegister";
import { OtpForm } from "@/components/auth/OtpForm";
import { CompteTypes } from "@/components/auth/CompteTypes";
import { UserInfo } from "@/components/auth/UserInfo";
import { AnimatePresence, motion } from "framer-motion";
import { UserNameEtape } from "@/components/auth/UserNameEtape";
import Digitone from "@/assets/svg/Digitone.svg";
import Digittwo from "@/assets/svg/Digittwo.svg";
import Digitthree from "@/assets/svg/Digitthree.svg";
import { SiretInput } from "@/components/auth/SiretInput";
import { SiretProofUpload } from "@/components/auth/SiretProofUpload";
import { SiretConfirmation } from "@/components/auth/SiretVerification";
const SigninPage = () => {
    const companyData={
    "nom": "L'ILE AUTOMOBILE",
    "siret": "94941890900014",
    "siren": "949418909",
    "date_creation": "2023-02-01",
    "etat_administratif": "A",
    "activite_principale": "45.11Z",
    "adresse": "41 RUE ISSOP RAVATE, 97400 SAINT-DENIS"
}
    const [etape,setEtape] = useState(0)
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [token,setToken] = useState('')
    const [compteType,setCompteType] = useState<"INDIVIDUAL"|"PROFESSIONAL">('INDIVIDUAL')
    const components = [
      <EmailRegister setEmail={setEmail} key="email" etape={etape} setEtape={setEtape} />,
      <OtpForm key="otp" email={email} setToken={setToken} etape={etape} setEtape={setEtape} />,
      <CompteTypes key="compte" setCompteType={setCompteType} etape={etape} setEtape={setEtape} />,
      <UserNameEtape key="username" setUserName={setUsername} etape={etape} setEtape={setEtape} />,
      <UserInfo key="user" username={username} compteType={compteType} token={token} etape={etape} setEtape={setEtape} />,
    ]
    const proSteps = [
      <SiretInput onSubmit={()=>{setEtape(1)}} key="siret" />,
      <SiretConfirmation company={companyData} onConfirm={()=>{setEtape(2)}} onReject={()=>{setEtape(0)}} key="confirm" />,
      <SiretProofUpload onSubmit={()=>{setEtape(0)}} key="proof" />
    ];

    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
      if (session) {
        router.push("/");
      }
    }, [session]);

  return (
    <>
      <section className=" flex w-full h-screen justify-center pt-[8%]">
      <div className="flex flex-col  w-[40rem] items-center">
      <h1 className="text-4xl font-semibold text-gray-700">Create an account</h1>
      <h4 className="text-sm text-gray-500">Already have an account? 
        <a className="underline cursor-pointer" onClick={()=>{router.push('/api/auth/signin')}}> Log in</a>
      </h4>
        <div className="mt-12 hidden lg:block">
          <div className="grid grid-cols-2 justify-start gap-8 px-[100px]">
            <span className="flex w-full">
              <span className={`${etape===0?'w-0':etape===1?'w-1/2':'w-full'} transition-all duration-500 bg-orange-400 h-[2px]`}/>
              <span className={`${etape===0?'w-full':etape===1?'w-1/2':'w-0'} transition-all duration-500 bg-gray-400 h-[2px]`}/>
            </span>
            
            <span className="flex w-full">
              <span className={`${etape<3?'w-0':etape==3?'w-1/2':'w-full'} transition-all duration-500 bg-orange-400 h-[2px]`}/>
              <span className={`${etape<3?'w-full':etape==3?'w-1/2':'w-0'} transition-all duration-500 bg-gray-400 h-[2px]`}/>
            </span>
          </div>
          <div className="grid gap-16 grid-cols-3">
            <div className={`flex flex-col justify-center items-center ${etape<2?'text-orange-400':''}`}>
              <span>
                <Digitone className=' size-5'/>
              </span>
              <span className="text-xs">Enter your email adresse</span>
            </div>
            <div className={`flex flex-col justify-center items-center ${etape==2?'text-orange-400':etape>2?'':'text-gray-300'}`}>
              <span>
                <Digittwo className="size-5" />
              </span>
              <span className="text-xs">Chose your account type</span>
            </div>
            <div className={`flex flex-col justify-center items-center ${etape==4?'text-orange-400':'text-gray-300'}`}>
              <span>
                <Digitthree className="size-5" />
              </span>
              <span className="text-xs">Provide your basic info</span>
            </div>
          </div>
        </div>

      <div className="flex flex-col gap-1 w-full">
      <div className="relative w-full h-[32rem] overflow-hidden" >
        <AnimatePresence mode="wait">
          <motion.div
            key={etape}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full h-full flex  flex-col gap-1"
          >
            {proSteps[etape]}
          </motion.div>
        </AnimatePresence>
      </div>  
      
      </div>
      </div>
      </section>
    </>
  );

}

export default SigninPage;
