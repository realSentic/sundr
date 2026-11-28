import Link from "next/link";
import SignInForm from "@/app/components/auth-comp/signin-form";

const display = { fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 1' };

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center gap-20 pb-20 max-w-xl mx-auto">
        <div>
            <h1 className="pt-15 font-display italic font-light text-8xl" style={display}>
                Hop back in.
            </h1>
            <p className="pt-5 text-xl font-sans text-mute">Make an account, start sharing your playlists.</p>
        </div>

        <div className="flex flex-col gap-10">
            <div className="flex items-baseline justify-between">
                <h3 className="font-display italic font-light text-4xl" style={display}>
                    Sign In
                </h3>

                <span className="font-mono text-xs uppercase tracking-widest text-mute">
                    <Link href="/signup">No account? Sign Up →</Link>
                </span>
            </div>

            <SignInForm />
        </div>
    </div>
    );
}