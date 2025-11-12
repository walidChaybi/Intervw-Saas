import { Bot, Sparkles } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => {
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 h-52 w-52 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-primary/10 bg-linear-to-br from-background via-background/95 to-background/80 px-10 py-12 text-center shadow-[0_40px_90px_-55px_rgba(59,130,246,0.15)] backdrop-blur">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/70">
          <Sparkles className="size-3" />
          Empty State
          <span className="inline-block size-1.5 rounded-full bg-primary/50" />
        </span>

        <div className="mx-auto mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/5 shadow-inner shadow-primary/10">
          {icon || <Bot className="size-9 text-primary/60" strokeWidth={2.2} />}
        </div>

        <div className="mt-8 space-y-3">
          <h6 className="text-balance text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h6>
          <p className="text-balance text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        {action && <div className="mt-10">{action}</div>}

        <div className="mt-10 grid gap-3 text-left text-xs uppercase tracking-[0.28em] text-muted-foreground/70 sm:grid-cols-3 sm:text-center">
          <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 backdrop-blur-sm">
            Get Started
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 backdrop-blur-sm">
            Create New
          </div>
          <div className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 backdrop-blur-sm">
            Explore Features
          </div>
        </div>
      </div>
    </div>
  );
};
