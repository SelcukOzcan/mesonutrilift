"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, MapPinIcon } from "../icons";
import { buttonClass, cx } from "../ui";

/** Mobilde hero geçildikten sonra ekranın altında beliren klinik bulma çağrısı; footer görününce çekilir. */
export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let footerInView = false;
    const update = () => setVisible(pastHero && !footerInView);
    const onScroll = () => {
      pastHero = window.scrollY > 560;
      update();
    };
    const footer = document.querySelector("footer");
    const observer = new IntersectionObserver(([entry]) => {
      footerInView = entry.isIntersecting;
      update();
    });
    if (footer) observer.observe(footer);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cx(
        "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <Link href="/klinikler/" tabIndex={visible ? 0 : -1} className={buttonClass({ size: "md" }, "w-full")}>
        <MapPinIcon className="size-4" />
        Size en yakın kliniği bulun
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}
