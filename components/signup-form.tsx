"use client";

import { useState } from "react";
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

interface SignupFormProps extends React.ComponentProps<typeof Card> {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin, ...props }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const validatePassword = (pass: string, userEmail: string, userName: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least 1 capital letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least 1 number.";
    if (!/[^A-Za-z0-9]/.test(pass)) return "Password must contain at least 1 special character.";

    // Check against email parts
    const emailPrefix = userEmail.split('@')[0].toLowerCase();
    if (emailPrefix && pass.toLowerCase().includes(emailPrefix)) {
      return "Password must not contain parts of your email.";
    }

    // Check against name parts
    const nameParts = userName.toLowerCase().split(/\s+/).filter(part => part.length > 2);
    for (const part of nameParts) {
      if (pass.toLowerCase().includes(part)) {
        return "Password must not contain parts of your name.";
      }
    }

    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const passwordError = validatePassword(password, email, name);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user?.identities?.length === 0) {
        toast.error("User already exists. Please sign in.");
      } else {
        toast.success("Account created successfully! You can now log in.");
        onSwitchToLogin?.();
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl bg-white/90 dark:bg-[#0c0d12]/90 backdrop-blur-xl" {...props}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight dark:text-white">Create an account</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="signup-name" className="dark:text-gray-200">Full Name</FieldLabel>
              <Input 
                id="signup-name" 
                type="text" 
                className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus-visible:ring-[#f37a2a]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-email" className="dark:text-gray-200">Email</FieldLabel>
              <Input
                id="signup-email"
                type="email"
                className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus-visible:ring-[#f37a2a]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FieldDescription className="text-gray-500 dark:text-gray-400">
                We&apos;ll use this to contact you. We will not share your email with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-password" className="dark:text-gray-200">Password</FieldLabel>
              <Input 
                id="signup-password" 
                type="password"
                className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus-visible:ring-[#f37a2a]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={6}
              />
              <FieldDescription className="text-gray-500 dark:text-gray-400">
                Must be at least 8 characters, include a number, a capital letter, a special character, and no names or email.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password" className="dark:text-gray-200">Confirm Password</FieldLabel>
              <Input 
                id="confirm-password" 
                type="password"
                className="bg-white dark:bg-white/5 border-gray-300 dark:border-white/10 focus-visible:ring-[#f37a2a]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <FieldDescription className="text-gray-500 dark:text-gray-400">Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button 
                  type="submit" 
                  className="w-full bg-[#292F54] hover:bg-[#1f2441] dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-bold h-11"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <FieldDescription className="px-6 text-center mt-4 text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-[#f37a2a] hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
