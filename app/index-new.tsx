'use client'

import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header-nav";
import { Hero } from "@/components/hero-section";
import { LatestNews } from "@/components/latest-news";
import { MatchStats } from "@/components/match-stats";
import { Fixtures } from "@/components/fixtures";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Titan Force Mulikandi — Rise Like Titans" },
      { name: "description", content: "Official home of Titan Force Mulikandi FC. Fixtures, players, match stats, and the latest club news." },
      { property: "og:title", content: "Titan Force Mulikandi FC" },
      { property: "og:description", content: "Pride of Mulikandi. Power of the Titans." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LatestNews />
        <MatchStats />
        <Fixtures />
      </main>
    </>
  );
}
