# Soccer PL Matches Stats API

API REST pour l'analyse des statistiques et données de matchs de Premier League 2024-2025. L'application fournit des informations détaillées sur les matchs, incluant la géolocalisation des stades et les logos des équipes.

## Technologies utilisées

- **Node.js** - Runtime JavaScript
- **NestJS** - Framework backend TypeScript
- **TypeScript** - Langage de programmation typé
- **JSON** - Stockage de données

## Installation et démarrage

### Prérequis
- Node.js version 16 ou supérieure
- npm ou yarn

### Installation
```bash
npm install
```

### Enrichissement des données
```bash
npx ts-node src/utils/enrichData.ts
```

### Démarrage
```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000`

## Documentation de l'API

### Endpoints principaux

#### Récupération des matchs
- `GET /matches` - Liste de tous les matchs (format résumé)
- `GET /matches?team={nom}` - Matchs filtrés par équipe
- `GET /matches/:id` - Détails complets d'un match spécifique

#### Gestion des favoris
- `PUT /matches/:id/favorite` - Basculer le statut favori d'un match

#### Création et recherche
- `POST /matches` - Créer un nouveau match
- `POST /matches/search` - Rechercher dans les matchs

#### Statistiques
- `GET /matches/stats` - Statistiques générales du dataset
- `GET /matches/summary` - Résumé de tous les matchs

### Format des données

#### MatchSummary
```json
{
  "id": "match_1",
  "date": "2024-08-17",
  "time": "12:30",
  "home_team": "Arsenal",
  "away_team": "Wolverhampton Wanderers",
  "home_logo": "https://logos.../arsenal.png",
  "away_logo": "https://logos.../wolves.png",
  "goals_home": 2,
  "goals_away": 0,
  "venue_name": "Emirates Stadium",
  "latitude": 51.555,
  "longitude": -0.1086,
  "is_favorite": false
}
```

#### Match complet
Inclut tous les champs du résumé plus :
- Détails du stade (capacité, ville)
- Informations de l'arbitre
- Détails des équipes (joueurs, événements)

### Exemples d'utilisation

```bash
# Récupérer tous les matchs
curl http://localhost:3000/matches

# Détails d'un match
curl http://localhost:3000/matches/match_1

# Matchs d'Arsenal
curl "http://localhost:3000/matches?team=Arsenal"

# Statistiques
curl http://localhost:3000/matches/stats

# Recherche
curl -X POST http://localhost:3000/matches/search \
  -H "Content-Type: application/json" \
  -d '{"term": "Manchester"}'
```

## Fonctionnalités

### Données enrichies
- **380 matchs** de Premier League 2024-2025
- **20 stades** avec coordonnées GPS précises
- **Logos d'équipes** haute résolution
- **Informations détaillées** pour chaque match

### Géolocalisation
Coordonnées GPS intégrées pour tous les stades de Premier League :
- Old Trafford, Emirates Stadium, Anfield
- Stamford Bridge, Etihad Stadium, etc.

### Recherche et filtrage
- Recherche textuelle dans tous les champs
- Filtrage par équipe
- Gestion des favoris
- Statistiques aggregées

### Performance
- Chargement des données en mémoire au démarrage
- Réponses rapides (< 100ms)
- Gestion d'erreurs robuste

## Structure du projet

```
src/
├── data/           # Données de stades et équipes
├── types/          # Définitions TypeScript
├── utils/          # Utilitaires (enrichissement)
├── match.service.ts    # Logique métier
├── match.controller.ts # Endpoints API
├── match.module.ts     # Configuration NestJS
└── main.ts            # Point d'entrée
```

## Données sources

### Dataset initial
- Format : JSON
- Source : Données de matchs Premier League 2024-2025
- Contenu : 380 matchs avec informations basiques

### Enrichissement
Le script `enrichData.ts` ajoute automatiquement :
- Coordonnées GPS des stades
- URLs des logos d'équipes
- Identifiants uniques
- Champs de favori

## Développement

### Scripts disponibles
```bash
npm run start:dev    # Serveur de développement
npm run build        # Compilation TypeScript
npm run start:prod   # Serveur de production
npm run lint         # Vérification du code
```

### Tests
Les tests unitaires et d'intégration restent à implémenter.

### Configuration
- Port par défaut : 3000
- Variable d'environnement `PORT` supportée
- Configuration CORS activée

## Déploiement

L'application est prête pour le déploiement sur des plateformes cloud :
- Support des variables d'environnement
- Configuration de production optimisée
- Gestion d'erreurs appropriée

## Licence

MIT License - voir le fichier LICENSE pour plus de détails.

Copyright (c) 2025 Matteo Quintaneiro & Maël Antunes