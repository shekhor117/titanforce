export type FixtureStatus = 'Upcoming' | 'Live' | 'Finished';
export type FixtureEventType = 'goal' | 'yellow' | 'red' | 'own-goal' | 'penalty';

export interface FixtureEvent {
  id: string;
  type: FixtureEventType;
  minute: number;
  team: 'home' | 'away';
  playerName: string;
  assistantName?: string;
}

export interface Fixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeLogoColor: string;
  awayLogoColor: string;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  status: FixtureStatus;
  referee: string;
  stadium: string;
  events: FixtureEvent[];
}

export interface Player {
  id: string;
  name: string;
  number?: number;
}
