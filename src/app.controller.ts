import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      name: "Soccer PL Matches Stats API",
      description: "API REST pour les statistiques de Premier League 2024-2025",
      authors: ["Matteo Quintaneiro", "Maël Antunes"],
      
      github: "https://github.com/Tichow/soccer-pl-matches-stats",
      
      quick_test: [
        "/matches/summary - Résumé des matchs",
        "/matches/detailed - Matchs détaillés", 
        "/matches/stats - Statistiques générales",
        "/matches/classement - Classement Premier League"
      ]
    };
  }
}
