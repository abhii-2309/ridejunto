import { useCallback, useEffect, useMemo, useState } from "react";
import { LogOut, Navigation, Radio, Users } from "lucide-react";
import { MapView } from "../components/map/MapView";
import { LocationSearch } from "../components/map/LocationSearch";
import { RidePanel } from "../components/rides/RidePanel";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { useSocket } from "../hooks/useSocket";
import { createRide, fetchActiveRides, updateRideStatus } from "../services/rides";
import { logoutUser } from "../services/auth";

export function Dashboard({ user, onLogout }) {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [seats, setSeats] = useState(1);
  const [errors, setErrors] = useState({});
  const [activeRides, setActiveRides] = useState([]);
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRideEvent = useCallback((payload) => {
    if (payload?.ride) {
      setActiveRides((current) => {
        const without = current.filter((ride) => ride.id !== payload.ride.id);
        const keep = ["pending", "matched", "accepted"].includes(payload.ride.status);
        return keep ? [payload.ride, ...without] : without;
      });
    }
    if (payload?.matches) setMatches(payload.matches);
  }, []);

  const connected = useSocket(user, handleRideEvent);

  useEffect(() => {
    fetchActiveRides()
      .then((data) => setActiveRides(data.rides))
      .catch((error) => setMessage(error.message));
  }, []);

  const latestRide = useMemo(() => activeRides[0], [activeRides]);

  async function submitRide(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!pickup) nextErrors.pickup = "Choose a valid pickup location.";
    if (!dropoff) nextErrors.dropoff = "Choose a valid drop-off location.";
    if (!Number.isInteger(Number(seats)) || Number(seats) < 1) {
      nextErrors.seats = "Seats are required.";
    }

    setErrors(nextErrors);
    setMessage("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const data = await createRide({ pickup, dropoff, seats: Number(seats) });
      setActiveRides((current) => [data.ride, ...current.filter((ride) => ride.id !== data.ride.id)]);
      setMatches(data.matches || []);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelRide(id) {
    try {
      const data = await updateRideStatus(id, "cancelled");
      setActiveRides((current) => current.filter((ride) => ride.id !== data.ride.id));
      setMessage("Ride cancelled.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleLogout() {
    await logoutUser();
    onLogout();
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#ddebe8]">
      <MapView pickup={pickup} dropoff={dropoff} />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-[900] flex items-center justify-between gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto rounded-lg bg-white/95 px-4 py-3 shadow-panel backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">RideJunto</p>
          <h1 className="text-lg font-black text-ink">Welcome, {user.name.split(" ")[0]}</h1>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-white/95 p-2 shadow-panel backdrop-blur">
          <span className="hidden items-center gap-1.5 px-2 text-sm font-semibold text-ink/70 sm:inline-flex">
            <Radio size={16} className={connected ? "text-mint" : "text-coral"} />
            {connected ? "Live" : "Offline"}
          </span>
          <Button variant="secondary" onClick={handleLogout} aria-label="Log out">
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <section className="pointer-events-none absolute inset-x-0 bottom-0 z-[950] grid max-h-[84vh] gap-3 p-3 sm:inset-y-24 sm:left-5 sm:right-auto sm:w-[390px] sm:p-0 lg:w-[420px]">
        <form onSubmit={submitRide} className="dashboard-card pointer-events-auto p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-ink">Plan your ride</h2>
              <p className="text-sm text-ink/60">Search places and set your match.</p>
            </div>
            <span className="rounded-full bg-skywash px-3 py-1 text-xs font-bold text-mint">
              OSM
            </span>
          </div>

          <div className="space-y-4">
            <LocationSearch
              label="Pickup location"
              value={pickup}
              onSelect={setPickup}
              error={errors.pickup}
              placeholder="Search pickup"
            />
            <LocationSearch
              label="Drop-off location"
              value={dropoff}
              onSelect={setDropoff}
              error={errors.dropoff}
              placeholder="Search drop-off"
            />
            <Field label="Seats" htmlFor="seats" error={errors.seats}>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-mint" aria-hidden="true" />
                <input
                  id="seats"
                  type="number"
                  min="1"
                  max="6"
                  className="input"
                  value={seats}
                  onChange={(event) => setSeats(event.target.value)}
                />
              </div>
            </Field>
          </div>

          <Button type="submit" className="mt-5 w-full" disabled={submitting}>
            <Navigation size={18} />
            {submitting ? "Matching..." : "Find shared ride"}
          </Button>

          {message ? (
            <p className="mt-3 rounded-md bg-skywash px-3 py-2 text-sm font-medium text-ink/75" role="status">
              {message}
            </p>
          ) : null}

          {latestRide ? (
            <div className="mt-4 rounded-md bg-ink p-3 text-white">
              <p className="text-sm font-bold">Latest estimate</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-sm">
                <span>{latestRide.estimatedDistanceKm} km</span>
                <span>{latestRide.estimatedDurationMinutes} min</span>
                <span>${latestRide.estimatedFare}</span>
              </div>
            </div>
          ) : null}
        </form>

        <div className="pointer-events-auto min-h-0">
          <RidePanel activeRides={activeRides} matches={matches} onCancel={cancelRide} />
        </div>
      </section>
    </main>
  );
}
