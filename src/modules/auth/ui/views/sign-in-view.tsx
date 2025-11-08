"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRightIcon,
  BotIcon,
  LockIcon,
  MailIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const heroHighlights = [
  {
    icon: SparklesIcon,
    label: "Adaptive AI interview partner",
  },
  {
    icon: BotIcon,
    label: "Scenario intelligence that evolves",
  },
  {
    icon: ArrowRightIcon,
    label: "Insights delivered before you join",
  },
];

const marqueeCompanies = [
  "Stripe",
  "Atlassian",
  "Snowflake",
  "Figma",
  "Notion",
  "Datadog",
];

const socialProviders = [
  {
    name: "Google",
    icon: "/icons/google.svg",
  },
  {
    name: "GitHub",
    icon: "/icons/github.svg",
  },
  {
    name: "Microsoft",
    icon: "/icons/microsoft.svg",
  },
];

export const SignInView = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const hasErrors = useMemo(() => {
    return Object.keys(form.formState.errors).length > 0;
  }, [form.formState.errors]);

  const onSubmit = (values: FormValues) => {
    console.debug("sign-in submit", values);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(209,250,229,0.65),_rgba(255,255,255,0.95)),radial-gradient(circle_at_bottom,_rgba(236,253,245,0.85),_rgba(255,255,255,0.95))] px-4 py-10 text-slate-900 md:px-8">
      <div className="absolute inset-0 -z-10 opacity-80" style={{ backgroundImage: "radial-gradient(600px at 20% 0%, rgba(52,211,153,0.18), transparent 60%), radial-gradient(600px at 80% 100%, rgba(16,185,129,0.14), transparent 55%)" }} />
      <Card className="w-full max-w-5xl border-none bg-transparent shadow-none">
        <CardContent className="grid overflow-hidden rounded-4xl bg-white/80 p-0 text-slate-900 shadow-[0_45px_120px_-60px_rgba(15,118,110,0.45)] ring-1 ring-emerald-100 backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative flex flex-col justify-between gap-10 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.85),rgba(52,211,153,0.75)),radial-gradient(circle_at_90%_80%,rgba(74,222,128,0.6),rgba(21,128,61,0.75))] p-10 text-emerald-50">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(187,247,208,0.4),transparent_55%),radial-gradient(circle_at_90%_15%,rgba(34,197,94,0.35),transparent_60%)]" />
            <div className="relative z-10 flex items-center justify-between text-sm uppercase tracking-[0.35em] text-emerald-100/80">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100/40 bg-emerald-100/10">
                  <Image src="/logo.svg" alt="Intervw" width={26} height={26} />
                </span>
                intervw.ai
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-emerald-100/40 bg-emerald-100/5 px-3 py-1 text-xs tracking-[0.2em] md:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Live beta
              </div>
            </div>

            <div className="relative z-10 space-y-6">
              <div className="space-y-5">
                <h1 className="text-4xl font-semibold leading-tight text-white md:text-[2.75rem]">
                  Glide into interviews with an AI studio that choreographs your story.
                </h1>
                <p className="max-w-sm text-base text-emerald-50/90">
                  Spin up realistic scenarios, rehearse with cinematic video prompts, and surface the talking points that matter most.
                </p>
              </div>

              <ul className="grid gap-3 text-sm text-emerald-100/90 sm:grid-cols-2">
                {heroHighlights.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-emerald-100/20 bg-emerald-100/10 px-4 py-3 backdrop-blur-sm"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100/15 text-emerald-100">
                      <Icon className="h-4 w-4" />
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 flex flex-col gap-5 rounded-3xl border border-emerald-100/25 bg-emerald-950/20 p-5 text-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100/15 text-emerald-100">
                  <UsersIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">2,000+ mock interviews weekly</p>
                  <p className="text-emerald-100/70">Trusted by candidates from product, design, and engineering teams worldwide.</p>
                </div>
              </div>
              <div className="relative">
                <p className="mb-3 text-xs uppercase tracking-[0.35em] text-emerald-100/70">Trusted by teams at</p>
                <div className="overflow-hidden">
                  <div className="marquee flex min-w-full gap-6">
                    {[...marqueeCompanies, ...marqueeCompanies].map((company, index) => (
                      <span
                        key={`${company}-${index}`}
                        className="flex-shrink-0 rounded-full bg-white/15 px-5 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white/80"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-between bg-white/85 p-8">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-8">
                <header className="space-y-3 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-emerald-500/80">Welcome back</p>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-slate-900">Sign in to continue your prep flow</h2>
                    <p className="text-sm text-slate-600">
                      Jump into your latest AI-guided interview session with saved notes and analytics.
                    </p>
                  </div>
                </header>

                {hasErrors && (
                  <Alert variant="destructive" className="border-none bg-rose-500/10 text-rose-600">
                    <AlertTitle className="font-semibold">We couldn&apos;t sign you in</AlertTitle>
                    <AlertDescription>Please double-check the highlighted fields and try again.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MailIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="you@company.com"
                              className="h-12 rounded-full border border-emerald-100/80 bg-white/90 pl-11 text-base text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-500/30"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium text-slate-700">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <LockIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              type="password"
                              autoComplete="current-password"
                              placeholder="••••••••"
                              className="h-12 rounded-full border border-emerald-100/80 bg-white/90 pl-11 text-base text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-400 focus-visible:ring-emerald-500/30"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <div className="flex justify-end text-xs text-slate-400">
                          <Link href="/forgot-password" className="transition hover:text-emerald-300">
                            Forgot password?
                          </Link>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="group h-12 w-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-base font-semibold text-emerald-950 shadow-[0_25px_55px_-25px_rgba(16,185,129,0.6)] transition focus-visible:ring-emerald-500"
                >
                  Continue
                  <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="relative text-center text-xs uppercase tracking-[0.45em] text-slate-400">
                  <span className="relative z-10 bg-white/85 px-4">Or continue with</span>
                  <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {socialProviders.map((provider) => (
                    <Button
                      key={provider.name}
                      type="button"
                      variant="outline"
                      className="h-12 rounded-full border border-emerald-100 bg-white/90 text-slate-500 transition hover:border-emerald-400/80 hover:text-slate-900"
                    >
                      <Image src={provider.icon} alt={provider.name} width={20} height={20} />
                    </Button>
                  ))}
                </div>

                <footer className="mt-auto space-y-3 text-center text-sm text-slate-500">
                  <p>
                    New to Intervw?{" "}
                    <Link href="/sign-up" className="font-medium text-emerald-500 transition hover:text-emerald-400">
                      Create an account
                    </Link>
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    By continuing you agree to our{" "}
                    <Link href="#" className="underline decoration-dotted underline-offset-4">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="underline decoration-dotted underline-offset-4">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </footer>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        .marquee {
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};
