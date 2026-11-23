"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

const labelClass = "font-mono text-xs uppercase tracking-widest text-mute";
const inputClass =
  "w-full bg-transparent border-b border-line py-3 font-sans text-lg text-paper placeholder:text-dim focus:outline-none focus:border-paper transition-colors";

function getSignUpErrorMessage(error: { code?: string; message: string }) {
  switch (error.code) {
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists. Try logging in.";
    case "weak_password":
      return "That password is too weak. Try a longer one with mixed characters.";
    case "email_address_invalid":
    case "validation_failed":
      return "That email address doesn't look valid.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "signup_disabled":
    case "email_provider_disabled":
      return "Sign ups are currently disabled.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

export default function SignUpForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        setError(getSignUpErrorMessage(error));
        return;
      }

      // With email confirmation on, Supabase doesn't error for an email that's
      // already registered. It returns a user with no identities instead.
      if (data.user && data.user.identities?.length === 0) {
        setError("An account with this email already exists. Try logging in.");
        return;
      }

      if (data.session) {
        router.push("/"); // signed in
      } else {
        setCheckEmail(true); // account created, email confirmation needed
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col gap-3">
        <p className="font-display italic font-light text-3xl">Check your email.</p>
        <p className="font-sans text-lg text-mute">
          We sent a confirmation link to {email}. Click it to finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className={labelClass}>
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          className={inputClass}
        />
      </div>

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
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
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
          {loading ? "Creating account…" : "Create account →"}
        </button>
        <p className="font-sans text-sm text-dim">
          By signing up you agree to our{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-paper">
            terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-paper">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}