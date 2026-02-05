# BnRedo - Golf Shot Calculator

A premium golf shot calculator app built with Expo (SDK 54) and React Native, featuring advanced physics-based calculations with environmental adjustments.

## Features

- **Shot Distance Calculator**: Physics-based distance calculations with environmental factors
- **Wind Calculator**: Advanced wind analysis with compass integration (premium feature)
- **Weather Integration**: Real-time weather data from multiple providers
- **Club Management**: Customizable club bag with performance tracking
- **Multi-Provider Weather**: Tomorrow.io (premium) with Open-Meteo fallback

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio for mobile development

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thedeveloperben/bnredo.git
   cd bnredo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API keys** (see [API Key Setup](#api-key-setup)):
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## API Key Setup

This application requires API keys for full functionality. See detailed documentation in [`docs/API_KEY_STORAGE.md`](./docs/API_KEY_STORAGE.md).

### Required Keys

Get these from [Supabase Dashboard](https://supabase.com/dashboard):
- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional Keys

Get from [Tomorrow.io](https://www.tomorrow.io/weather-api/):
- `EXPO_PUBLIC_TOMORROW_IO_API_KEY` - Premium weather data (falls back to free Open-Meteo)

Add these to your `.env` file:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_TOMORROW_IO_API_KEY=your-tomorrow-io-key-here
```

**Important**: Restart the Expo dev server after changing `.env`.

## Available Commands

```bash
npm run dev              # Start Expo development server
npm run build:web        # Build for web deployment
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
```

## Project Structure

```
app/                     # Expo Router screens (file-based routing)
  (tabs)/               # Tab navigation
    index.tsx           # Shot calculator
    wind.tsx            # Wind calculator (premium)
    settings.tsx        # Settings
src/
  core/
    models/             # Physics models (YardageModelEnhanced)
    services/           # Environmental & wind calculations
  contexts/             # React contexts (Weather, ClubBag, Preferences)
  components/           # Reusable UI components
  services/             # External services (weather APIs)
  lib/                  # Third-party integrations (Supabase)
  constants/            # Design tokens and configuration
docs/                   # Documentation
```

## Documentation

- **[API Key Storage](./docs/API_KEY_STORAGE.md)** - How API keys are stored and managed
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant guidance for development

## Technology Stack

- **Framework**: Expo SDK 54 with React Native
- **Routing**: Expo Router (file-based)
- **Backend**: Supabase (Auth, Database)
- **Weather**: Tomorrow.io (premium) / Open-Meteo (free fallback)
- **Storage**: AsyncStorage for local data
- **Language**: TypeScript
- **Styling**: NativeWind (TailwindCSS for React Native)

## Architecture Highlights

- **Physics Engine**: Advanced ball flight modeling with Magnus effect
- **Weather Provider Orchestration**: Automatic fallback between multiple providers
- **Graceful Degradation**: App works with missing optional features
- **Type Safety**: Full TypeScript coverage with strict mode
- **Context-Based State**: React contexts for cross-cutting concerns

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Add license information]

## Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `docs/` directory
- Review `CLAUDE.md` for development guidance
