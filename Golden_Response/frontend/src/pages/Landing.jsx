import { ArrowRight, Car, MapPin, ShieldCheck, Users } from "lucide-react";
import { Button } from "../components/ui/Button";

export function Landing({ onAuth }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbfa]">
      <section className="relative grid min-h-screen content-center px-5 py-10 sm:px-8 lg:px-14">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="road-line road-line-one" />
          <div className="road-line road-line-two" />
          <div className="absolute left-[8%] top-[16%] h-28 w-28 rounded-full bg-mint/10" />
          <div className="absolute bottom-[8%] right-[10%] h-36 w-36 rounded-full bg-coral/10" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-mint shadow-sm">
              <MapPin size={16} />
              OpenStreetMap-powered ride sharing
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight text-ink sm:text-6xl lg:text-7xl">
              RideJunto
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              Find nearby shared rides, compare routes, and move through pickup,
              drop-off, and matching without costly map APIs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => onAuth("register")} className="sm:min-w-44">
                Ride now
                <ArrowRight size={18} />
              </Button>
              <Button variant="secondary" onClick={() => onAuth("register")} className="sm:min-w-44">
                <Car size={18} />
                Drive with us
              </Button>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="phone-shell">
              <div className="mini-map">
                <div className="route-path" />
                <div className="pin pin-a" />
                <div className="pin pin-b" />
                <div className="car-dot" />
              </div>
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-ink">Matched ride</span>
                  <span className="rounded-full bg-skywash px-2 py-1 text-xs font-bold text-mint">
                    3 min
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 rounded bg-ink/10" />
                  <div className="h-3 w-2/3 rounded bg-ink/10" />
                </div>
              </div>
            </div>
            <div className="stat-card left-0 top-8">
              <Users size={18} />
              Shared seats
            </div>
            <div className="stat-card bottom-10 right-0">
              <ShieldCheck size={18} />
              Secure rides
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
