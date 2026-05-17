"use client"

interface UpcomingEvent {
  id: string
  title: string
  date: string
  time: string
  type: "match" | "training" | "event" | "deadline"
  status: "upcoming" | "today" | "overdue"
}

interface UpcomingEventsProps {
  events: UpcomingEvent[]
  language?: "en" | "bn"
}

const typeStyles = {
  match: "bg-accent/20 border-accent text-accent dark:text-accent",
  training: "bg-green-500/20 border-green-500 text-green-600 dark:text-green-400",
  event: "bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400",
  deadline: "bg-red-500/20 border-red-500 text-red-600 dark:text-red-400",
}

const typeLabels = {
  en: {
    match: "Match",
    training: "Training",
    event: "Event",
    deadline: "Deadline",
  },
  bn: {
    match: "ম্যাচ",
    training: "প্রশিক্ষণ",
    event: "ইভেন্ট",
    deadline: "ডেডলাইন",
  },
}

export function UpcomingEvents({ events, language = "en" }: UpcomingEventsProps) {
  const isBn = language === "bn"
  const labels = typeLabels[isBn ? "bn" : "en"]

  return (
    <div className="bg-card border-2 border-secondary rounded-xl p-6">
      <h3 className={`font-semibold text-foreground mb-6 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "আসন্ন ইভেন্ট" : "Upcoming Events"}
      </h3>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className={`text-center text-foreground/60 py-8 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "কোন আসন্ন ইভেন্ট নেই" : "No upcoming events"}
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-2 ${typeStyles[event.type]} hover:shadow-md transition`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-current/20">
                      {labels[event.type]}
                    </span>
                    {event.status === "today" && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                        {isBn ? "আজ" : "Today"}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground">
                    {event.title}
                  </p>
                  <p className={`text-xs text-current/70 mt-1 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {event.date} at {event.time}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
