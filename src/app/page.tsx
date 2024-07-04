import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Settings } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Instant Deleivery",
    icon: ArrowDownToLine,
    description:
      "Get your templete immediately after download immediately on your profile library in seconds.",
  },
  {
    name: "Guaranteed Quality",
    icon: CheckCircle,
    description:
      " Every template on our platForm is  verified by our team to ensure your highest quality standards  are met.",
  },

  {
    name: " Customizable Settings",
    icon: Settings,
    description:
      " We also offer you the ability to easily customize your templates to suit your needs and requirement",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto flex flex-col text-center items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-light text-gray-900 sm:text-6xl">
            Your Market Place for High Quality And Customizable{" "}
            <span className="text-blue-600">Digital Templates</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Qode Byte's Digital Market Place. Every Template on our
            platform is verified by our team to ensure they are of the highest
            quality standards and that they are easily integrated and
            customizable
          </p>

          <div className="flex flex-col sm:flex-row  gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="default">Our Quality Promise &rarr;</Button>
          </div>
        </div>

        <ProductReel
          query={{
            createdAt: {
              gte: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            },
            sort: "desc",
            limit: 4,
          }}
          href="/latest"
          title="Brand New Templates"
        />
        <ProductReel
          title="Best Selling"
          query={{ sort: "bestselling", limit: 4 }}
          href="/best-selling"
        />
        <ProductReel
          query={{ approvedForSale: true, sort: "desc", limit: 4 }}
          href="/editors-pick"
          title="Editor's Pick"
        />
      </MaxWidthWrapper>

      <section className="border-t border-gray-200  bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3  lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flwx-shrink-0  flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-900">
                    {<perk.icon className="w-1/3 h-1/3" />}
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0  lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
