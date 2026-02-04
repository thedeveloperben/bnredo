# Development Setup Guide

Complete guide to setting up the development environment for AI Caddy Pro.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/thedeveloperben/bnredo.git
cd bnredo

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - [Download from nodejs.org](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (v9 or higher)
   - Comes with Node.js
   - Verify: `npm --version`

3. **Git**
   - [Download from git-scm.com](https://git-scm.com/)
   - Verify: `git --version`

### Platform-Specific Requirements

#### iOS Development (macOS only)
- **Xcode** 15.0 or higher
  - Install from Mac App Store
  - Install command line tools: `xcode-select --install`
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator** (included with Xcode)

#### Android Development (All platforms)
- **Android Studio**
  - [Download from developer.android.com](https://developer.android.com/studio)
  - Install Android SDK (API 34)
  - Install Android Emulator
- **Java Development Kit** (JDK 17)
  - Included with Android Studio

### Recommended Tools

- **VS Code** - Recommended IDE
  - [Download from code.visualstudio.com](https://code.visualstudio.com/)
  - Extensions:
    - ESLint
    - Prettier
    - React Native Tools
    - TypeScript and JavaScript

- **Expo Go** - Mobile app for quick testing
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/thedeveloperben/bnredo.git
cd bnredo
```

### 2. Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`, including:
- React Native & Expo
- Navigation libraries
- Supabase client
- Testing frameworks
- Development tools

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

**Required environment variables:**

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Weather API Keys (Optional)
EXPO_PUBLIC_TOMORROW_API_KEY=your-tomorrow-io-key
```

**Getting Supabase Credentials:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (or use existing)
3. Go to Settings → API
4. Copy:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 4. Database Setup

Run Supabase migrations:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push database schema
supabase db push
```

Or manually create tables using SQL from `supabase/migrations/`.

### 5. Verify Setup

```bash
# Type check
npm run typecheck

# Lint check
npm run lint

# Run tests
npm test
```

All should pass without errors.

## 🏃 Running the App

### Development Server

```bash
# Start Expo dev server
npm run dev

# With client mode (custom dev client)
npm run dev:client
```

This opens Expo DevTools in your browser:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Press `w` to open web browser
- Scan QR code with Expo Go app

### Platform-Specific Commands

#### iOS Simulator
```bash
# Start dev server for iOS
npm run dev -- --ios

# Or press 'i' after starting dev server
```

Requirements:
- macOS with Xcode installed
- iOS Simulator running

#### Android Emulator
```bash
# Start dev server for Android
npm run dev -- --android

# Or press 'a' after starting dev server
```

Requirements:
- Android Studio with emulator set up
- Emulator running (or start from Android Studio)

#### Web Browser
```bash
# Start dev server for web
npm run dev -- --web

# Or press 'w' after starting dev server
```

Opens in default browser at `http://localhost:8081`

### Physical Device Testing

#### Using Expo Go (Quick Testing)

1. Install Expo Go on your device
2. Start dev server: `npm run dev`
3. Scan QR code with:
   - iOS: Camera app
   - Android: Expo Go app

**Limitations:**
- No custom native code
- Some libraries won't work

#### Using Development Build (Full Features)

```bash
# iOS device
npm run build:ios:device

# iOS simulator
npm run build:ios:sim

# Android
npx expo run:android --device
```

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

**Writing tests:**

```typescript
// src/__tests__/example.test.ts
import { calculateWind } from '@/core/services/wind-calculator';

describe('Wind Calculator', () => {
  it('calculates headwind correctly', () => {
    const result = calculateWind(150, { speed: 10, direction: 0 });
    expect(result.carryAdjustment).toBeLessThan(0);
  });
});
```

### Component Tests

```typescript
// src/__tests__/WeatherCard.test.tsx
import { render } from '@testing-library/react-native';
import { WeatherCard } from '@/components/WeatherCard';

describe('WeatherCard', () => {
  it('renders temperature correctly', () => {
    const { getByText } = render(
      <WeatherCard temperature={75} />
    );
    expect(getByText('75°F')).toBeTruthy();
  });
});
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Interactive mode
npm run test:e2e -- --ui
```

## 🔍 Code Quality

### Linting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

**ESLint configuration:** `eslint.config.js`

### Type Checking

```bash
# Run TypeScript compiler check
npm run typecheck
```

This checks for type errors without emitting files.

### Formatting (Prettier)

```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

**Prettier configuration:** `.prettierrc`

## 🏗️ Building

### Development Builds

#### iOS
```bash
# Simulator build
npm run build:ios:sim

# Device build
npm run build:ios:device
```

#### Android
```bash
# Development APK
eas build --profile development --platform android
```

### Preview Builds

```bash
# iOS preview
npm run build:ios:preview

# Android preview
eas build --profile preview --platform android
```

Preview builds are for internal testing (TestFlight, Google Play Internal Testing).

### Production Builds

```bash
# iOS production
npm run build:ios:prod

# Android production
eas build --profile production --platform android
```

### Web Build

```bash
# Export web build
npm run build:web

# Output directory: /dist
```

Deploy to hosting service:
- Netlify
- Vercel
- Firebase Hosting
- GitHub Pages

## 📱 Device Testing Setup

### iOS Device Testing

1. **Apple Developer Account Required**
   - Free: 7-day builds
   - Paid ($99/year): Unlimited

2. **Add device to provisioning profile**
   ```bash
   eas device:create
   ```

3. **Build and install**
   ```bash
   npm run build:ios:device
   ```

### Android Device Testing

1. **Enable Developer Mode**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging**
   - Settings → Developer Options → USB Debugging

3. **Connect device via USB**
   ```bash
   # Check device connected
   adb devices
   
   # Run app on device
   npm run dev -- --android
   ```

## 🐛 Debugging

### React Native Debugger

1. **Install React Native Debugger**
   - [Download from GitHub](https://github.com/jhen0409/react-native-debugger)

2. **Start debugger** (must be running before dev server)

3. **Enable debug mode in app**
   - Shake device (or Cmd+D / Ctrl+M)
   - Select "Debug"

### Chrome DevTools

1. **Start dev server**: `npm run dev`
2. **Open debug menu** in app
3. **Select "Debug Remote JS"**
4. **Open** `http://localhost:8081/debugger-ui/` in Chrome

### VS Code Debugger

1. **Install React Native Tools** extension

2. **Add debug configuration** (`.vscode/launch.json`):
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Debug Android",
         "type": "reactnative",
         "request": "launch",
         "platform": "android"
       },
       {
         "name": "Debug iOS",
         "type": "reactnative",
         "request": "launch",
         "platform": "ios"
       }
     ]
   }
   ```

3. **Start debugging**: F5 or Debug panel

### Native Logs

#### iOS
```bash
# View iOS logs
npx react-native log-ios

# Or use Console.app on macOS
```

#### Android
```bash
# View Android logs
npx react-native log-android

# Or use Logcat in Android Studio
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Metro Bundler Cache Issues

```bash
# Clear Metro cache
npx expo start --clear

# Or manually
rm -rf node_modules/.cache
```

#### 2. CocoaPods Issues (iOS)

```bash
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

#### 3. Gradle Build Failures (Android)

```bash
cd android
./gradlew clean
cd ..
```

#### 4. Native Module Linking Issues

```bash
# Rebuild native modules
npm run prebuild

# Or completely clean
rm -rf node_modules
rm package-lock.json
npm install
```

#### 5. Expo Go Not Working

- Use development build instead:
  ```bash
  npm run build:ios:sim  # or build:ios:device
  ```

#### 6. TypeScript Errors

```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or regenerate types
npm run typecheck
```

### Performance Issues

#### Slow Metro Bundler

```bash
# Use faster watchman
brew install watchman  # macOS
```

#### Large Bundle Size

```bash
# Analyze bundle
npx expo export --platform web --dump-sourcemap
```

## 📚 Learning Resources

### Official Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

### Tutorials
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/)
- [React Native Express](https://www.reactnative.express/)
- [TypeScript for React](https://react-typescript-cheatsheet.netlify.app/)

### Community
- [Expo Forums](https://forums.expo.dev/)
- [React Native Discord](https://discord.gg/react-native)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

## 🤝 Contributing

### Code Style

- Use TypeScript for all files
- Follow ESLint rules
- Format with Prettier
- Write tests for new features
- Update documentation

### Commit Messages

Follow conventional commits:
```
feat: Add wind calculator feature
fix: Correct temperature conversion
docs: Update API documentation
test: Add unit tests for weather service
chore: Update dependencies
```

### Pull Request Process

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Update docs
6. Submit PR

### Code Review Checklist

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Performance considered
- [ ] Accessibility checked

## 🚀 Deployment

### Over-The-Air (OTA) Updates

```bash
# Publish update to Expo
eas update --branch production --message "Bug fixes"
```

Users get updates automatically (without App Store review).

### App Store Submission

#### iOS (TestFlight/App Store)

1. Build production version
2. Upload to App Store Connect
3. Fill app metadata
4. Submit for review
5. Release when approved

#### Android (Google Play)

1. Build production APK/AAB
2. Upload to Google Play Console
3. Fill app listing
4. Submit for review
5. Release when approved

## 💡 Tips & Best Practices

### Development Workflow

1. **Start with test**: Write failing test first
2. **Implement feature**: Make test pass
3. **Refactor**: Clean up code
4. **Type check**: Run `npm run typecheck`
5. **Lint**: Run `npm run lint`
6. **Manual test**: Test in simulator/device
7. **Commit**: With meaningful message

### Performance Tips

- Use `React.memo()` for expensive components
- Avoid inline functions in render
- Use `useMemo()` and `useCallback()` judiciously
- Profile with React DevTools
- Keep bundle size small

### Security Best Practices

- Never commit API keys
- Use environment variables
- Validate user input
- Sanitize data before database
- Keep dependencies updated
- Use Row Level Security in Supabase

---

**Ready to contribute?** Set up your environment and start coding! 🎉
