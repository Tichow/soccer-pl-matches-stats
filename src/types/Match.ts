export interface TeamLogo {
  name: string;
  logo_url: string;
}

export interface Venue {
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  capacity?: string;
}

export interface MatchSummary {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  home_logo: string;
  away_logo: string;
  goals_home: number;
  goals_away: number;
  venue_name: string;
  latitude: number;
  longitude: number;
  is_favorite: boolean;
}

export interface PlayerStats {
  name: string;
  played_from: number;
  played_until: number;
  yellow_card: number | null;
  red_card: number | null;
  goals: number[];
  assists: number[];
}

export interface MatchEvent {
  minute: number;
  player: string;
  sub_player: string | null;
  assist: string | null;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitute_in' | 'penalty_goal';
}

export interface TeamDetails {
  players: PlayerStats[];
  events: MatchEvent[];
}

export interface Match {
  id: string;
  date: string;
  time: string;
  day: string;
  home: string;
  away: string;
  home_logo: string;
  away_logo: string;
  goals_home: number;
  goals_away: number;
  attendance: string;
  venue: Venue;
  referee: string;
  is_favorite: boolean;
  details: {
    home: TeamDetails;
    away: TeamDetails;
  };
}
