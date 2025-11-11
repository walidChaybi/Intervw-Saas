import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
}

export const LoadingState = ({ title, description }: LoadingStateProps) => {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-24 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-primary/15 bg-linear-to-br from-background via-background/95 to-background/80 px-10 py-12 text-center shadow-[0_40px_90px_-50px_rgba(37,99,235,0.55)] backdrop-blur">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-primary/80">
          Loading
          <span className="inline-block size-1.5 rounded-full bg-primary/80" />
        </span>

        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10 shadow-inner shadow-primary/30">
          <Loader2
            className="size-8 animate-spin text-primary"
            strokeWidth={2}
          />
        </div>

        <div className="mt-8 space-y-3">
          <h6 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h6>
          <p className="text-balance text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        <div className="mt-10 space-y-3">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
            <span className="absolute inset-y-0 left-0 w-1/2 animate-pulse rounded-full bg-linear-to-r from-primary/80 via-primary to-primary/70" />
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Preparing the experience
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-xs text-muted-foreground/80">
          <span className="inline-flex size-1.5 rounded-full bg-primary/50" />
          <p className="uppercase tracking-[0.28em]">Sit tight, almost there</p>
          <span className="inline-flex size-1.5 rounded-full bg-primary/50" />
        </div>
      </div>
    </div>
  );
};
