import Link from "next/link";
import { CheckCircle2Icon, ClockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export const CallEnded = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="flex flex-col items-center justify-center gap-8 px-6 py-12">
        {/* Icon Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-full p-6 shadow-2xl">
            <CheckCircle2Icon
              className="size-16 text-green-400"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="flex flex-col items-center gap-6 backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl p-10 shadow-2xl max-w-md w-full">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-2xl font-semibold text-white">Call Ended</h2>
            <p className="text-sm text-white/70 leading-relaxed">
              You have successfully ended the interview call.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
            <ClockIcon className="size-4 text-white/60" />
            <span className="text-xs text-white/70">
              Summary will appear in a few minutes
            </span>
          </div>

          {/* Action Button */}
          <Button
            asChild
            size="lg"
            className="w-full bg-white text-black hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Link href="/interviews">Back to Interviews</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
