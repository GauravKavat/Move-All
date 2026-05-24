"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createClient } from "@/lib/client";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onSwitchToSignup?: () => void;
}

export function LoginForm({
  className,
  onSwitchToSignup,
  ...props
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false); // Only stop loading on error
        return;
      }

      if (data.user) {
        toast.success("Successfully signed in!");
        
        // Refresh router cache so middleware reads the new cookies correctly
        router.refresh();

        // Check if admin
        const adminEmails = ['gauravkavat@gmail.com', 'support.moveall@gmail.com'];
        let destination = '/unauthorized';
        
        if (data.user.email && adminEmails.includes(data.user.email)) {
          destination = '/admin';
        } else {
          // Fetch client slug with fallback to profiles role check if it fails/doesn't exist
          try {
            const { data: clientData } = await supabase
              .from('clients')
              .select('slug')
              .eq('user_id', data.user.id)
              .maybeSingle();

            if (clientData?.slug) {
              destination = `/${clientData.slug}`;
            } else {
              // Check profiles table for role
              const { data: profileData } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .maybeSingle();

              if (profileData?.role === 'client') {
                destination = '/client';
              }
            }
          } catch (err) {
            // Table doesn't exist or other db error: fallback to profiles table
            const { data: profileData } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profileData?.role === 'client') {
              destination = '/client';
            }
          }
        }

        // Artificial delay ensures Supabase cookies are fully flushed to storage 
        // and gives the user time to see the "Authenticating..." loading screen.
        setTimeout(() => {
          // Use router.push to keep the loading screen active during transition
          router.push(destination);
          // Refresh the router cache so middleware and layouts read the new session
          router.refresh();
        }, 1200);

        // Notice we do NOT call setIsLoading(false) on success.
        // This keeps the loading window visible while the redirect happens, preventing "access denied" flashes.
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
      setIsLoading(false); // Stop loading on unexpected error
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Loader2 className="h-12 w-12 text-[#f37a2a] animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authenticating...</h2>
          <p className="text-sm text-gray-500 mt-2">Checking your permissions and role. Please wait.</p>
        </div>
      )}

      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl bg-white/90 dark:bg-[#0c0d12]/90 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight dark:text-white">Login to your account</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="login-email" className="dark:text-gray-200">Email</FieldLabel>
                  <Input
                    id="login-email"
                    type="email"
                    className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus-visible:ring-[#f37a2a]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="login-password" className="dark:text-gray-200">Password</FieldLabel>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm text-[#f37a2a] underline-offset-4 hover:underline font-medium"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="login-password" 
                    type="password"
                    className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus-visible:ring-[#f37a2a]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </Field>
                <Field>
                  <Button 
                    type="submit" 
                    className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white font-bold h-11"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Login
                  </Button>
                  <FieldDescription className="text-center mt-4 text-gray-600 dark:text-gray-400">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={onSwitchToSignup}
                      className="text-[#f37a2a] hover:underline font-medium"
                    >
                      Sign up
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
