"use client";

import { useRef, useState, createContext, useContext } from "react";
import Link from "next/link";
import { LuChevronRight, LuMenu, LuX } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Logo } from "./Logo";
import clsx from "clsx";

const DialogContext = createContext([false, () => {}]);

export function Navbar() {
  const button = useRef(null); 
  const state = useState(false);
  const [open, setOpen] = state;

  
  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between p-3 md:p-6">
      <Link
        href="/"
        className="shrink-0 hover:scale-105 motion-safe:transition"
      >
        <Logo className="h-6 w-auto md:h-8" />
      </Link>
      <div className="flex gap-3 md:gap-4">
       
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex size-12 cursor-pointer items-center justify-center rounded bg-gray-300 hover:bg-gray-300/80 hover:shadow-lg hover:shadow-black/10 motion-safe:transition">
            <LuMenu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
            <DialogContent className="motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=closed]:slide-out-to-right motion-safe:data-[state=open]:slide-in-from-right fixed inset-y-0 right-0 z-50 h-full w-3/4 bg-black p-4 shadow-lg ease-in-out motion-safe:transition motion-safe:data-[state=closed]:duration-300 motion-safe:data-[state=open]:duration-500 sm:max-w-sm">
              <DialogTitle className="sr-only" />
              <DialogDescription className="sr-only" />
              <DialogClose className="ml-auto flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:text-black motion-safe:transition">
                <LuX className="size-5" />
                <span className="sr-only">Close menu</span>
              </DialogClose>
              <DialogContext.Provider value={state}>
                <nav>
                  <ul>
                    <NavbarLink
                      href="/mtg-page"
                      title="Magic"
                      description="Magic: The Gathering"
                    />
                    <NavbarLink
                      href="/pokemon-page"
                      title="Pokemon"
                      description="Pokémon TCG"
                    />
                    <NavbarLink
                      href="/lorcana-page"
                      title="Lorcana"
                      description="Lorcana"
                    />
                    <NavbarLink
                      href="/yugioh-page"
                      title="yugioh"
                      description="Yu-Gi-Oh!"
                    />
                  </ul>
                </nav>
              </DialogContext.Provider>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      </div>
    </header>
  );
}

function NavbarLink({ href, title, description }) {
  const [, setOpen] = useContext(DialogContext); 

  return (
    <li>
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className="group flex items-center rounded-xl p-4 hover:bg-[#002555]/50 motion-safe:transition"
      >
        <div className="flex grow flex-col gap-1">
          <span className="text-xl font-semibold text-white group-hover:text-[#9e972d] motion-safe:transition">
            {title}
          </span>
          <span className="text-sm text-white">{description}</span>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-[#1F3F69] text-gray-400 group-hover:bg-[#9e972d] group-hover:text-white motion-safe:transition">
          <LuChevronRight className="size-5 translate-x-px" />
        </div>
      </Link>
    </li>
  );
}