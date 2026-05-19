-- Add player ranking column to players table
alter table public.players 
add column if not exists ranking integer default 0,
add column if not exists matches_played integer default 0,
add column if not exists goals integer default 0,
add column if not exists assists integer default 0;

-- Create index for player ranking queries
create index if not exists idx_players_ranking on public.players(ranking);
