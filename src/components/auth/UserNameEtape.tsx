import axiosGhost from "@/lib/req/axiosGhost";
import { usernameSchemaObject } from "@/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const UserNameEtape=({etape,setEtape,setUserName}:{
    etape:number,
    setEtape:React.Dispatch<React.SetStateAction<number>>
    setUserName:React.Dispatch<React.SetStateAction<string>>
})=>{
    const {
      register,
      handleSubmit,
      setError,
      formState: { errors,isSubmitting },
    } = useForm<{username:string}>({resolver:zodResolver(usernameSchemaObject)})

    const onSubmit = (data: {username:string}) => {
      axiosGhost.post('/auth/register/checkUserName',data).then(res=>{
        if(res.data.error){
          setError('username', { message: res.data.message })
          return;
        }
        if(res.data!==true){
          setError('username', { message: 'this userName in use, try anouther' })
        }else{
          setUserName(data.username)
          setEtape(etape + 1)
        }
      }).catch(e=>{
        setError('username', { message: e.response.data.error || 'userName is invalide' })
      })
    }

    return(<>
    <form className="flex flex-col w-full" onSubmit={handleSubmit(onSubmit)}>
    <span className="mt-10 text-lg font-semibold">Waht we should call you ?</span>
    <input
        type="text"
        {...register("username")}
        placeholder="Enter your userName"
        className="rounded-lg border border-gray-300 h-12 px-4 outline-none focus:border-gray-500"
      />
      {errors.username && (
        <span className="text-red-500 text-xs">
          {errors.username.message}
        </span>
      )}
    <button type="submit" className="bg-orange-400 rounded-4xl py-3 rounded-full mt-6 font-semibold text-white">Next</button>
    </form>
        </>);
}

