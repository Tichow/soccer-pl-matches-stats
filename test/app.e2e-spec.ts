import { Test, type TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MatchModule } from '../src/match.module';

describe('Soccer PL Matches Stats API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MatchModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /matches/detailed', () => {
    it('devrait retourner tous les matchs détaillés', async () => {
      const response = await request(app.getHttpServer())
        .get('/matches/detailed')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        const match = response.body[0];
        expect(match).toHaveProperty('id');
        expect(match).toHaveProperty('date');
        expect(match).toHaveProperty('time');
        expect(match).toHaveProperty('home_team');
        expect(match).toHaveProperty('away_team');
        expect(match).toHaveProperty('home_logo');
        expect(match).toHaveProperty('away_logo');
        expect(match).toHaveProperty('goals_home');
        expect(match).toHaveProperty('goals_away');
        expect(match).toHaveProperty('venue_name');
        expect(match).toHaveProperty('latitude');
        expect(match).toHaveProperty('longitude');
        expect(match).toHaveProperty('is_favorite');
      }
    });

    it('devrait filtrer les matchs par équipe', async () => {
      const teamName = 'Manchester United';
      const response = await request(app.getHttpServer())
        .get(`/matches/detailed?team=${encodeURIComponent(teamName)}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach((match: any) => {
          expect(
            match.home_team.includes(teamName) || match.away_team.includes(teamName)
          ).toBe(true);
        });
      }
    });
  });

  describe('GET /matches/summary', () => {
    it('devrait retourner un résumé de tous les matchs', async () => {
      const response = await request(app.getHttpServer())
        .get('/matches/summary')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /matches/stats', () => {
    it('devrait retourner les statistiques de la saison', async () => {
      const response = await request(app.getHttpServer())
        .get('/matches/stats')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(typeof response.body).toBe('object');
    });
  });

  describe('GET /matches/classement', () => {
    it('devrait retourner le classement de Premier League', async () => {
      const response = await request(app.getHttpServer())
        .get('/matches/classement')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        const firstTeam = response.body[0];
        expect(firstTeam).toHaveProperty('position');
        expect(firstTeam).toHaveProperty('club');
        expect(firstTeam).toHaveProperty('mj');
        expect(firstTeam).toHaveProperty('g');
        expect(firstTeam).toHaveProperty('n');
        expect(firstTeam).toHaveProperty('p');
        expect(firstTeam).toHaveProperty('bp');
        expect(firstTeam).toHaveProperty('bc'); // Buts contre
        expect(firstTeam).toHaveProperty('db');
        expect(firstTeam).toHaveProperty('pts');
        expect(firstTeam.position).toBe(1);
      }
    });
  });

  describe('GET /matches/:id', () => {
    it('devrait retourner un match spécifique par ID', async () => {
      const matchesResponse = await request(app.getHttpServer())
        .get('/matches/detailed')
        .expect(200);

      if (matchesResponse.body.length > 0) {
        const matchId = matchesResponse.body[0].id;
        const response = await request(app.getHttpServer())
          .get(`/matches/${matchId}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', matchId);
        expect(response.body).toHaveProperty('date');
        expect(response.body).toHaveProperty('home');
        expect(response.body).toHaveProperty('away');
      }
    });

    it('devrait retourner une erreur pour un ID inexistant', async () => {
      await request(app.getHttpServer())
        .get('/matches/inexistant-id')
        .expect(404);
    });
  });

  describe('POST /matches/search', () => {
    it('devrait rechercher des matchs par terme', async () => {
      const searchTerm = 'Manchester';
      const response = await request(app.getHttpServer())
        .post('/matches/search')
        .send({ term: searchTerm })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        response.body.forEach((match: any) => {
          const matchText = `${match.home_team} ${match.away_team}`.toLowerCase();
          expect(matchText.includes(searchTerm.toLowerCase())).toBe(true);
        });
      }
    });

    it('devrait retourner un tableau vide pour un terme non trouvé', async () => {
      const response = await request(app.getHttpServer())
        .post('/matches/search')
        .send({ term: 'test frauduleux' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('PUT /matches/:id/favorite', () => {
    it('devrait basculer le statut favori d\'un match', async () => {
      const matchesResponse = await request(app.getHttpServer())
        .get('/matches/detailed')
        .expect(200);

      if (matchesResponse.body.length > 0) {
        const matchId = matchesResponse.body[0].id;
        const initialFavoriteStatus = matchesResponse.body[0].is_favorite;

        const response = await request(app.getHttpServer())
          .put(`/matches/${matchId}/favorite`)
          .expect(200);

        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('match');
        expect(response.body.match.is_favorite).toBe(!initialFavoriteStatus);
        
        if (!initialFavoriteStatus) {
          expect(response.body.message).toContain('ajouté aux favoris');
        } else {
          expect(response.body.message).toContain('retiré des favoris');
        }
      }
    });
  });

  describe('POST /matches', () => {
    it('devrait créer un nouveau match', async () => {
      const newMatch = {
        date: '2024-12-25',
        time: '15:00',
        home: 'Arsenal',
        away: 'Chelsea',
        home_logo: 'https://upload.wikimedia.org/wikipedia/fr/5/53/Arsenal_FC.svg',
        away_logo: 'https://upload.wikimedia.org/wikipedia/fr/5/51/Logo_Chelsea.svg',
        goals_home: 2,
        goals_away: 1,
        venue: {
          name: 'Emirates Stadium',
          latitude: 51.5549,
          longitude: -0.1084
        },
        is_favorite: false,
        details: {
          home: { events: [] },
          away: { events: [] }
        }
      };

      const response = await request(app.getHttpServer())
        .post('/matches')
        .send(newMatch)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.home).toBe(newMatch.home);
      expect(response.body.away).toBe(newMatch.away);
      expect(response.body.date).toBe(newMatch.date);
    });
  });

  describe('PUT /matches/:id', () => {
    it('devrait mettre à jour un match existant', async () => {
      // D'abord, créer un match
      const newMatch = {
        date: '2024-12-26',
        time: '20:00',
        home: 'Liverpool',
        away: 'Manchester City',
        home_logo: 'https://upload.wikimedia.org/wikipedia/sco/0/0c/Liverpool_FC.svg',
        away_logo: 'https://upload.wikimedia.org/wikipedia/sco/e/eb/Manchester_City_FC_badge.svg',
        goals_home: 1,
        goals_away: 0,
        venue: {
          name: 'Anfield',
          latitude: 53.4308,
          longitude: -2.9608
        },
        is_favorite: false,
        details: {
          home: { events: [] },
          away: { events: [] }
        }
      };

      const createResponse = await request(app.getHttpServer())
        .post('/matches')
        .send(newMatch)
        .expect(201);

      const matchId = createResponse.body.id;

      const updateData = {
        goals_home: 3,
        goals_away: 2,
        is_favorite: true
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/matches/${matchId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.goals_home).toBe(3);
      expect(updateResponse.body.goals_away).toBe(2);
      expect(updateResponse.body.is_favorite).toBe(true);
      expect(updateResponse.body.home).toBe(newMatch.home);
    });
  });

  describe('DELETE /matches/:id', () => {
    it('devrait supprimer un match existant', async () => {
      const newMatch = {
        date: '2024-12-27',
        time: '18:00',
        home: 'Tottenham',
        away: 'West Ham',
        home_logo: 'https://upload.wikimedia.org/wikipedia/fr/5/5c/Logo_Tottenham_Hotspur.svg',
        away_logo: 'https://upload.wikimedia.org/wikipedia/sco/c/c2/West_Ham_United_FC_logo.svg',
        goals_home: 0,
        goals_away: 0,
        venue: {
          name: 'Tottenham Hotspur Stadium',
          latitude: 51.6043,
          longitude: -0.0665
        },
        is_favorite: false,
        details: {
          home: { events: [] },
          away: { events: [] }
        }
      };

      const createResponse = await request(app.getHttpServer())
        .post('/matches')
        .send(newMatch)
        .expect(201);

      const matchId = createResponse.body.id;

      const deleteResponse = await request(app.getHttpServer())
        .delete(`/matches/${matchId}`)
        .expect(200);

      expect(deleteResponse.body).toHaveProperty('message');
      expect(deleteResponse.body.message).toContain('supprimé avec succès');

      await request(app.getHttpServer())
        .get(`/matches/${matchId}`)
        .expect(404);
    });

    it('devrait retourner une erreur pour un ID inexistant', async () => {
      await request(app.getHttpServer())
        .delete('/matches/inexistant-id')
        .expect(404);
    });
  });
});
