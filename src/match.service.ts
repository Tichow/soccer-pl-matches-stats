import { readFile } from 'node:fs/promises';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Match, MatchSummary } from './types/Match';

@Injectable()
export class MatchService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  private readonly storage: Map<string, Match> = new Map();

  async onModuleInit() {
    // chargement parallèle pour optimiser le démarrage
    await Promise.all([
      this.loadMatchesFromFile(),
      this.loadMatchesFromApi()
    ]);
  }

  private async loadMatchesFromFile() {
    try {
      const data = await readFile('src/dataset-enriched.json', 'utf8');
      const matches = JSON.parse(data.toString()) as Match[];
      matches.forEach((match) => this.addMatch(match));
      console.log(`loaded ${matches.length} matches from local file`);
    } catch (error) {
      console.log('local file not found, using api fallback only');
    }
  }

  private async loadMatchesFromApi() {
    try {
      const url = 'https://storage.googleapis.com/kagglesdsdata/datasets/8207331/12967832/epl-2024-2025-match-data.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gcp-kaggle-com%40kaggle-161607.iam.gserviceaccount.com%2F20250922%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20250922T115019Z&X-Goog-Expires=259200&X-Goog-SignedHeaders=host&X-Goog-Signature=8e121cf86cf787776e9aba526c7ad1a3b5cae5dc6d863d93f424dbd2018a063a97cc00b2ff62d689148fc29ab1e50e382fc9f8dcf4a77caa9a2e2fd59753e6f2b21f80fe6bc553720cfd0d29f1a82aef3441dd138a8381de029bc0f86ad50ab86d74803dbe5b9f8c87bcdbe10274707dbebf1f03b6daab7febee68a7d2a36811b8b0c121f04b80d73dc15c1406790380e59df20ceaa9fac49ed696f8fcb405d4b74b5df534dc2c42cef32d6813f043e26c35e8d71864ba3a736a50f392a65df25633737769fc846ae7b648e74057c3f89c59ee8b4b8e43dbc9b87c06066ac9ed09ac2f201d330b83ed7476f51d1f0fa8afdfae8a147067c8d36c3530be75b200';
      
      const { data } = await firstValueFrom(
        this.httpService.get(url, { timeout: 10000 })
      );

      console.log(`api data available for future enrichment`);
    } catch (error) {
      console.log('external api unavailable');
    }
  }

  addMatch(match: Match) {
    this.storage.set(match.id, match);
  }

  getMatch(id: string): Match {
    const match = this.storage.get(id);
    if (!match) {
      throw new Error(`Match avec l'ID ${id} non trouvé`);
    }
    return match;
  }

  getAllMatches(): Match[] {
    return Array.from(this.storage.values()).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  getMatchesSummary(): MatchSummary[] {
    return this.getAllMatches().map(match => ({
      id: match.id,
      date: match.date,
      time: match.time,
      home_team: match.home,
      away_team: match.away,
      home_logo: match.home_logo,
      away_logo: match.away_logo,
      goals_home: match.goals_home,
      goals_away: match.goals_away,
      venue_name: match.venue.name,
      latitude: match.venue.latitude,
      longitude: match.venue.longitude,
      is_favorite: match.is_favorite
    }));
  }

  getMatchesByTeam(teamName: string): Match[] {
    return this.getAllMatches()
      .filter(match => 
        match.home.toLowerCase().includes(teamName.toLowerCase()) ||
        match.away.toLowerCase().includes(teamName.toLowerCase())
      );
  }

  searchMatches(term: string): Match[] {
    const searchTerm = term.toLowerCase();
    return this.getAllMatches()
      .filter(match =>
        match.home.toLowerCase().includes(searchTerm) ||
        match.away.toLowerCase().includes(searchTerm) ||
        match.venue.name.toLowerCase().includes(searchTerm) ||
        match.venue.city.toLowerCase().includes(searchTerm)
      );
  }

  toggleFavorite(id: string): Match {
    const match = this.getMatch(id);
    match.is_favorite = !match.is_favorite;
    this.storage.set(id, match);
    return match;
  }

  updateMatch(id: string, updateData: Partial<Match>): Match {
    const match = this.getMatch(id);
    const updatedMatch = { ...match, ...updateData };
    this.storage.set(id, updatedMatch);
    return updatedMatch;
  }

  createMatch(matchData: Omit<Match, 'id'>): Match {
    const id = `match_${Date.now()}`;
    const newMatch: Match = { ...matchData, id };
    this.storage.set(id, newMatch);
    return newMatch;
  }

  removeMatch(id: string): void {
    const match = this.getMatch(id);
    this.storage.delete(id);
  }

  getTotalNumberOfMatches(): number {
    return this.storage.size;
  }
}
