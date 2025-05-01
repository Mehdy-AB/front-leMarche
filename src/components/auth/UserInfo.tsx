import axiosGhost from "@/lib/req/axiosGhost";
import {  UserDto, userDtoSchema } from "@/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export const UserInfo=({etape,setEtape,compteType,token,username}:{
  etape:number,
  compteType:"INDIVIDUAL" | "PROFESSIONAL",
  token:string
  username:string
  setEtape:React.Dispatch<React.SetStateAction<number>>
})=>{
  const {
      control,
      handleSubmit,
      register,
      setError,
      getValues,
      formState: { errors,isSubmitting },
    } = useForm<UserDto>({
      resolver: zodResolver(userDtoSchema),
      defaultValues: {
        token:token,
        userType:compteType,
        username:username
      },
    })
    const router = useRouter();
    const onSubmit = (data:UserDto) => {
      axiosGhost.post('/auth/register',data).then(async res=>{
        if(res.data.error){
          setError('password', { message: res.data.message })
          return;
        }
        await signIn("credentials", {
          identifier: data.username,
          password: data.password,
          redirect: true,
          callbackUrl: "/",
        })
      }).catch(e=>{
        setError('password', { message: e.response.data.error || 'information invalide' })
      })
    }

    return(<>
    <form className="flex flex-col w-full " onSubmit={handleSubmit(onSubmit)}>
        <span className="text-lg font-semibold text-center mt-10 mb-5 ">compte information</span>
        <div className="grid text-xs grid-cols-2 gap-x-4 gap-y-2">
        <label className="font-bold text-gray-500">FirstName</label>
        <label className="font-bold text-gray-500">LastName</label>
        <input {...register('firstName')} type="text" placeholder="Enter your firstName" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        
        <input {...register('lastName')} type="text"  placeholder="Enter your userName" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <span>{errors.lastName && (
          <span className="text-xs text-red-500 mt-1">{errors.lastName.message}</span>
        )}</span>
        <span>{errors.username && (
          <span className="text-xs text-red-500 mt-1">{errors.username.message}</span>
        )}</span>
        <label className="font-bold col-span-2 text-gray-500">Phone</label>
        <input {...register('phone')} type="number" min={0} maxLength={9} spellCheck prefix="+33" placeholder="234-234-245" className=" col-span-2 rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <span className="col-span-2">{errors.phone && (
          <span className="text-xs text-red-500 mt-1">{errors.phone.message}</span>
        )}</span>
        <label className="font-bold text-gray-500">Password</label>
        <label className="font-bold text-gray-500">Confirmation Password</label>
        <input {...register('password')} type="text" placeholder="Enter your Password" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        
        <input {...register('passwordConfirmation')} type="text" placeholder="Repete your Password" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <span>{errors.password && (
          <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>
        )}</span>
        <span>{errors.passwordConfirmation && (
          <span className="text-xs text-red-500 mt-1">{errors.passwordConfirmation.message}</span>
        )}</span>
        <span className="text-tiny text-gray-500 col-span-2">Use 8 or more characters with a mix of letters, numbers & symbols</span>
        </div>
      <button type="submit" className="bg-orange-400 rounded-4xl py-3 rounded-full mt-6 font-semibold text-white">Next</button>
    </form>  
        </>);
}