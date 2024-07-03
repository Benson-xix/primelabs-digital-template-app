import { LucideProps } from "lucide-react";
import Image from "next/image";

export const Icons = {
  logo: (props: LucideProps) => (
    <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      <Image src="/QODEBYTE.png" alt="logo" width={100} height={100} priority />
    </div>
  ),
};
