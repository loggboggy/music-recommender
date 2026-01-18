# Music Recommender

A React-based music recommendation website that uses the Last.fm API to suggest similar songs based on user input.

## Features

- Search for songs by artist and track name
- Get 10 similar song recommendations
- View match percentage and links to Last.fm
- Responsive design for mobile and desktop

## Setup

### 1. Get a Last.fm API Key

1. Go to [Last.fm API Account Creation](https://www.last.fm/api/account/create)
2. Sign up for a free account (if you don't have one)
3. Create an API application to get your API key

### 2. Configure the API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:

```
VITE_LASTFM_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Deployment to GitHub Pages

### 1. Update Configuration

Edit `package.json` and replace `username` with your GitHub username:

```json
"homepage": "https://YOUR_USERNAME.github.io/music-recommender/"
```

### 2. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/music-recommender.git
git push -u origin main
```

### 3. Deploy

```bash
npm run deploy
```

Your site will be available at `https://YOUR_USERNAME.github.io/music-recommender/`

**Note:** For production deployment, you'll need to either:
- Hardcode your API key in `src/services/lastfm.js` (not recommended for public repos)
- Use a backend proxy to hide your API key
- Use GitHub Actions with repository secrets

## Tech Stack

- React 19
- Vite
- Last.fm API
- gh-pages for deployment

## License

MIT
