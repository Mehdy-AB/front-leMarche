"use client"
import { useEffect, useState } from "react";
import { EmailRegister } from "@/components/auth/EmailRegister";
import { OtpForm } from "@/components/auth/OtpForm";
import { CompteTypes } from "@/components/auth/CompteTypes";
import { UserInfo } from "@/components/auth/UserInfo";
import { AnimatePresence, motion } from "framer-motion";
import Digitone from "@/assets/svg/Digitone.svg";
import Digittwo from "@/assets/svg/Digittwo.svg";
import Digitthree from "@/assets/svg/Digitthree.svg";
import { SiretInput } from "@/components/auth/SiretInput";
import { SiretProofUpload } from "@/components/auth/SiretProofUpload";
import { SiretConfirmation } from "@/components/auth/SiretVerification";
import { SiretInfo } from "@/lib/types/types";
import { PhoneRegister } from "@/components/auth/PhoneRegister";
import { OtpFormPhone } from "@/components/auth/OtpFormPhone";
const SigninPage = () => {
    const [etape,setEtape] = useState(0)
    const [email,setEmail] = useState('')
    const [phone,setPhone] = useState('')
    const [files,setFiles] = useState<{
        kbis: any;
        id: any;
        address: any;
    }>()
    const [token,setToken] = useState('')
    const [tokenPhone,setTokenPhone] = useState('')
    const [siretInfo,setSsiretInfo] = useState<SiretInfo>()
    const [compteType,setCompteType] = useState<"INDIVIDUAL"|"PROFESSIONAL">('INDIVIDUAL')
    const components = [
      <EmailRegister setEmail={setEmail} key="email" etape={etape} setEtape={setEtape} />,
      <OtpForm key="otp" email={email} setToken={setToken} setEtape={setEtape} />,
      <PhoneRegister setPhone={setPhone} key="phone" setEtape={setEtape} />,
      <OtpFormPhone key="otp-phone" phone={phone} setToken={setTokenPhone} setEtape={setEtape} />,
      <CompteTypes key="compte" setCompteType={setCompteType} setEtape={setEtape} />,
      <UserInfo key="user" email={email} phone={phone} compteType={compteType} EmailToken={token} PhoneToken={tokenPhone} files={files||null} siret={siretInfo?.siret??null}/>,
      <SiretInput onSubmit={(data)=>{setSsiretInfo(data);setEtape(7)}} key="siret" />,
      <SiretConfirmation company={siretInfo as SiretInfo} onConfirm={()=>{setEtape(8)}} onReject={()=>{setEtape(6)}} key="confirm" />,
      <SiretProofUpload onSubmit={(data)=>{setFiles(data);setEtape(5)}} key="proof" />
    ]
    return (
      <>
        <section className=" flex w-full h-screen justify-center items-center">
        <div className="flex flex-col  w-[40rem] items-center">
        <h1 className="text-4xl font-semibold text-gray-700">Créer un compte</h1>
        <h4 className="text-sm text-gray-500">Vous avez déjà un compte ? 
          <a className="underline cursor-pointer" href='/api/auth/signin'> Connectez-vous</a>
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
                <span className="text-xs">Entrez votre adresse e-mail</span>
              </div>
              <div className={`flex flex-col justify-center items-center ${etape==2?'text-orange-400':etape>2?'':'text-gray-300'}`}>
                <span>
                  <Digittwo className="size-5" />
                </span>
                <span className="text-xs">Choisissez votre type de compte</span>
              </div>
              <div className={`flex flex-col justify-center items-center ${etape==4?'text-orange-400':'text-gray-300'}`}>
                <span>
                  <Digitthree className="size-5" />
                </span>
                <span className="text-xs">Fournissez vos informations de base</span>
              </div>
            </div>
          </div>

        <div className="flex flex-col gap-1 w-full">
        <div className="relative w-full h-[38rem] overflow-hidden" >
          <AnimatePresence mode="wait">
            <motion.div
              key={etape}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full h-full flex  flex-col gap-1"
            >
              {components[etape]}
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
