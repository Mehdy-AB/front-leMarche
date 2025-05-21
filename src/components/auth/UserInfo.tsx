import Loader from "@/lib/loaders/Loader";
import axiosGhost from "@/lib/req/axiosGhost";
import {  UserDto, userDtoSchema } from "@/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const UserInfo=({phone,email,compteType,EmailToken,PhoneToken,files,siret}:{
  compteType:"INDIVIDUAL" | "PROFESSIONAL",
  EmailToken:string
  PhoneToken:string
  email:string
  phone:string
  siret:string|null
  files:{
    kbis: any;
    id: any;
    address: any;
  }|null
})=>{
  const {
      handleSubmit,
      register,
      setError,
      setValue,
      formState: { errors,isSubmitting },
    } = useForm<UserDto>({
      resolver: zodResolver(userDtoSchema),
      defaultValues: {
        emailtoken:EmailToken,
        phonetoken:PhoneToken,
        userType:compteType,
      },
    })
    const [showPassword,setShowPassword]=useState(false);
    const [showCPassword,setShowCPassword]=useState(false);

    useEffect(()=>{
      if(siret&&files)
        setValue('company',{siret:siret,id:files.id,address:files.address,kbis:files.kbis})
    },[siret,files])

    const onSubmit = (data:UserDto) => {
    let { passwordConfirmation,company,firstName,lastName, ...jsonData } = data
    const formData = new FormData();
    console.log(company)
    if(company){
      (jsonData as any).company = { siret: company.siret };
      formData.append('kbis', company.kbis[0]);
      formData.append('id', company.id[0]);
      formData.append('address', company.address[0]);
    }
    formData.append(
        'data',
        JSON.stringify({...jsonData,fullName:`${firstName} ${lastName}`}),
      );

      axiosGhost.post('/user/auth/register',formData).then(async res=>{
        if(res.data.error){
          setError('passwordConfirmation', { message: res.data.message })
          return;
        }
        await signIn("credentials", {
          identifier: res.data.username,
          password: data.password,
          redirect: true,
          callbackUrl: "/",
        })
      }).catch(e=>{
        setError('passwordConfirmation', { message: e.response.data.message || 'information invalide' })
      })
    }

    return(<>
    <form className="flex flex-col w-full mx-auto px-4" onSubmit={handleSubmit(onSubmit)}>
      <span className="text-lg font-semibold text-center mt-10 mb-5">Informations du compte</span>
      <div className="grid text-xs grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex flex-col">
          <label className="font-bold text-gray-500">Prénom</label>
          <input
            {...register('firstName')}
            type="text"
            placeholder="Entrez votre prénom"
            className="rounded-lg border border-gray-300 h-8 px-4 py-4 outline-none focus:border-gray-500"
          />
          <span>
          {errors.firstName && (
            <span className="text-xs text-red-500 mt-1">{errors.firstName.message}</span>
          )}
        </span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-gray-500">Nom</label>
          <input
            {...register('lastName')}
            type="text"
            placeholder="Entrez votre nom"
            className="rounded-lg border border-gray-300 h-8 px-4 py-4 outline-none focus:border-gray-500"
          />  
          <span>
          {errors.lastName && (
            <span className="text-xs text-red-500 mt-1">{errors.lastName.message}</span>
          )}
        </span>
        </div>
        
        <label className="font-bold col-span-1 sm:col-span-2 text-gray-500">Téléphone</label>
        <span className="col-span-1 sm:col-span-2 rounded-lg border border-gray-300 px-4 font-semibold bg-gray-200 py-2">
          {phone}
        </span>
        <label className="font-bold col-span-1 sm:col-span-2 text-gray-500">Email</label>
        <span className="col-span-1 sm:col-span-2 rounded-lg border border-gray-300 px-4 font-semibold bg-gray-200 py-2">
          {email}
        </span>
        <div className="flex flex-col">
          <label className="font-bold text-gray-500">Mot de passe</label>
          <div className=" relative w-full">
          <input
          {...register('password')}
          type={showPassword?'text':"password"}
          placeholder="Entrez votre mot de passe"
          className="rounded-lg w-full border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"
          />
          <button type="button" onClick={()=>setShowPassword(!showPassword)}  className={`absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointerrounded-e-md outline-hidden ${showPassword?'text-blue-600':'text-gray-400 '}`}>
                        <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                          <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
          </div>
          <span>
          {errors.password && (
            <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>
          )}
          </span>
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-gray-500">Confirmation</label>
          <div className=" relative w-full">
          <input
            {...register('passwordConfirmation')}
            type={showPassword?'text':"password"}
            placeholder="Répétez votre mot de passe"
            className="rounded-lg w-full border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"
            />
          <button type="button" onClick={()=>setShowCPassword(!showCPassword)}  className={`absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointerrounded-e-md outline-hidden ${showCPassword?'text-blue-600':'text-gray-400 '}`}>
                        <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                          <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                          <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                          <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                          <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                          <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button> 
          </div>
            <span>
              {errors.passwordConfirmation && (
                <span className="text-xs text-red-500 mt-1">{errors.passwordConfirmation.message}</span>
              )}
            </span>
        </div>
         
        <span className="text-tiny text-gray-500 col-span-1 sm:col-span-2">
          Utilisez 8 caractères ou plus avec un mélange de lettres, de chiffres et de symboles
        </span>
      </div>
      <button
        type="submit"
        className="bg-orange-400 py-3 disabled:bg-gray-200 rounded-full mt-6 font-semibold text-white w-full"
        disabled={isSubmitting}
      >
        {isSubmitting?
                      <Loader/>
                      :'Suivant'}
        
      </button>
    </form>
        </>);
}