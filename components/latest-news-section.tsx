import newsCoach from "@/assets/news-coach.jpg";
import newsGoal from "@/assets/news-goal.jpg";
import newsStadium from "@/assets/news-stadium.jpg";
import newsPlayer from "@/assets/news-player.jpg";
import { SectionHeader } from "./section-header";

export function LatestNewsSection() {
  const items = [
    { img: newsCoach, title: "Coach Rahman on the upcoming big clash", date: "24 May 2026" },
    { img: newsGoal, title: "Sabbir Hossain scores a brace against Warriors", date: "22 May 2026" },
    { img: newsStadium, title: "Mulikandi Stadium gets a new look", date: "20 May 2026" },
    { img: newsPlayer, title: "Player of the Month — Rahim Uddin", date: "18 May 2026" },
  ];
  return (
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="panel p-4 sm:p-6 md:p-8">
        <SectionHeader title="LATEST NEWS" action="VIEW ALL NEWS" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((n) => (
            <a key={n.title} href="#" className="group block">
              <div className="overflow-hidden rounded-md border border-border">
                <img src={n.img} alt={n.title} width={768} height={576} loading="lazy" decoding="async"
                  className="h-44 sm:h-40 lg:h-44 w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              <h3 className="mt-4 font-display text-base font-semibold leading-snug group-hover:text-primary transition">
                {n.title}
              </h3>
              <div className="mt-2 text-[11px] tracking-widest text-muted-foreground">{n.date}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
