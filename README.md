# Soccer PL Matches Stats API

API REST pour l'analyse des statistiques et données de matchs de Premier League 2024-2025. L'application propose deux formats de données : un résumé minimaliste avec les événements clés (buteurs, cartons) et un format détaillé avec géolocalisation et logos pour une analyse complète.

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

### Enrichissement des données (pour information, cela a déjà été fait)
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
- `GET /matches/summary` - Résumé minimaliste (équipes, scores, buteurs, cartons) - idéal pour affichage de résultats
- `GET /matches/detailed` - Format complet avec logos et géolocalisation - pour analyses approfondies
- `GET /matches/detailed?team={nom}` - Matchs détaillés filtrés par équipe
- `GET /matches/:id` - Détails complets d'un match spécifique

#### Gestion des favoris
- `PUT /matches/:id/favorite` - Basculer le statut favori d'un match

#### Création et recherche
- `POST /matches` - Créer un nouveau match
- `POST /matches/search` - Rechercher dans les matchs (format détaillé)

#### Statistiques
- `GET /matches/stats` - Statistiques générales du dataset

### Format des données

#### MatchSummary (format minimaliste)
```json
{
  "id": "match_1",
  "date": "2024-08-17",
  "time": "12:30",
  "home_team": "Arsenal",
  "away_team": "Wolverhampton Wanderers",
  "goals_home": 2,
  "goals_away": 0,
  "goalscorers": ["Kai Havertz", "Bukayo Saka (Gabriel Jesus)"],
  "assists": ["Gabriel Jesus"],
  "yellow_cards": ["Thomas Partey"],
  "red_cards": []
}
```

#### MatchDetailed (format complet avec géolocalisation)
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

#### Match complet (endpoint spécifique)
Inclut tous les champs détaillés plus :
- Détails du stade (capacité, ville)
- Informations de l'arbitre
- Détails des équipes (joueurs, événements)

### Exemples d'utilisation

```bash
# Résumé minimaliste de tous les matchs (avec buteurs et cartons)
curl http://localhost:3000/matches/summary

# Format détaillé de tous les matchs (avec logos et géolocalisation)
curl http://localhost:3000/matches/detailed

# Détails d'un match spécifique
curl http://localhost:3000/matches/match_1

# Matchs détaillés d'Arsenal
curl "http://localhost:3000/matches/detailed?team=Arsenal"

# Statistiques générales
curl http://localhost:3000/matches/stats

# Recherche (format détaillé)
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

### Formats de données flexibles
- **Format summary** : Données essentielles (équipes, scores, buteurs, cartons)
- **Format detailed** : Informations complètes avec géolocalisation et logos
- Optimisé selon les besoins d'affichage

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