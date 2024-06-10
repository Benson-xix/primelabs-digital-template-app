"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { useCartContext } from "./CartContext";

const Cart = () => {
  const { items } = useCart();
  const itemCount = items.length;
  const {
    hasDeveloper,
    setHasDeveloper,
    customizeTemplate,
    setCustomizeTemplate,
    hostingTemplate,
    setHostingTemplate,
  } = useCartContext();
 

  const [isMounted, setIsMounted] = useState<boolean>(false);
 

  useEffect(() => {
    const storedHasDeveloper = localStorage.getItem("hasDeveloper");
    if (storedHasDeveloper !== null) {
      setHasDeveloper(JSON.parse(storedHasDeveloper));
    }
  
    const storedCustomizeTemplate = localStorage.getItem("customizeTemplate");
    if (storedCustomizeTemplate !== null) {
      setCustomizeTemplate(JSON.parse(storedCustomizeTemplate));
    }
  
    const storedHostingTemplate = localStorage.getItem("hostingTemplate");
    if (storedHostingTemplate !== null) {
      setHostingTemplate(JSON.parse(storedHostingTemplate));
    }
  
    setIsMounted(true);
  }, [setCustomizeTemplate, setHasDeveloper, setHostingTemplate]);

  
  useEffect(() => {
    localStorage.setItem("hasDeveloper", JSON.stringify(hasDeveloper));
  }, [hasDeveloper]);

  useEffect(() => {
    localStorage.setItem("customizeTemplate", JSON.stringify(customizeTemplate));
  }, [customizeTemplate]);

  useEffect(() => {
    localStorage.setItem("hostingTemplate", JSON.stringify(hostingTemplate));
  }, [hostingTemplate]);

  const totalCost = items.reduce(
    (total, { product }) => total + product.price,
    0
  );


  const fee = 1;

  const cartTotal = totalCost + fee +
    (customizeTemplate ? 30 : 0) +
    (hostingTemplate ? 10 : 0);

  const handleHasDeveloperChange = () => {
    console.log('Has Developer checkbox clicked');
    setHasDeveloper(!hasDeveloper);
    if (!hasDeveloper) {
      setCustomizeTemplate(false);
      setHostingTemplate(false);
    }
  };

  const handleCustomizeTemplateChange = () => {
    console.log('Customize Template checkbox clicked');
    setCustomizeTemplate(!customizeTemplate);
  };

  const handleHostingTemplateChange = () => {
    console.log('Hosting Template checkbox clicked');
    setHostingTemplate(!hostingTemplate);
  };


  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-blue-900 group-hover:text-blue-950"
        />
        <span className="ml-2 text-sm font-medium text-blue-700 group-hover-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
        <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem product={product} key={product.id} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>digital templates do not require shipping</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <div className="flex flex-1 gap-3">
                    <Checkbox
                      id="hasDeveloper"
                      checked={hasDeveloper}
                      onCheckedChange={handleHasDeveloperChange}
                    />
                    <label
                      htmlFor="hasDeveloper"
                      className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Do You Already have a Hired Dev?
                    </label>
                  </div>
                </div>
                {!hasDeveloper && (
                  <>
                    <div className="flex">
                      <div className="flex flex-1 gap-3">
                        <Checkbox
                          id="customizeTemplate"
                          checked={customizeTemplate}
                          onCheckedChange={handleCustomizeTemplateChange}
                        />
                        <label
                          htmlFor="customizeTemplate"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Assist You in Customizing Your Web Template
                        </label>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex flex-1 gap-3">
                        <Checkbox
                          id="hostingTemplate"
                          checked={hostingTemplate}
                          onCheckedChange={handleHostingTemplateChange}
                        />
                        <label
                          htmlFor="hostingTemplate"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Assist You in Hosting your Template
                        </label>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex">
                  <span className="flex-1">Total</span> 
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
            <SheetFooter>
              <SheetTrigger asChild>
                <Link
                  href="/cart"
                  className={buttonVariants({
                    className: "w-full",
                  })}
                >
                  Continue to CheckOut
                </Link>
              </SheetTrigger>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image src="/empty-cart.png" fill alt="empty cart " />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Add Templates To Your Cart
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;


