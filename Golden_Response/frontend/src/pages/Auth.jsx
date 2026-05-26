import { ArrowLeft } from "lucide-react";
import { AuthForm } from "../components/auth/AuthForm";
import { Button } from "../components/ui/Button";

export function Auth({ mode, onModeChange, onAuthenticated, onBack }) {
  return (
    <main className="grid min-h-screen bg-skywash px-5 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-0 lg:py-0">
      <section className="hidden items-center justify-center bg-ink p-12 text-white lg:flex">
        <div className="max-w-lg">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-coral">
            RideJunto
          </p>
          <h1 className="mt-4 text-5xl font-black leading-tight">
            Every trip starts with a clean match.
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/70">
            Register once, search real places, place precise markers, and manage
            ride requests in a responsive map-first workspace.
          </p>
        </div>
      </section>
      <section className="flex min-h-screen flex-col items-center justify-center gap-6">
        <div className="w-full max-w-md">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft size={18} />
            Back
          </Button>
        </div>
        <AuthForm
          mode={mode}
          onModeChange={onModeChange}
          onAuthenticated={onAuthenticated}
        />
      </section>
    </main>
  );
}
