'use client'

import { TEMPLATE_CATEGORIES } from "@/Utils";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import MobileNavItem from "./MobileNavItem";


const MobileNavItems = () => {
    const [activeIndex, setActiveIndex] = useState<null | number>(null);

    useEffect(() => {
        const handler = (e:KeyboardEvent) => {
            if(e.key === "Escape") {
                setActiveIndex(null);
            }
        }
    
        document.addEventListener("keydown", handler)
    
        return () => {
            document.removeEventListener("keydown", handler)
        }
      }, [])

    const isAnyOpen = activeIndex  !== null

    const  navRef = useRef <HTMLDivElement | null> (null)
  
    useOnClickOutside(navRef, () => setActiveIndex(null))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 h-full" ref={navRef}>
        {
        TEMPLATE_CATEGORIES.map((category, i) => {


            const handleOpen = () => {
                if(activeIndex === i ) {
                    setActiveIndex(null);
                } else {
                    setActiveIndex(i);
                }
            }

            const isOpen = i === activeIndex;

            return (
                <MobileNavItem 
                category={category}
                 handleOpen={handleOpen}
                 isOpen={isOpen}
                 key={category.value} 
                 isAnyOpen={isAnyOpen} />
            )
        })}
    </div>
  )
}

export default MobileNavItems
