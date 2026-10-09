"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Link as NavLink } from "@/content/types";
import { ArrowRightIcon, CloseIcon, MapPinIcon, MenuIcon, PhoneIcon } from "../icons";
import { buttonClass } from "../ui";

export function MobileNav({ links, phone }: { links: NavLink[]; phone?: { label: string; value: string } }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobil-menu"
        aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
        className="grid size-10 place-items-center rounded-full text-plum-900 transition-colors hover:bg-plum-50"
      >
        {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>

      {open && (
        <div id="mobil-menu" className="fixed inset-x-0 top-16 bottom-0 z-40 isolate flex flex-col overflow-y-auto bg-cream">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-32 -right-24 size-80 rounded-full bg-plum-300/50 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 size-80 rounded-full bg-blush-300/50 blur-3xl" />
          </div>
          <nav aria-label="Mobil menü" className="flex-1 px-6 pt-6">
            <ul>
              {links.map((link, i) => (
                <li key={link.href} className="animate-rise border-b border-plum-100" style={{ animationDelay: `${i * 50}ms` }}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 text-2xl font-bold tracking-tight text-plum-900">
                    {link.label}
                    <ArrowRightIcon className="size-5 text-plum-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="animate-rise space-y-3 px-6 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]" style={{ animationDelay: `${links.length * 50}ms` }}>
            <Link href="/klinikler/" onClick={() => setOpen(false)} className={buttonClass({ size: "lg" }, "shine w-full")}>
              <MapPinIcon className="size-5" />
              Size en yakın kliniği bulun
            </Link>
            {phone && (
              <a href={`tel:${phone.value.replace(/[^\d+]/g, "")}`} className={buttonClass({ variant: "secondary", size: "lg" }, "w-full")}>
                <PhoneIcon className="size-5" />
                {phone.value}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
