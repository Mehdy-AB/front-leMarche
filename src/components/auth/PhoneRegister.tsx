import { useRef, useState } from "react";
import Loader from "@/lib/loaders/Loader";
import axiosGhost from "@/lib/req/axiosGhost";
import {
SendCodeDtoPhone,
sendCodeDtoPhoneSchema,
} from "@/lib/validation/all.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const PhoneRegister = ({
setEtape,
setPhone,
}: {
setEtape: React.Dispatch<React.SetStateAction<number>>;
setPhone: React.Dispatch<React.SetStateAction<string>>;
}) => {
const {
handleSubmit,
setError,
setValue,getValues,
formState: { errors, isSubmitting },
} = useForm<SendCodeDtoPhone>({
resolver: zodResolver(sendCodeDtoPhoneSchema),
});

const [segments, setSegments] = useState(["", "", ""]);

const refs = [useRef<HTMLInputElement>(null), useRef(null), useRef(null)];
const updatePhoneValue = (segments: string[]) => {
const phone = `+33${segments.join("")}`;
setValue("phone", phone);
};

const handleChange = (value: string, index: number) => {
const onlyDigits = value.replace(/\D/g, "").slice(0, 3);
const newSegments = [...segments];
newSegments[index] = onlyDigits;
setSegments(newSegments);
updatePhoneValue(newSegments);
if (onlyDigits.length === 3 && index < 2) {
  refs[index + 1]?.current?.focus();
}
}

const handleKeyDown = (
e: React.KeyboardEvent<HTMLInputElement>,
index: number
) => {
if (e.key === "Backspace" && segments[index] === "" && index > 0) {
refs[index - 1]?.current?.focus();
}
};

const onSubmit = () => {
const phone = `+33${segments.join("")}`;
const payload = { phone };

axiosGhost
  .post("/user/auth/send-phone-code", payload)
  .then((res) => {
    if (res.data.error) {
      setError("phone", { message: res.data.message });
      return;
    }
    setPhone(phone);
    setEtape(3);
  })
  .catch((e) => {
    setError("phone", {
      message: e.response?.data?.message || "Numéro invalide",
    });
  });
};

return (
<form className="flex flex-col items-center w-full" onSubmit={handleSubmit(onSubmit)}>
<span className="mt-10 text-lg font-semibold">
Quel est votre numéro de téléphone ?
</span>
  <div className="flex items-center gap-2 mt-4">
    <span className="text-sm px-3 py-2 border border-gray-300 rounded-md bg-gray-200">
      +33
    </span>

    {segments.map((seg, i) => (
      <input
        key={i}
        ref={refs[i]}
        type="text"
        maxLength={3}
        value={seg}
        onChange={(e) => handleChange(e.target.value, i)}
        onKeyDown={(e) => handleKeyDown(e, i)}
        className="w-28 text-center border border-gray-300 rounded-md py-2"
      />
    ))}
  </div>

  {errors.phone && (
    <span className="text-red-500 text-xs mt-1">
      {errors.phone.message}{getValues('phone')}
    </span>
  )}

  <button
    disabled={isSubmitting}
    type="submit"
    className="bg-orange-400 w-full disabled:bg-gray-200 rounded-full py-3 mt-6 font-semibold text-white"
  >
    {isSubmitting ? <Loader /> : "Suivant"}
  </button>
</form>
);
};