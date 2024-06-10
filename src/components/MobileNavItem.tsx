"use client";

import React from "react";
import { Button } from "./ui/button";
import { TEMPLATE_CATEGORIES } from "@/Utils";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type Category = (typeof TEMPLATE_CATEGORIES)[number];

interface MobileNavItemProps {
    category: Category;
    handleOpen: () => void;
    isOpen: boolean;
    isAnyOpen: boolean;
  }

const MobileNavItem: React.FC<MobileNavItemProps> = ({
    isAnyOpen,
    category,
    handleOpen,
    isOpen,
  }) => {
  return (
    <div className="flex  max-lg:w-full">
        <div className="relative flex items-center w-full">
        <Button
          className="gap-1/5 w-full "
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "outline"}
        >
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
        </div>

        {isOpen ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full text-sm text-muted-foreground",
            { "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen }
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />
          <div className="relative">
            <div className=" max-w-7xl md:px-5 px-3 ">
              <div className="grid grid-cols-4 gap-x-3 gap-y-5 py-16 bg-gray-100">
                <div className="col-span-4 col-start-1 grid grid-cols-2 gap-x-8 ">
                  {category.featured.map((item) => (
                    <div
                      key={item.name}
                      className="group relative text-base sm:text-sm"
                    >
                      <div className="relative aspect-video overflow-hidden w-[80%] rounded-lg bg-gray-100 group-hover:opeacity-75">
                       <Image src={item.imageSrc} alt='template  category image'
                       fill
                       className="object-cover object-center"
                       />
                      </div>

                      <Link
                        href={item.href}
                        className="mt-6 block font-medium text-gray-900"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 " aria-hidden="true">
                        {" "}
                        Purchase Your Template
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MobileNavItem
