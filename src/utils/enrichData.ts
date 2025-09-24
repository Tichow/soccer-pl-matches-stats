import { readFile, writeFile } from 'node:fs/promises';
import { getStadiumData } from '../data/stadiums';
import { getTeamLogo, getTeamTrigram } from '../data/teams';
import { Match } from '../types/Match';

interface RawMatch {
  date: string;
  time: string;
  day: string;
  home: string;
  away: string;
  goals_home: number;
  goals_away: number;
  attendance: string;
  venue: string;
  referee: string;
  details: any;
}

function generateMatchId(homeTeam: string, awayTeam: string, date: string): string {
  const homeTrigram = getTeamTrigram(homeTeam);
  const awayTrigram = getTeamTrigram(awayTeam);
  return `${homeTrigram}-vs-${awayTrigram}-${date}`;
}

export async function enrichMatchData(): Promise<void> {
  try {
    console.log('loading raw dataset...');
    const rawData = await readFile('src/dataset-incomplete.json', 'utf8');
    const rawMatches: RawMatch[] = JSON.parse(rawData);

    console.log('enriching data with venues and logos...');
    const enrichedMatches: Match[] = rawMatches.map((rawMatch) => {
      const venue = getStadiumData(rawMatch.venue);
      const homeLogo = getTeamLogo(rawMatch.home);
      const awayLogo = getTeamLogo(rawMatch.away);

      return {
        id: generateMatchId(rawMatch.home, rawMatch.away, rawMatch.date),
        date: rawMatch.date,
        time: rawMatch.time,
        day: rawMatch.day,
        home: rawMatch.home,
        away: rawMatch.away,
        home_logo: homeLogo,
        away_logo: awayLogo,
        goals_home: rawMatch.goals_home,
        goals_away: rawMatch.goals_away,
        attendance: rawMatch.attendance,
        venue: venue,
        referee: rawMatch.referee,
        is_favorite: false,
        details: rawMatch.details
      };
    });

    console.log('saving enriched dataset...');
    await writeFile(
      'src/dataset-enriched.json',
      JSON.stringify(enrichedMatches, null, 2),
      'utf8'
    );

    console.log(`enriched dataset created: ${enrichedMatches.length} matches processed`);
    
  } catch (error) {
    console.error('enrichment failed:', error);
    throw error;
  }
}

if (require.main === module) {
  enrichMatchData().catch(console.error);
}