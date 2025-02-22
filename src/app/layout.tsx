import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/CartContext";
import Footer from "@/components/Footer";
import { constructMetadata } from '../lib/utils';

const inter = Inter({ subsets: ["latin"] })

export const metadata = constructMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          "relative h-full  font-sans antialiased",
          inter.className
        )}
      >
        <main className="relative flex flex-col  max-lg:overflow-x-hidden min-h-screen">
          <Providers>
            {" "}
          
            <CartProvider>
               <NavBar />
            <div>{children}</div>
              <Footer/>
            </CartProvider>
          </Providers>
        </main>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
