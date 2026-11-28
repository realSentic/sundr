"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

const labelClass = "font-mono text-xs uppercase tracking-widest text-mute";
const inputClass =
  "w-full bg-transparent border-b border-line py-3 font-sans text-lg text-paper placeholder:text-dim focus:outline-none focus:border-paper transition-colors";

function getSignInErrorMessage(error: { code?: string; message: string }) {
  switch (error.code) {
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "email_not_confirmed":
      return "Please confirm your email before logging in. Check your inbox.";
    case "validation_failed":
    case "email_address_invalid":
      return "That email address doesn't look valid.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "user_banned":
      return "This account has been suspended.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

export default function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(getSignInErrorMessage(error));
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <Link
            href="/forgot-password"
            className="font-mono text-xs uppercase tracking-widest text-dim hover:text-paper transition-colors"
          >
            Forgot?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          className={inputClass}
        />
      </div>

      {error && (
        <p role="alert" className="font-mono text-xs uppercase tracking-widest text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-paper text-ink font-mono text-xs uppercase tracking-widest py-4 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in…" : "Log in →"}
        </button>
        <p className="font-sans text-sm text-dim">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline underline-offset-4 hover:text-paper">
            Sign up
          </Link>
          .
        </p>
      </div>
    </form>
  );
}