"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { TEMPLATE_CATEGORIES } from "@/Utils";
import ImageSlider from "./ImageSlider";
import { trpc } from "@/trpc/client";
import Image from "next/image";

interface ProductListingProps {
  product: Product | null;
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const fileId =
    typeof product?.product_files === "string" ? product.product_files : "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  if (!product || !isVisible) return <ProductPlaceholder />;

  const label = TEMPLATE_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[];

  if (isVisible && product) {
    return (
      <div
        className={cn("invisible h-full w-full group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <div className="flex flex-col w-full">
          <ImageSlider urls={validUrls} />

          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product.price)}
          </p>
          <Link
            className={cn(
              "invisible cursor-pointer group/main bg-blue-500 mt-2 text-white md:w-1/3 w-1/2 rounded-lg py-2 lg:px-3 px-1 ",
              {
                "visible animate-in fade-in-5": isVisible,
              }
            )}
            href={`/product/${product.id}`}
          >
            Details
          </Link>

          <Link
            href=""
            className="bg-black mt-2 cursor-pointer  text-white md:w-1/3 w-1/2 rounded-lg py-2 lg:px-3 px-1  "
          >
            preview
          </Link>
        </div>
      </div>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-zinc-100 aspect-square w-full overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
