"use client";

import { usePathname } from "next/navigation";
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import Link from "next/link";

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in"];

  return (
    <footer className="bg-blue-950 text-gray-100 flex-grow-0">
      <MaxWidthWrapper>
        <div className="border-t border-gray-200">
          {pathsToMinimize.includes(pathname) ? null : (
            <div className="pb-8 pt-16">
              <div className="flex justify-center">
                <Icons.logo className="h-12 w-auto mb-2" />
              </div>
            </div>
          )}

          {pathsToMinimize.includes(pathname) ? null : (
            <div>
              <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div
                    aria-hidden="true"
                    className="absolute bg-blue-950 inset-0 bg-gradient-to-br bg-opacity-90"
                  />
                </div>

                <div className="text-center relative mx-auto max-w-sm">
                  <h3 className="font-semibold text-gray-100">
                    Achieve your web developement dreams with us
                  </h3>
                  <p className="mt-2 text-sm text-gray-100 text-muted-foreground">
                    here at primelabs you can get your dream web apps from us,
                    templates that are easily customizable and will be delivered
                    immediately to you in your email and your user libary
                    <Link
                      href="/sign-up"
                      className="whitespace-nowrap font-medium text-gray-100 pl-2 hover:text-zinc-100"
                    >
                      Get started with us &rarr;
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className='py-10 md:flex md:items-center text-gray-100 md:justify-between'>
          <div className='text-center md:text-left'>
            <p className='text-sm text-gray-100 text-muted-foreground'>
              &copy; {new Date().getFullYear()} All Rights
              Reserved
            </p>
          </div>

          <div className='mt-4 flex items-center text-gray-100 justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <Link
                href='#'
                className='text-sm text-muted-foreground text-gray-100 hover:text-gray-400'>
                Terms
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground text-gray-100 hover:text-gray-400'>
                Privacy Policy
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground text-gray-100 hover:text-gray-400'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
