import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { Match, MatchSummary } from './types/Match';
import { MatchService } from './match.service';

@Controller('/matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  getMatches(@Query('team') team?: string): MatchSummary[] {
    if (team) {
      return this.matchService.getMatchesByTeam(team).map(match => ({
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
    return this.matchService.getMatchesSummary();
  }

  @Get('/summary')
  getMatchesSummary(): MatchSummary[] {
    return this.matchService.getMatchesSummary();
  }

  @Get('/stats')
  getStats() {
    const totalMatches = this.matchService.getTotalNumberOfMatches();
    const allMatches = this.matchService.getAllMatches();
    
    const favorites = allMatches.filter(match => match.is_favorite).length;
    const venues = new Set(allMatches.map(match => match.venue.name)).size;
    const teams = new Set([
      ...allMatches.map(match => match.home),
      ...allMatches.map(match => match.away)
    ]).size;

    return {
      total_matches: totalMatches,
      total_venues: venues,
      total_teams: teams,
      favorites_count: favorites
    };
  }

  @Get(':id')
  getMatch(@Param('id') id: string): Match {
    return this.matchService.getMatch(id);
  }

  @Put(':id')
  updateMatch(@Param('id') id: string, @Body() updateData: Partial<Match>): Match {
    return this.matchService.updateMatch(id, updateData);
  }

  @Put(':id/favorite')
  toggleFavorite(@Param('id') id: string): { message: string; match: Match } {
    const match = this.matchService.toggleFavorite(id);
    const action = match.is_favorite ? 'ajouté aux' : 'retiré des';
    return {
      message: `Match ${action} favoris`,
      match
    };
  }

  @Post()
  createMatch(@Body() matchData: Omit<Match, 'id'>): Match {
    return this.matchService.createMatch(matchData);
  }

  @Post('/search')
  @HttpCode(200)
  searchMatches(@Body() { term }: { term: string }): MatchSummary[] {
    return this.matchService.searchMatches(term).map(match => ({
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

  @Delete(':id')
  deleteMatch(@Param('id') id: string): { message: string } {
    this.matchService.removeMatch(id);
    return { message: `Match ${id} supprimé avec succès` };
  }
}
