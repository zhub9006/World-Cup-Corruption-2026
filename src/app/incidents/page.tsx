import { IncidentCard } from "@/components/incident-card";
import { MasonryGrid } from "@/components/masonry-grid";
import { getAllIncidents } from "@/lib/incidents";

export default function IncidentsPage() {
  const incidents = getAllIncidents();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Refereeing Incidents
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Documented refereeing errors and controversial decisions from FIFA
          tournaments. Each incident is cross-referenced against the official
          IFAB Laws of the Game to highlight where and how the Laws were
          misapplied.
        </p>
      </div>

      <MasonryGrid>
        {incidents.map((incident) => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </MasonryGrid>

      {incidents.length === 0 && (
        <p className="py-20 text-center text-sm text-muted-foreground">
          No incidents documented yet. Be the first to{" "}
          <a
            href="https://github.com/FadyEmad01/World-Cup-Corruption-2026"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            contribute an incident
          </a>
          .
        </p>
      )}
    </div>
  );
}
