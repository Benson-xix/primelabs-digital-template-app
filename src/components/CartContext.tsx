"use client";

import {  createContext, useContext, useState } from "react";


type CartContextType = {
    hasDeveloper: boolean;
    setHasDeveloper: React.Dispatch<React.SetStateAction<boolean>>;
    customizeTemplate: boolean;
    setCustomizeTemplate: React.Dispatch<React.SetStateAction<boolean>>;
    hostingTemplate: boolean;
    setHostingTemplate: React.Dispatch<React.SetStateAction<boolean>>;
  };

  const CartContext = createContext<CartContextType>({
    hasDeveloper: false,
    setHasDeveloper: () => {},
    customizeTemplate: false,
    setCustomizeTemplate: () => {},
    hostingTemplate: false,
    setHostingTemplate: () => {},
  });

export const CartProvider = ({ children }: React.PropsWithChildren) => {
  const [hasDeveloper, setHasDeveloper] = useState(false);
  const [customizeTemplate, setCustomizeTemplate] = useState(false);
  const [hostingTemplate, setHostingTemplate] = useState(false);

  return (
    <CartContext.Provider
      value={{
        hasDeveloper,
        setHasDeveloper,
        customizeTemplate,
        setCustomizeTemplate,
        hostingTemplate,
        setHostingTemplate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
