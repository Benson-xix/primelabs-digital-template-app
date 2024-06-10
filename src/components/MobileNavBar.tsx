"use client";

import { useEffect, useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import MobileNavItems from "./MobileNavItems";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";
import { Menu, PanelTopClose, XCircle } from "lucide-react";
import { User } from "@/payload-types";
import { usePathname } from "next/navigation";

interface MobileNavBarProps {
  user: User | null;
}



const MobileNavBar: React.FC <MobileNavBarProps>  = ({user}) => {

    


  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileNavClose, setIsMobileNavClose] = useState(false);

  const pathname = usePathname()

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [pathname])

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setIsMobileNavOpen(false)
    }
  }


  const toggleMobileNav = () => {
    if (!isMobileNavOpen) {
      setIsMobileNavClose(true);
    } else {
      setIsMobileNavClose(false);
    }
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  return (
    <>
      <Button
        className="gap-1/5 lg:hidden z-50 block relative"
        variant={isMobileNavClose ? "destructive" : "default"}
        onClick={toggleMobileNav}
      >
        {isMobileNavClose ? <XCircle /> : <Menu />}
      </Button>

      {isMobileNavOpen && (
        <div className="lg:hidden bg-blue-900 px-4 py-4 flex flex-col absolute top-[6.5rem] inset-x-0 left-0 ">
          <MobileNavItems />

          <div className="lg:hidden flex flex-col md:flex-row md:pb-3 pb-3 gap-3 mt-5 items-start justify-start ">
            {user ? null : (
              <Link
              onClick={() => closeOnCurrent('/sign-in')}
                href="/sign-in"
                className={buttonVariants({ variant: "outline" })}
              >
                Sign In
               
              </Link>
            )}

            {user ? null : (
              <span className="h-6 w-px bg-gray-200 " aria-hidden="true" />
            )}

            {user ? (
              <UserAccountNav user={user}  />
            ) : (
              <Link
              onClick={() => closeOnCurrent('/sign-up')}
                href="/sign-up"
                className={buttonVariants({ variant: "outline" })}
              >
                Create An Account
              </Link>
            )}

            {user ? (
              <span className="h-6 w-px bg-gray-200 " aria-hidden="true" />
            ) : null}

            {user ? null : (
              <div className="flex lg:ml-6">
                <span className="h-6 w-px bg-gray-200 " aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavBar;
