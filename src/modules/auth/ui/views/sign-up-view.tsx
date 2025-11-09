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
  User,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const formSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    await authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/sign-in");
        },
        onError: (ctx) => {
          setError(
            ctx.error.message || "Failed to create account. Please try again."
          );
          setIsLoading(false);
        },
      }
    );
  };

  const handleSocialSignUp = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (err) {
      setError(`Failed to sign up with ${provider}. Please try again.`);
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
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 overflow-hidden relative">
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

              <h1 className="text-3xl font-extrabold leading-tight">
                Start your journey to{" "}
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  interview success
                </span>
              </h1>
              <p className="text-lg text-slate-700 leading-relaxed font-medium mt-2">
                Join thousands of candidates who landed their dream jobs with
                AI-powered interview preparation
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start group">
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    Free to Get Started
                  </h3>
                  <p className="text-sm text-slate-700">
                    Create your account in seconds and start practicing
                    immediately
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    AI-Powered Feedback
                  </h3>
                  <p className="text-sm text-slate-700">
                    Get real-time analysis and personalized recommendations to
                    improve
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-lg">
                    Industry-Specific Prep
                  </h3>
                  <p className="text-sm text-slate-700">
                    Practice with questions tailored to your target role and
                    company
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto bg-white/80 backdrop-blur-md rounded-3xl border-2 border-green-200/50 shadow-2xl overflow-hidden hover:shadow-green-300/50 transition-all duration-300">
              {/* GIF Demo */}
              <div className="relative h-56 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 overflow-hidden rounded-t-3xl">
                <img
                  src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTY3dDMzbHh4d3RuazJ4aG8weThqdXhiYTc0c2Jqd2ZzamN0ZWV6MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UFmCKrzMqgXLUsL2Fr/giphy.gif"
                  alt="AI Interview Demo - Fun animated interview preparation"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
              </div>

              {/* Stats below GIF */}
              <div className="p-6 bg-gradient-to-br from-white to-green-50/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow-lg" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white shadow-lg" />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-2 border-white shadow-lg" />
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    Join{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                      10,000+
                    </span>{" "}
                    candidates
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign Up Form */}
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
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Create your account
                </h1>
                <p className="text-slate-700 font-medium">
                  Ace your next interview with our AI-powered interview
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Full name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type="text"
                              placeholder="John Doe"
                              className="pl-10 h-11 border-slate-200 focus-visible:ring-green-600"
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
                              className="pl-10 h-11 border-slate-200 focus-visible:ring-green-600"
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
                        <FormLabel className="text-slate-700 font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password (min. 6 characters)"
                              className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-green-600"
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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10 h-11 border-slate-200 focus-visible:ring-green-600"
                              disabled={isLoading}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? (
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

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating your account...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create account
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-slate-500">
                        Or sign up with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-2 border-green-200 hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleSocialSignUp("google")}
                      disabled={isLoading}
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleSocialSignUp("github")}
                      disabled={isLoading}
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-slate-600">
                      Already have an account?{" "}
                      <Link
                        href="/sign-in"
                        className="font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 transition-all"
                      >
                        Sign in
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
