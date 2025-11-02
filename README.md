# Moviestat Web App (v2.0)

The web platform allows users to rate movies and TV series. Based on user ratings, personal statistics and infographics are generated and updated.

**Live demo:** https://moviestat.vercel.app/

---

## Features (available after authentication)

- Search and rate movies/TV series
- View all rated titles in a table
- Sorting and filtering for stats and ratings
- Interactive details page for each rated title


## Infographics Sections

### Movie Table
- All titles rated by the user

### General
- Genres
- Countries of production
- Spoken languages
- Release years
- Decade ranges

### Personalities
- Directors
- Producers
- Writers / Screenplay
- Composers
- Actors / Actresses


## Infographics Data & Settings

- Sorting & filtering options
- Appearance count
- Appearance percentage
- Average user rating
- Minimum appearance threshold (for personalities)
- Table or tile view (for personalities)


## Sort Options

### Movie Table
- Recently / earliest rated
- User rating (ascending / descending)
- Release year (ascending / descending)
- IMDb rating (ascending / descending)
- IMDb user votes (ascending / descending)

### Other Statistics
- Quantity (ascending / descending)
- Rating (ascending / descending)
- Alphabetical: A–Z (0–9) / Z–A (9–0)


## Filter Options

- User rating range
- Favorites only
- Movies / TV series
- Individual infographic items

---

## Tech Stack

- JavaScript
- **MEVN stack**: MongoDB v8 + Express v5 + Vue 3 / Nuxt v4 + Node v22
- SASS

---

## Environment / Configuration

| Component | Path | Default URL / Config |
|----------|------|----------------------|
| Client   | `/client` | `runtimeConfig.public.apiBase = http://localhost:3000/` |
| Server   | `/server` | `http://localhost:3001/` |

---

## Getting Started

### 1. Clone & install
```bash
git clone https://github.com/snstanislav/moviestat.git
cd moviestat
npm install
```

### 2. Server setup
```bash
cd server
npm install
cd ..
```

### 3. Client setup (Nuxt)
```bash
cd client
npm install
cd ..
```

### 4. Run the app
```bash
npm run dev
```

The app will be available at: **http://localhost:3000**
