import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MaxWidthWrapperProps {
    children: ReactNode,
    className?: string
}

const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({className, children}) => {
  return <div className={cn("lg:mx-auto mx-2 max-w-[1920px]  xl:px-20 md:px-2 px-4", className)}>
    {children}
  </div>;
};

export default MaxWidthWrapper;
