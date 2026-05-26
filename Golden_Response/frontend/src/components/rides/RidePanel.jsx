import { Clock, DollarSign, Route, Users } from "lucide-react";
import { Button } from "../ui/Button";

export function RidePanel({ activeRides, matches, onCancel }) {
  return (
    <aside className="dashboard-card flex min-h-0 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 p-4">
        <div>
          <h2 className="text-lg font-bold text-ink">Ride matches</h2>
          <p className="text-sm text-ink/60">Live updates appear here.</p>
        </div>
        <span className="rounded-full bg-skywash px-3 py-1 text-xs font-bold text-mint">
          {activeRides.length} active
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto p-4">
        {matches.length > 0 ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <div className="rounded-md border border-dashed border-ink/20 p-4 text-sm text-ink/65">
            Submit pickup and drop-off details to start matching.
          </div>
        )}

        {activeRides.map((ride) => (
          <article key={ride.id} className="rounded-md border border-ink/10 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold text-ink">{ride.status}</h3>
              <span className="text-sm font-bold text-mint">${ride.estimatedFare}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-ink/70">
              <Metric icon={<Route size={16} />} value={`${ride.estimatedDistanceKm} km`} />
              <Metric icon={<Clock size={16} />} value={`${ride.estimatedDurationMinutes} min`} />
              <Metric icon={<Users size={16} />} value={`${ride.seats} seat${ride.seats > 1 ? "s" : ""}`} />
            </div>
            <Button
              variant="danger"
              className="mt-3 min-h-9 w-full py-1.5"
              onClick={() => onCancel(ride.id)}
            >
              Cancel ride
            </Button>
          </article>
        ))}
      </div>
    </aside>
  );
}

function MatchCard({ match }) {
  return (
    <article className="rounded-md border border-mint/20 bg-skywash p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">Nearby shared ride</h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink/65">{match.pickup.label}</p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-mint">
          {match.status}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Metric icon={<DollarSign size={16} />} value={`$${match.estimatedFare}`} />
        <Metric icon={<Clock size={16} />} value={`${match.estimatedDurationMinutes} min`} />
        <Metric icon={<Users size={16} />} value={`${match.seats} seats`} />
      </div>
    </article>
  );
}

function Metric({ icon, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded bg-white px-2 py-1 font-semibold text-ink/75">
      {icon}
      {value}
    </span>
  );
}
