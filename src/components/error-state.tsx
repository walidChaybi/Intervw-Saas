import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
}

export const ErrorState = ({ title, description }: ErrorStateProps) => {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-destructive/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-20 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-destructive/20 bg-linear-to-br from-background via-background/95 to-background/80 px-10 py-12 text-center shadow-[0_40px_90px_-55px_rgba(220,38,38,0.5)] backdrop-blur">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-destructive/25 bg-destructive/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-destructive/80">
          Something went wrong
          <span className="inline-block size-1.5 rounded-full bg-destructive/70" />
        </span>

        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 shadow-inner shadow-destructive/30">
          <AlertCircle className="size-9 text-destructive" strokeWidth={2.2} />
        </div>

        <div className="mt-8 space-y-3">
          <h6 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h6>
          <p className="text-balance text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="mt-10 grid gap-3 text-left text-xs uppercase tracking-[0.28em] text-muted-foreground/80 sm:grid-cols-3 sm:text-center">
          <div className="rounded-lg border border-white/10 bg-destructive/10 px-3 py-2 backdrop-blur-sm">
            Refresh the page
          </div>
          <div className="rounded-lg border border-white/10 bg-destructive/10 px-3 py-2 backdrop-blur-sm">
            Check connection
          </div>
          <div className="rounded-lg border border-white/10 bg-destructive/10 px-3 py-2 backdrop-blur-sm">
            Try again later
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-muted-foreground/80">
          <span className="inline-flex size-1.5 rounded-full bg-destructive/60" />
          <p className="uppercase tracking-[0.28em]">We are on it</p>
          <span className="inline-flex size-1.5 rounded-full bg-destructive/60" />
        </div>
      </div>
    </div>
  );
};
