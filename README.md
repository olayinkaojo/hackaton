# ComplyNG — Nigerian Compliance Game Suite

**Microsoft AI Skills Week 2026 | RegTech Hackathon**

A fully animated, multi-career Nigerian business compliance learning game.

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## Project Structure

```
src/
├── App.jsx                     # Root routing
├── main.jsx                    # React entry point
├── styles/global.css           # Global styles + animations
├── data/
│   ├── avatars.js              # 5 career categories, 20 subcategories, 13 level dress tiers
│   ├── levels.js               # 13 levels × 5 career types = 65 unique questions
│   └── miniGames.js            # 6 advanced mini-games with 40+ deep questions
├── utils/
│   ├── drawAvatar.js           # Canvas avatar with dress upgrades + category identifiers
│   ├── drawObstacle.js         # 8 animated obstacle types (valley, hill, spear, river etc.)
│   └── drawScene.js            # 16 unique scene backgrounds (market, port, court, bank etc.)
├── hooks/
│   └── useGameState.js         # Game state management
└── screens/
    ├── SplashScreen.jsx        # Landing screen
    ├── CategoryScreen.jsx      # Career selection (5 careers)
    ├── SubcategoryScreen.jsx   # Specialty selection (4-6 per career)
    ├── GameScreen.jsx          # Main 13-level canvas game engine
    ├── MiniGamesScreen.jsx     # Advanced mini-game hub
    └── MiniGamePlayScreen.jsx  # Mini-game engine with animated canvas
```

## Game Features

- **5 Career Paths**: Business Person, Artisan, Tech Worker, Professional/9-5, Creative/Media
- **20 Subcategories**: Each with unique avatar identifier, scene background, and niche questions
- **13 Levels**: From Novice (singlet & shorts) to Compliance Legend (chairman outfit)
- **8 Obstacle Types**: Valley bridge, hill climb, descent, spear throw, river crossing, predator run, ladder build, volcano swing
- **16 Scene Backgrounds**: Market, shop, port, kitchen, construction, workshop, garage, factory, tech hub, studio, office, court, ministry, bank, stage, newsroom
- **65 Unique Questions**: Career-specific compliance scenarios across all 13 levels
- **6 Advanced Mini-Games**: Tax Master, Task Force Chase, Accounting Wizard, CRM Hero, Revenue Manager, Export Express
- **40+ Deep Q&A**: Expert-level compliance questions in mini-games
- **AI Advisor**: Powered by Claude, context-aware, knows your career and progress

## Compliance Laws Covered

CAMA 2020, Finance Acts 2019–2023, PITA, CITA, VAT Act, PRA 2014, ECA 2010, NAFDAC Act, NDPA 2023, CBN Act, NITDA Act, Nigeria Startup Act 2022, FCCPC Act 2018, Public Procurement Act 2007, FIRS Act, ITF Act, WHT Regulations, Trademarks Act, ISA 2024, NMW Act, Labour Act, ICPC Act, EFCC Act, NGX Listing Rules, PPA 2007, ICAN Code of Ethics, FRC Act, NAQS Regulations, NEPC Act, CBN Forex Manual.
