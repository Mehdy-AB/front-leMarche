"use client"
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { SendCodeDto, sendCodeDtoSchema } from "@/lib/validation/all.schema";
import axiosGhost from "@/lib/req/axiosGhost";

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors,isSubmitting },
  } = useForm<SendCodeDto>({resolver:zodResolver(sendCodeDtoSchema)})

  const route = useRouter();
  const onSubmit = async (data: SendCodeDto) => {
    axiosGhost.post('/auth/register/forget-password',data).then(res=>{
      if(res.data.error){
        setError('email', { message: res.data.message })
        return;
      }
    }).catch(e=>{
      setError('email', { message: e.response.data.error || 'Email is invalide' })
    })
  }

  return (<>
    <section className=" flex w-full text-gray-600 h-screen justify-center pt-[8%]">
      <div className="flex flex-col w-[40rem] items-center">
      <h1 className="text-4xl font-semibold text-gray-700">Mot de passe oublié</h1>
      <h4 className="text-sm text-gray-500">Already have an account? 
        <a className="underline cursor-pointer" onClick={()=>{route.push('/api/auth/signin')}}>Signin</a>
      </h4>
        

      <div className="flex flex-col w-full">
      <div className="relative w-full h-[32rem] overflow-hidden" >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full h-full flex  flex-col gap-1"
          >
            <form className="flex flex-col gap-y-2 w-full" onSubmit={handleSubmit(onSubmit)}>
                <span className="mt-10 font-semibold">Waht's your email</span>
                <input
                    type="text"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className="rounded-lg border border-gray-300 h-12 px-4 outline-none focus:border-gray-500"
                />
                {errors.email && (
                    <span className="text-red-500 text-xs">
                    {errors.email.message}
                    </span>
                )}
              
                <button type="submit" className="bg-orange-400 rounded-4xl py-3 rounded-full mt-6 font-semibold text-white">Sign in</button>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>  
      </div>
      </div>
      </section>
    </>
  );
};

export default SignupPage;
