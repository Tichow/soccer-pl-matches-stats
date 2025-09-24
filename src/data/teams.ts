export const TEAM_LOGOS: Record<string, string> = {
  'Manchester Utd': 'https://upload.wikimedia.org/wikipedia/fr/b/b9/Logo_Manchester_United.svg',
  'Manchester City': 'https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg',
  'Arsenal': 'https://upload.wikimedia.org/wikipedia/fr/5/53/Arsenal_FC.svg',
  'Chelsea': 'https://upload.wikimedia.org/wikipedia/fr/5/51/Logo_Chelsea.svg',
  'Liverpool': 'https://upload.wikimedia.org/wikipedia/sco/0/0c/Liverpool_FC.svg',
  'Tottenham': 'https://upload.wikimedia.org/wikipedia/fr/5/5c/Logo_Tottenham_Hotspur.svg',
  'West Ham': 'https://upload.wikimedia.org/wikipedia/sco/c/c2/West_Ham_United_FC_logo.svg',
  'Newcastle Utd': 'https://upload.wikimedia.org/wikipedia/fr/a/a4/Logo_Newcastle_United_FC.svg',
  'Aston Villa': 'https://upload.wikimedia.org/wikipedia/fr/e/e5/Logo_Aston_Villa.svg',
  'Everton': 'https://upload.wikimedia.org/wikipedia/sco/7/7c/Everton_FC_logo.svg',
  'Fulham': 'https://upload.wikimedia.org/wikipedia/fr/c/ce/Logo_Fulham.svg',
  'Crystal Palace': 'https://upload.wikimedia.org/wikipedia/sco/0/0c/Crystal_Palace_FC_logo.svg',
  'Brighton': 'https://upload.wikimedia.org/wikipedia/fr/d/dd/Logo_Brighton_%26_Hove_Albion_2024.svg',
  'Wolves': 'https://upload.wikimedia.org/wikipedia/fr/d/dd/Logo_Brighton_%26_Hove_Albion_2024.svg',
  'Sheffield Utd': 'https://upload.wikimedia.org/wikipedia/fr/a/a5/Logo_Sheffield_United_FC.svg',
  'Bournemouth': 'https://upload.wikimedia.org/wikipedia/fr/c/c7/Logo_AFC_Bournemouth_2013_%28Alternatif%29.svg',
  'Burnley': 'https://upload.wikimedia.org/wikipedia/fr/0/02/Logo_Burnley_FC_2023.svg',
  'Brentford': 'https://upload.wikimedia.org/wikipedia/fr/3/3d/Logo_Brentford_FC_-_2017.svg',
  'Nott\'m Forest': 'https://upload.wikimedia.org/wikipedia/fr/3/37/Logo_Nottingham_Forest_FC.svg',
  'Norwich City': 'https://upload.wikimedia.org/wikipedia/fr/6/69/Logo_Norwich_City_FC_2022.svg',
  'Leeds United': 'https://upload.wikimedia.org/wikipedia/fr/7/78/Logo_Leeds_United_FC.svg',
  'Leicester City': 'https://upload.wikimedia.org/wikipedia/sco/2/2d/Leicester_City_crest.svg',
  'Ipswich Town': 'https://upload.wikimedia.org/wikipedia/fr/f/ff/Logo_Ipswich_Town_2024.svg',
  'Southampton': 'https://upload.wikimedia.org/wikipedia/fr/5/54/Southampton_FC.svg'
};

export const TEAM_TRIGRAMS: Record<string, string> = {
  'Manchester Utd': 'MUN',
  'Manchester City': 'MCI',
  'Arsenal': 'ARS',
  'Chelsea': 'CHE',
  'Liverpool': 'LIV',
  'Tottenham': 'TOT',
  'West Ham': 'WHU',
  'Newcastle Utd': 'NEW',
  'Aston Villa': 'AVL',
  'Everton': 'EVE',
  'Fulham': 'FUL',
  'Crystal Palace': 'CRY',
  'Brighton': 'BHA',
  'Wolves': 'WOL',
  'Sheffield Utd': 'SHU',
  'Bournemouth': 'BOU',
  'Burnley': 'BUR',
  'Brentford': 'BRE',
  'Nott\'m Forest': 'NFO',
  'Norwich City': 'NOR',
  'Leeds United': 'LEE',
  'Leicester City': 'LEI',
  'Ipswich Town': 'IPS',
  'Southampton': 'SOU'
};

const TRIGRAM_TO_TEAM = Object.fromEntries(
  Object.entries(TEAM_TRIGRAMS).map(([team, trigram]) => [trigram, team])
);

export function getTeamLogo(teamName: string): string {
  return TEAM_LOGOS[teamName] || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
}

export function getTeamTrigram(teamName: string): string {
  return TEAM_TRIGRAMS[teamName] || teamName.substring(0, 3).toUpperCase();
}

export function getTeamFromTrigram(trigram: string): string {
  return TRIGRAM_TO_TEAM[trigram.toUpperCase()];
}

export function resolveTeamName(input: string): string {
  const upperInput = input.toUpperCase();
  if (TRIGRAM_TO_TEAM[upperInput]) {
    return TRIGRAM_TO_TEAM[upperInput];
  }
  return input;
}