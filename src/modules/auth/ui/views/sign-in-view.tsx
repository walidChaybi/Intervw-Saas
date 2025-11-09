"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Github,
  Chrome,
  Loader2,
  Video,
  Brain,
  TrendingUp,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

export const SignInView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: () => {
          setError("Invalid email or password. Please try again.");
          setIsLoading(false);
        },
      }
    );
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      setError(`Failed to sign in with ${provider}. Please try again.`);
      setIsLoading(false);
    }
  };

  const companies = [
    { name: "Amazon", logo: "/cc-amazon.svg" },
    { name: "Apple", logo: "/apple-seeklogo.svg" },
    { name: "Tesla", logo: "/tesla.svg" },
    { name: "Datadog", logo: "/datadog-seeklogo.svg" },
    { name: "Facebook", logo: "/facebook.svg" },
    { name: "IBM", logo: "/ibm.svg" },
    { name: "Samsung", logo: "/samsung.svg" },
    { name: "SAP", logo: "/sap.svg" },
    { name: "HootSuite", logo: "/hootsuite.svg" },
    { name: "Leetcode", logo: "/leetcode.svg" },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 relative z-10">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center h-full">
          {/* Left Side - Branding & Features */}
          <div className="hidden md:flex flex-col gap-6 p-12 h-full overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/ai_interview_prepare.webp"
                  alt="intervw logo"
                  className="h-12 w-auto object-contain"
                />
              </div>

              <h1 className="text-2xl font-extrabold leading-tight">
                Master your interview skills with{" "}
                <span className="bg-linear-to-r from-lime-400 via-emerald-400 to-teal-400 inline-block">
                  AI-powered
                </span>{" "}
                practice sessions
              </h1>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <div className="p-4 bg-linear-to-br from-green-500 to-green-600 rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    AI-Powered Feedback
                  </h3>
                  <p className="text-sm text-slate-700">
                    Get real-time analysis and personalized recommendations
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="p-4 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    Realistic Practice Sessions
                  </h3>
                  <p className="text-sm text-slate-700">
                    Experience authentic interview scenarios with video calls
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="p-4 bg-linear-to-br from-teal-500 to-teal-600 rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    Track Your Progress
                  </h3>
                  <p className="text-sm text-slate-700">
                    Monitor your improvement over time with detailed analytics
                  </p>
                </div>
              </div>
            </div>

            <div className=" bg-white/80 backdrop-blur-md rounded-3xl border-2 border-green-200/50 shadow-2xl overflow-hidden hover:shadow-green-300/50 transition-all duration-300">
              {/* GIF Demo */}
              <div className="relative h-56 bg-linear-to-br from-green-100 via-emerald-100 to-teal-100 overflow-hidden rounded-t-3xl">
                <img
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTY3dDMzbHh4d3RuazJ4aG8weThqdXhiYTc0c2Jqd2ZzamN0ZWV6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UFmCKrzMqgXLUsL2Fr/giphy.gif"
                  alt="AI Interview Demo - Fun animated interview preparation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-white/60 via-transparent to-transparent"></div>
              </div>

              {/* Stats below GIF */}
              <div className="p-6 bg-linear-to-br from-white to-green-50/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-green-600 border-2 border-white shadow-lg" />
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 border-2 border-white shadow-lg" />
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-teal-400 to-teal-600 border-2 border-white shadow-lg" />
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Join{" "}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">
                      10,000+
                    </span>{" "}
                    candidates
                  </div>
                </div>
                <p className="text-sm text-slate-700 font-medium">
                  who have landed their dream jobs with our AI interview
                  preparation
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md">
            <CardContent className="p-8 md:p-12">
              <div className="mb-8">
                <div className="lg:hidden flex items-center gap-3 mb-6">
                  <img
                    src="/ai_interview_prepare.webp"
                    alt="intervw logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
                <h1 className="text-4xl font-extrabold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Welcome back
                </h1>
                <p className="text-slate-700 font-medium">
                  Sign in to continue your interview preparation
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {error && (
                    <Alert
                      variant="destructive"
                      className="border-red-200 bg-red-50"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="pl-10 h-11 border-slate-200 focus-visible:ring-blue-600"
                              disabled={isLoading}
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
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-slate-700 font-medium">
                            Password
                          </FormLabel>
                          <Link
                            href="/forgot-password"
                            className="text-sm bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hover:from-green-700 hover:to-emerald-700 font-bold transition-all"
                          >
                            Forgot?
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-blue-600"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              tabIndex={-1}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal cursor-pointer text-slate-700">
                            Remember me for 30 days
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-11 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in to your account"
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-2 border-green-200 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleSocialSignIn("google")}
                      disabled={isLoading}
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleSocialSignIn("github")}
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-slate-600">
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/sign-up"
                        className="font-bold bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Company Logos Marquee Section */}
      <div className="border-t-2 border-green-200/50 shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-sm font-medium text-slate-700 mb-3">
            Candidates prepared with us joined these companies
          </p>
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
              {companies.map((company, idx) => (
                <div
                  key={`${company.name}-${idx}`}
                  className="h-14 px-6 mx-4 rounded-lg flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {companies.map((company, idx) => (
                <div
                  key={`${company.name}-dup-${idx}`}
                  className="h-14 px-6 mx-4 rounded-lg flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs text-slate-600 mt-3 border-t border-green-200/30 pt-3">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-700">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-slate-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
