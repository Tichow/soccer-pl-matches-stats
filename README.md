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

### Correction d'encodage UTF-8 (si nécessaire)
Le dataset original contenait de nombreux problèmes d'encodage pour les noms de joueurs (caractères comme Ã© au lieu de é, č± au lieu de ı, etc.). Un script de correction a été développé :

```bash
python3 fix-utf8-encoding.py src/dataset-incomplete.json
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

### Structure des IDs de matchs

Les matchs utilisent un système d'ID basé sur les trigrammes des équipes et la date :
```
{ÉQUIPE_DOMICILE}-vs-{ÉQUIPE_EXTÉRIEUR}-{DATE}
```

**Exemples :**
- `MUN-vs-FUL-2024-08-16` (Manchester Utd vs Fulham)
- `ARS-vs-WOL-2024-08-17` (Arsenal vs Wolverhampton)

### Trigrammes des équipes

| Trigramme | Équipe |
|-----------|--------|
| MUN | Manchester Utd |
| MCI | Manchester City |
| ARS | Arsenal |
| CHE | Chelsea |
| LIV | Liverpool |
| TOT | Tottenham |
| WHU | West Ham |
| NEW | Newcastle Utd |
| AVL | Aston Villa |
| EVE | Everton |
| FUL | Fulham |
| CRY | Crystal Palace |
| BHA | Brighton |
| WOL | Wolves |
| SHU | Sheffield Utd |
| BOU | Bournemouth |
| BUR | Burnley |
| BRE | Brentford |
| NFO | Nott'm Forest |
| NOR | Norwich City |
| LEE | Leeds Utd |
| LEI | Leicester City |
| IPS | Ipswich Town |
| SOU | Southampton |

### Endpoints principaux

#### Récupération des matchs
- `GET /matches/summary` - Résumé minimaliste (équipes, scores, buteurs, cartons) - idéal pour affichage de résultats
- `GET /matches/detailed` - Format complet avec logos et géolocalisation - pour analyses approfondies
- `GET /matches/detailed?team={nom_ou_trigramme}` - Matchs détaillés filtrés par équipe
- `GET /matches/:id` - Détails complets d'un match spécifique

#### Gestion des favoris
- `PUT /matches/:id/favorite` - Basculer le statut favori d'un match

#### Création et recherche
- `POST /matches` - Créer un nouveau match
- `POST /matches/search` - Rechercher dans les matchs (format détaillé)

#### Statistiques et classement
- `GET /matches/stats` - Statistiques de la saison 2024-2025 (buteurs, passeurs, cartons)
- `GET /matches/classement` - Classement actuel de Premier League

#### Gestion des matchs
- `PUT /matches/:id` - Modifier un match existant
- `DELETE /matches/:id` - Supprimer un match

### Recherche par équipe

La recherche accepte **à la fois le nom complet et le trigramme** :

```bash
# Par nom complet
curl "http://localhost:3000/matches/detailed?team=Arsenal"

# Par trigramme (plus pratique)
curl "http://localhost:3000/matches/detailed?team=ARS"

# Même résultat dans les deux cas
```

### Accès à un match spécifique

Pour accéder directement à un match, utilisez l'ID construit avec les trigrammes :

```bash
# Match Manchester United vs Fulham du 16 août 2024
curl http://localhost:3000/matches/MUN-vs-FUL-2024-08-16

# Match Arsenal vs Wolves du 17 août 2024
curl http://localhost:3000/matches/ARS-vs-WOL-2024-08-17
```

### Format des données

#### MatchSummary (format minimaliste)
```json
{
  "id": "MUN-vs-FUL-2024-08-16",
  "date": "2024-08-16",
  "time": "20:00",
  "home_team": "Manchester Utd",
  "away_team": "Fulham",
  "goals_home": 1,
  "goals_away": 0,
  "goalscorers": ["Joshua Zirkzee"],
  "assists": ["Alejandro Garnacho"],
  "yellow_cards": ["Harry Maguire"],
  "red_cards": []
}
```

#### MatchDetailed (format complet avec géolocalisation)
```json
{
  "id": "MUN-vs-FUL-2024-08-16",
  "date": "2024-08-16",
  "time": "20:00",
  "home_team": "Manchester Utd",
  "away_team": "Fulham",
  "home_logo": "https://upload.wikimedia.org/...",
  "away_logo": "https://upload.wikimedia.org/...",
  "goals_home": 1,
  "goals_away": 0,
  "venue_name": "Old Trafford",
  "latitude": 53.4631,
  "longitude": -2.2914,
  "is_favorite": false
}
```

#### Match complet (endpoint spécifique)
Inclut tous les champs détaillés plus :
- Détails du stade (capacité, ville)
- Informations de l'arbitre
- Détails des équipes (joueurs, événements)

#### Statistiques de saison
```json
{
  "total_matches": 380,
  "total_teams": 20,
  "total_venues": 20,
  "top_scorers": [
    {"player": "Erling Haaland", "goals": 27},
    {"player": "Harry Kane", "goals": 24}
  ],
  "top_assists": [
    {"player": "Kevin De Bruyne", "assists": 15},
    {"player": "Bruno Fernandes", "assists": 12}
  ],
  "cards": {
    "most_yellow_cards": [
      {"player": "Casemiro", "yellow_cards": 8}
    ],
    "most_red_cards": [
      {"player": "Joao Palhinha", "red_cards": 2}
    ],
    "total_yellow_cards": 1247,
    "total_red_cards": 58
  }
}
```

#### Classement Premier League
```json
[
  {
    "position": 1,
    "club": "Liverpool",
    "mj": 17,
    "g": 13,
    "n": 3,
    "p": 1,
    "bp": 35,
    "bc": 12,
    "db": 23,
    "pts": 42
  }
]
```

**Légende du classement :**
- `mj` : Matchs joués
- `g` : Victoires (gagnés)
- `n` : Matchs nuls
- `p` : Défaites (perdus)
- `bp` : Buts pour
- `bc` : Buts contre
- `db` : Différence de buts
- `pts` : Points

### Exemples d'utilisation

```bash
# Résumé minimaliste de tous les matchs (avec buteurs et cartons)
curl http://localhost:3000/matches/summary

# Format détaillé de tous les matchs (avec logos et géolocalisation)
curl http://localhost:3000/matches/detailed

# Match spécifique par ID user-friendly
curl http://localhost:3000/matches/ARS-vs-CHE-2024-11-10

# Matchs d'Arsenal (par nom complet)
curl "http://localhost:3000/matches/detailed?team=Arsenal"

# Matchs de Manchester City (par trigramme)
curl "http://localhost:3000/matches/detailed?team=MCI"

# Statistiques de la saison (buteurs, passeurs, cartons)
curl http://localhost:3000/matches/stats

# Recherche de matchs (accepte trigrammes et noms)
curl -X POST http://localhost:3000/matches/search \
  -H "Content-Type: application/json" \
  -d '{"term": "MUN"}'

# Classement de Premier League
curl http://localhost:3000/matches/classement

# Ajouter/retirer un match des favoris
curl -X PUT http://localhost:3000/matches/MUN-vs-FUL-2024-08-16/favorite

# Créer un nouveau match
curl -X POST http://localhost:3000/matches \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-12-25","time":"15:00","home":"Arsenal","away":"Chelsea",...}'

# Modifier un match existant
curl -X PUT http://localhost:3000/matches/ARS-vs-CHE-2024-12-25 \
  -H "Content-Type: application/json" \
  -d '{"goals_home":3,"goals_away":1}'

# Supprimer un match
curl -X DELETE http://localhost:3000/matches/ARS-vs-CHE-2024-12-25
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

### Système de trigrammes intelligent
- **IDs lisibles** : `MUN-vs-FUL-2024-08-16` au lieu de `match_64`
- **Recherche flexible** : par nom complet ou trigramme
- **URLs intuitives** : facile de deviner l'ID d'un match

### Statistiques avancées
- **Top 10 buteurs** de la saison avec nombre de buts
- **Top 10 passeurs** décisifs avec nombre d'assists  
- **Classements cartons** jaunes et rouges par joueur
- **Totaux de la saison** : buts, cartons, équipes, stades

### Recherche et filtrage
- Recherche textuelle dans tous les champs
- Filtrage par équipe
- Gestion des favoris

### Performance
- Chargement des données en mémoire au démarrage
- Réponses rapides (< 100ms)
- Gestion d'erreurs robuste

## Structure du projet

```
src/
├── data/           # Données de stades et équipes (avec trigrammes)
├── types/          # Définitions TypeScript
├── utils/          # Utilitaires (enrichissement)
├── match.service.ts    # Logique métier
├── match.controller.ts # Endpoints API
├── match.module.ts     # Configuration NestJS
├── main.ts            # Point d'entrée
├── dataset-incomplete.json  # Dataset original
└── dataset-enriched.json    # Dataset enrichi
fix-utf8-encoding.py    # Script de correction d'encodage UTF-8
```

## Données sources

### Dataset initial
- Format : JSON
- Source : Données de matchs Premier League 2024-2025
- Contenu : 380 matchs avec informations basiques

### Correction d'encodage
Le dataset original présentait de nombreux problèmes d'encodage UTF-8 :
- Noms de joueurs mal affichés (ex: `Altay Bayč±ndč±r` au lieu de `Altay Bayındır`)
- Caractères accentués corrompus (ex: `Ã©` au lieu de `é`)
- Caractères spéciaux turcs/slaves malformés

Le script `fix-utf8-encoding.py` corrige automatiquement :
- Plus de 200 patterns d'encodage incorrect
- Caractères UTF-8 double-encodés
- Caractères de contrôle indésirables
- Normalisation Unicode (forme canonique NFC)

### Enrichissement
Le script `enrichData.ts` ajoute automatiquement :
- Coordonnées GPS des stades
- URLs des logos d'équipes
- Identifiants user-friendly avec trigrammes
- Champs de favori

## Tests avec Postman

### Import de la collection
Une collection Postman complète est fournie dans le fichier `Soccer-PL-Matches.postman_collection.json` :

1. **Importer la collection** :
   - Ouvrir Postman
   - Cliquer sur "Import"
   - Sélectionner le fichier `Soccer-PL-Matches.postman_collection.json`

2. **Configurer la variable d'environnement** :
   - Créer un nouvel environnement ou modifier l'environnement actuel
   - Ajouter la variable `url` avec la valeur `http://localhost:3000`
   - Sauvegarder et activer cet environnement

3. **Lancer l'API** :
   ```bash
   npm run start:dev
   ```

4. **Tester les endpoints** :
   - La collection contient tous les endpoints avec des exemples pré-configurés
   - Les requests utilisent la variable `{{url}}` qui pointera vers votre serveur local

### Endpoints disponibles dans Postman
- Résumé de tous les matchs
- Liste détaillée avec filtrage par équipe  
- Détails d'un match spécifique
- Gestion des favoris
- Création de nouveau match
- Recherche dans les matchs
- Statistiques générales
- Classement Premier League

## Développement

### Scripts disponibles
```bash
npm run start:dev    # Serveur de développement
npm run build        # Compilation TypeScript
npm run start:prod   # Serveur de production
npm run lint         # Vérification du code
npm run test:e2e     # Tests end-to-end

# Scripts utilitaires
python3 fix-utf8-encoding.py <fichier>  # Correction d'encodage UTF-8
npx ts-node src/utils/enrichData.ts     # Enrichissement des données
```

### Tests

#### Tests end-to-end
Une suite complète de tests e2e est disponible pour valider tous les endpoints :

```bash
# Lancer les tests e2e
npm run test:e2e

# Tests avec watch mode
npm run test:e2e -- --watch

# Tests avec coverage
npm run test:e2e -- --coverage
```

**Tests disponibles :**
- Récupération des matchs (détaillés et résumé)
- Filtrage par équipe
- Recherche de matchs
- Gestion des favoris
- CRUD complet des matchs
- Statistiques et classement
- Gestion d'erreurs (404, etc.)

#### Tests unitaires
Les tests unitaires restent à implémenter.

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