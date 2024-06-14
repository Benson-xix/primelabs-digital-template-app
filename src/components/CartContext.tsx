"use client";

import {  createContext, useContext, useState } from "react";


type CartContextType = {
    hasDeveloper: boolean;
    setHasDeveloper: React.Dispatch<React.SetStateAction<boolean>>;
    customizeTemplate: boolean;
    setCustomizeTemplate: React.Dispatch<React.SetStateAction<boolean>>;
    hostingTemplate: boolean;
    setHostingTemplate: React.Dispatch<React.SetStateAction<boolean>>;
    isCartOpen: boolean;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };

  const CartContext = createContext<CartContextType>({
    hasDeveloper: false,
    setHasDeveloper: () => {},
    customizeTemplate: false,
    setCustomizeTemplate: () => {},
    hostingTemplate: false,
    setHostingTemplate: () => {},
    isCartOpen: false,
  setIsCartOpen: () => {},
  });

export const CartProvider = ({ children }: React.PropsWithChildren) => {
  const [hasDeveloper, setHasDeveloper] = useState(false);
  const [customizeTemplate, setCustomizeTemplate] = useState(false);
  const [hostingTemplate, setHostingTemplate] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartContext.Provider
      value={{
        hasDeveloper,
        setHasDeveloper,
        customizeTemplate,
        setCustomizeTemplate,
        hostingTemplate,
        setHostingTemplate,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
