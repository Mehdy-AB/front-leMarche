import { OtpSchema, otpSchema, UserDto, userDtoSchema } from "@/app/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import email from "next-auth/providers/email";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const UserInfo=({etape,setEtape,compteType,token}:{
  etape:number,
  compteType:"INDIVIDUAL" | "PROFESSIONAL",
  token:string
  setEtape:React.Dispatch<React.SetStateAction<number>>
})=>{
  const {
      control,
      handleSubmit,
      register,
      reset,
      getValues,
      formState: { errors,isSubmitting },
    } = useForm<UserDto>({
      resolver: zodResolver(userDtoSchema),
      defaultValues: {
        token:token,
        userType:compteType
      },
    })

    useEffect(()=>{
      // if(errors.token)
      //   setEtape(1)
      // if(errors.userType)
      //   setEtape(2)
    },[errors])

    const onSubmit = (data:UserDto) => {
      setEtape(etape + 1)
    }

    return(<>
    <form className="flex flex-col w-full " onSubmit={handleSubmit(onSubmit)}>
        <span className="text-lg font-semibold text-center mt-10 mb-5 ">compte information</span>
        <div className="grid text-xs grid-cols-2 gap-x-4 gap-y-2">
        <label className="font-bold text-gray-500">FullName</label>
        <label className="font-bold text-gray-500">UserName</label>
        <input {...register('fullName')} type="text" placeholder="Enter your fullName" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        
        <input {...register('username')} type="text"  placeholder="Enter your userName" className=" rounded-lg border border-gray-300 h-8 px-4 outline-none focus:border-gray-500"/>
        <span>{errors.fullName && (
          <span className="text-xs text-red-500 mt-1">{errors.fullName.message}</span>
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