import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RuleCitation } from "@/components/rule-citation";
import { getIncidentById } from "@/lib/incidents";

export async function generateStaticParams() {
  const { getAllIncidents } = await import("@/lib/incidents");
  const incidents = getAllIncidents();
  return incidents.map((i) => ({ id: i.id }));
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const incident = getIncidentById(id);

  if (!incident) {
    notFound();
  }

  const severityStyles: Record<string, string> = {
    critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    major:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    minor:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/incidents"
        className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3" /> All Incidents
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${severityStyles[incident.severity]}`}
        >
          {incident.severity}
        </span>
        <span className="text-xs text-muted-foreground">
          {incident.tournament} &middot; {incident.competitionStage}
        </span>
      </div>

      <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
        {incident.title}
      </h1>

      <p className="mb-8 text-sm text-muted-foreground">
        {incident.teams.home} vs {incident.teams.away} &middot; {incident.date}{" "}
        &middot; Minute {incident.minute}
      </p>

      <div className="mb-8 rounded-xl border bg-card p-5">
        <h2 className="mb-3 text-sm font-semibold">Match Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3">
          <Detail label="Match" value={incident.match} />
          <Detail label="Tournament" value={incident.tournament} />
          <Detail label="Stage" value={incident.competitionStage} />
          <Detail label="Date" value={incident.date} />
          <Detail label="Referee" value={incident.referee} />
          <Detail label="Minute" value={String(incident.minute)} />
          <Detail label="VAR Used" value={incident.wasVARUsed ? "Yes" : "No"} />
          {incident.varOutcome && (
            <Detail label="VAR Outcome" value={incident.varOutcome} />
          )}
        </dl>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Description</h2>
        <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {incident.description}
        </div>
      </div>

      {incident.images.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Images</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {incident.images.map((img) => (
              <figure
                key={img.url}
                className="overflow-hidden rounded-xl border bg-muted"
              >
                {/* biome-ignore lint/performance/noImgElement: external CDN images */}
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="px-3 py-2 text-[11px] text-muted-foreground">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {incident.videos.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold">Videos</h2>
          <div className="space-y-3">
            {incident.videos.map((video) => (
              <a
                key={video.url}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border bg-card p-4 text-sm transition-colors hover:bg-accent"
              >
                <svg
                  className="size-5 shrink-0 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span className="font-medium">{video.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-4 text-sm font-semibold">
          Applicable Laws of the Game
        </h2>
        <div className="space-y-4">
          {incident.rules.map((ruleRef) => (
            <RuleCitation
              key={`${ruleRef.lawNumber}-${ruleRef.lawTitle}`}
              ruleRef={ruleRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-foreground">{label}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </div>
  );
}
