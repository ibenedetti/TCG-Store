import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page({ params }) {
  const { uid } = await params; // Add this line
  const client = createClient();
  const page = await client.getByUID("gamepage", uid).catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("gamepage");

  return pages.map((page) => {
    return { uid: page.uid };
  });
}