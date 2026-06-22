"use client"

export function LeagueStandings() {
  const standings = [
    { position: 1, team: "Titan Force Mulikandi", played: 6, goalDiff: "+12", points: 16, highlight: true },
    { position: 2, team: "Greenfield FC", played: 6, goalDiff: "+6", points: 13 },
    { position: 3, team: "Riverside United", played: 6, goalDiff: "+3", points: 10 },
    { position: 4, team: "Blue Eagles", played: 6, goalDiff: "0", points: 8 },
    { position: 5, team: "United Stars", played: 6, goalDiff: "-5", points: 6 },
  ]

  return (
    <div className="border-l-4 border-primary pl-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white font-[var(--font-display)] text-2xl md:text-3xl tracking-wide uppercase">
          League Standings
        </h3>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 bg-muted/30 px-4 py-3 border-b border-border">
          <div className="col-span-1 text-muted-foreground text-xs font-bold uppercase tracking-wider">#</div>
          <div className="col-span-6 text-muted-foreground text-xs font-bold uppercase tracking-wider">TEAM</div>
          <div className="col-span-1 text-muted-foreground text-xs font-bold uppercase tracking-wider text-center">P</div>
          <div className="col-span-2 text-muted-foreground text-xs font-bold uppercase tracking-wider text-center">GD</div>
          <div className="col-span-2 text-muted-foreground text-xs font-bold uppercase tracking-wider text-center">PTS</div>
        </div>

        {/* Table Rows */}
        {standings.map((row) => (
          <div
            key={row.position}
            className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-border last:border-b-0 transition-colors ${
              row.highlight ? "bg-primary/10" : "hover:bg-muted/20"
            }`}
          >
            <div className={`col-span-1 font-bold text-sm ${row.highlight ? "text-primary" : "text-muted-foreground"}`}>
              {row.position}
            </div>
            <div className="col-span-6">
              <p className={`text-sm font-semibold ${row.highlight ? "text-primary" : "text-foreground"}`}>
                {row.team}
              </p>
            </div>
            <div className="col-span-1 text-foreground text-sm text-center font-medium">
              {row.played}
            </div>
            <div className="col-span-2 text-foreground text-sm text-center font-medium">
              {row.goalDiff}
            </div>
            <div className="col-span-2 text-foreground text-sm text-center font-bold">
              {row.points}
            </div>
          </div>
        ))}
      </div>

      {/* View Full Table Link */}
      <a
        href="#"
        className="inline-block mt-6 text-primary hover:text-accent font-semibold text-sm uppercase tracking-wider transition-colors"
      >
        View Full Table →
      </a>
    </div>
  )
}
