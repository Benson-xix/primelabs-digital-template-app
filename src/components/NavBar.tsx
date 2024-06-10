

import React, { useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { Icons } from "./Icons";
import NavItems from "./NavItems";
import {  buttonVariants } from "./ui/button";
import Cart from "./Cart";
import UserAccountNav from "./UserAccountNav";
import MobileNavBar from './MobileNavBar';
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";




const NavBar   =  async  () => {

  const nextCookies = cookies()

 const {user} = await getServerSideUser(nextCookies)
 
  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex flex-col">
              <div className="flex h-16 w-full max-lg:justify-between mt-4 lg:gap-4 items-center">
                <div className="ml-4 flex xl:ml-[6.5rem] lg:ml-[3.5rem]  ">
                  <Link href="/">
                    <Icons.logo className="h-10 w-10" />
                  </Link>
                </div>

                  <div className="ml-4 lg:hidden flex flex-root lg:ml-6">
                    <Cart />
                
                  </div>
                  <MobileNavBar user={user} />
               

                <div className="hidden z-50 lg:ml lg:block lg:self-stretch">
                  <NavItems />
                </div>
              </div>
             
            

              <div className="lg:ml-auto mt-5 lg:mt-0 flex  lg:items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {user ? null : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign In
                    </Link>
                  )}

                  {user ? null : (
                    <span
                      className="h-6 w-px bg-gray-200 "
                      aria-hidden="true"
                    />
                  )}

                  {user ? (
                    <UserAccountNav user={user}  />
                  ) : (
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: "default" })}
                    >
                      Create An Account
                    </Link>
                  )}

                  {user ? (
                    <span
                      className="h-6 w-px bg-gray-200 "
                      aria-hidden="true"
                    />
                  ) : null}

                  {user ? null : (
                    <div className="flex lg:ml-6">
                      <span
                        className="h-6 w-px bg-gray-200 "
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="ml-4 lg:flex hidden flex-root lg:ml-6">
                    <Cart />
                  </div>
                </div>

              
                
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default NavBar;
