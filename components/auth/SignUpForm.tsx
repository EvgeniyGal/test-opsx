"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);

  const validatePassword = (pwd: string) => {
    if (pwd.length === 0) {
      setPasswordStrength(null);
      return;
    }
    if (pwd.length < 8) {
      setPasswordStrength("weak");
      return;
    }
    if (pwd.length >= 12 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) {
      setPasswordStrength("strong");
      return;
    }
    setPasswordStrength("medium");
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // Redirect to pending approval page
      router.push("/auth/pending");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === "weak") return "bg-red-500";
    if (passwordStrength === "medium") return "bg-yellow-500";
    if (passwordStrength === "strong") return "bg-green-500";
    return "bg-gray-200 dark:bg-gray-700";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === "weak") return "Password is too short";
    if (passwordStrength === "medium") return "Password is okay";
    if (passwordStrength === "strong") return "Strong password";
    return "Must be at least 8 characters";
  };

  const isFormValid = password.length >= 8 && password === confirmPassword && name.length > 0 && email.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {error && (
          <Alert variant="destructive" className="animate-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full name
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="pl-11 h-12 text-base border-2 focus:border-primary transition-colors"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="pl-11 h-12 text-base border-2 focus:border-primary transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                minLength={8}
                disabled={isLoading}
                className="pl-11 h-12 text-base border-2 focus:border-primary transition-colors"
                autoComplete="new-password"
              />
            </div>
            {password && (
              <div className="space-y-2 pt-1">
                <div className="flex gap-1.5 h-2">
                  <div
                    className={`flex-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  />
                  <div
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      passwordStrength === "medium" || passwordStrength === "strong"
                        ? getPasswordStrengthColor()
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                  <div
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      passwordStrength === "strong" ? getPasswordStrengthColor() : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                </div>
                <p className={`text-xs font-medium ${
                  passwordStrength === "weak" ? "text-red-600 dark:text-red-400" :
                  passwordStrength === "medium" ? "text-yellow-600 dark:text-yellow-400" :
                  passwordStrength === "strong" ? "text-green-600 dark:text-green-400" :
                  "text-muted-foreground"
                }`}>
                  {getPasswordStrengthText()}
                </p>
              </div>
            )}
            {!password && (
              <p className="text-xs text-muted-foreground pt-1">
                Must be at least 8 characters
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Confirm password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pl-11 h-12 text-base border-2 focus:border-primary transition-colors"
                autoComplete="new-password"
              />
            </div>
            {confirmPassword && (
              <div className="pt-1">
                {password === confirmPassword && password.length > 0 ? (
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium animate-in slide-in-from-top-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Passwords match</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium animate-in slide-in-from-top-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Passwords do not match</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="font-semibold text-primary hover:underline transition-colors"
          >
            Sign in
          </a>
        </div>
      </form>
    </div>
  );
}
