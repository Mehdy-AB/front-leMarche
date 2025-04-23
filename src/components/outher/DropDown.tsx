import { useEffect, useRef } from "react";

interface DropDownProps {
  setIsShow: (value: boolean) => void;
  children: React.ReactNode;
  notEff? :any[]
}

const DropDown = ({ setIsShow, children,notEff }: DropDownProps) => {
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: any) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node) && !notEff?.includes(event.target?.id)) {
        setIsShow(false);
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [setIsShow]);

  return <div className="z-[90]" ref={dropDownRef}>{children}</div>;
};

export default DropDown;
