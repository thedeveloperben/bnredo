# AI Caddy Pro

A smart golf shot calculator that uses physics and real-time weather data to help golfers understand how environmental conditions affect their shots.

## 🎯 What It Does

AI Caddy Pro calculates:
- How environmental conditions (temperature, altitude, humidity, wind) affect shot distance
- Which club to use for any target distance
- Advanced wind analysis with compass integration (premium)
- Real-time weather data from your current location

## 📱 Features

- **Shot Calculator** - Environmental impact on shot distance
- **Wind Calculator** (Premium) - Advanced wind analysis with real-time compass
- **Club Manager** - Customize your club distances
- **Weather Integration** - Real-time local weather data
- **Cloud Sync** - Sync settings across devices

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build:web
```

## 📚 Documentation

Comprehensive documentation is available in the [`/docs`](./docs) folder:

- **[Getting Started (For Beginners)](./docs/README.md)** - Non-technical overview for users
- **[Architecture](./docs/ARCHITECTURE.md)** - Technical architecture and design patterns
- **[Features](./docs/FEATURES.md)** - Detailed feature explanations
- **[API Documentation](./docs/API.md)** - External services and internal APIs
- **[Development Setup](./docs/DEVELOPMENT.md)** - Setup guide for developers
- **[Physics Engine](./docs/PHYSICS.md)** - Mathematics behind calculations
- **[Testing Guide](./docs/TESTING.md)** - Testing strategy and examples

## 🛠️ Tech Stack

- **React Native** with **Expo 54**
- **TypeScript** for type safety
- **Expo Router** for file-based navigation
- **Supabase** for authentication and cloud sync
- **Open-Meteo API** for weather data
- **Jest** and **Playwright** for testing

## 🎓 For Developers

```bash
# Type check
npm run typecheck

# Lint code
npm run lint

# Run tests with coverage
npm run test:coverage

# Build native apps
npm run build:ios:sim    # iOS Simulator
npm run build:ios:device # iOS Device
```

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for complete setup instructions.

## 🏌️ For Golfers

Check out the [beginner-friendly guide](./docs/README.md) to learn:
- How to use the app
- What the calculations mean
- How weather affects your shots
- Tips for best results

## 📄 License

See the repository for license information.

## 🤝 Contributing

1. Read [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
2. Fork the repository
3. Create a feature branch
4. Make your changes
5. Add tests
6. Update documentation
7. Submit a pull request

---

**Ready to improve your golf game with science?** 🏌️‍♂️⛳
