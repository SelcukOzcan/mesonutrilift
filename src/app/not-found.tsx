import { ButtonLink, Container } from "@/components/ui";
import { MapPinIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-32 size-[34rem] rounded-full bg-plum-300/45 blur-3xl motion-safe:animate-aurora" />
        <div className="absolute -bottom-48 -left-32 size-[28rem] rounded-full bg-blush-300/50 blur-3xl motion-safe:animate-aurora-slow" />
        <div className="grain absolute inset-0" />
      </div>
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-shimmer text-[7rem] leading-none font-extrabold tracking-tighter sm:text-[10rem]">404</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-plum-900 sm:text-5xl">Aradığınız sayfa bulunamadı</h1>
        <p className="mt-4 max-w-md text-lg text-muted">Sayfa taşınmış ya da kaldırılmış olabilir.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/klinikler/" size="lg" className="shine">
            <MapPinIcon className="size-5" />
            Klinik bul
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Ana sayfaya dön
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
