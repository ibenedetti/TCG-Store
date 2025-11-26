'use client'
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { asText } from "@prismicio/client";
import clsx from "clsx";

/**
 * @typedef {import("@prismicio/client").Content.GameProductsSlice} GameProductsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<GameProductsSlice>} GameProductsProps
 * @type {import("react").FC<GameProductsProps>}
 */
const GameProducts = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="px-4 py-12 pb-12 bg-[linear-gradient(180deg,#000_0%,#000_50%,#eee_100%)]"
    >

      <h2 className="font-bold-slanted mb-8 scroll-pt-6 text-6xl uppercase md:text-5xl text-center text-white text-pretty mt-4">
        {slice.primary.producttitle}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 max-w-7xl mx-auto">
        {slice.primary.productdisplay.map((item, index) => (
          <ProductBentoItem key={index} item={item} />
        ))}
      </div>
    </section>
  );
};


export default GameProducts;

function ProductBentoItem({ item }) {
  console.log("LINK RAW:", item.productlink);
console.log("URL:", item.productlink?.url);


  const sizeValue = item.size && typeof item.size === 'string' ? item.size.toLowerCase() : '';
  
  return (
    <PrismicNextLink
      field={item.productlink}
      className={clsx(
        "relative overflow-hidden rounded-3xl group cursor-pointer block",
        sizeValue === "small" && "md:col-span-2",
        sizeValue === "medium" && "md:col-span-3",
        sizeValue === "large" && "md:col-span-4",       
        !sizeValue && "md:col-span-3"
      )}
    >
      <div className="block h-full">
        <PrismicNextImage
          field={item.productimg}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          quality={96}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-balance text-white">
          <PrismicRichText field={item.description} />
        </div>
      </div>
    </PrismicNextLink>
  );
}