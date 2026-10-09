import Image from "next/image";
import Link from "next/link";
import { media, site } from "@/lib/content";
import { getAllPosts } from "@/lib/posts";
import { MapPinIcon } from "../icons";
import { ButtonLink, Container } from "../ui";
import { MobileNav } from "./MobileNav";
import { getNavLinks } from "./nav";

export function Header() {
  const links = getNavLinks(getAllPosts().length > 0);

  return (
    <header className="header-scroll sticky top-0 z-40 border-b border-line/80 bg-white/85 backdrop-blur-md">
      <div aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-plum-600 via-blush-400 to-plum-600" />
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
        <Link href="/" className="shrink-0" aria-label="MesoNutrilift ana sayfa">
          <Image src={media.logo.src} alt={media.logo.alt} width={media.logo.width} height={media.logo.height} className="h-9 w-auto lg:h-10" loading="eager" unoptimized />
        </Link>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="rounded-full px-3 py-2 text-[0.9375rem] font-medium text-ink/80 transition-colors hover:bg-plum-50 hover:text-plum-800">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/klinikler/" size="sm" className="shine sm:h-10 sm:px-5">
            <MapPinIcon className="size-4" />
            Klinik bul
          </ButtonLink>
          <MobileNav links={links} phone={site.contact.phones[1] ?? site.contact.phones[0]} />
        </div>
      </Container>
    </header>
  );
}
