# AI Caddy Pro - Documentation

Welcome to the AI Caddy Pro documentation! This golf shot calculator app helps golfers understand how environmental conditions affect their shots.

## 🎯 What Does This App Do?

AI Caddy Pro is a smart golf assistant that tells you:
- **How far your golf ball will actually travel** based on weather conditions
- **Which club to use** for any given shot
- **How wind affects your shot** (premium feature)
- **Real-time weather data** from your current location

Think of it as having a professional caddy in your pocket who understands physics!

## 📱 Main Features

### 1. Shot Calculator (Free)
The main screen where you enter how far you want to hit the ball, and the app tells you:
- How environmental conditions affect the shot
- The adjusted yardage you should expect
- Which club to use from your bag

### 2. Wind Calculator (Premium)
Advanced wind analysis that:
- Uses your phone's compass to detect wind direction
- Shows exactly how wind will push your ball sideways
- Suggests the right club accounting for wind effects

### 3. Settings & Club Manager
Customize your experience:
- Set your club distances
- Choose your preferred units (yards/meters)
- Manage your club bag
- Sync your settings to the cloud

## 🎬 Quick Start (For Complete Beginners)

### What You Need
- An iPhone or Android phone
- Internet connection for weather data
- GPS/Location services enabled

### First Time Setup
1. **Open the app** - You'll see the Shot Calculator screen
2. **Allow location access** - The app needs this to get weather data
3. **Enter a distance** - Try 150 yards (or meters)
4. **See the magic** - The app shows you the adjusted yardage based on current weather
5. **Check your club** - The app recommends which club to use

### Understanding the Results

When you see results like "150 yards → 153 yards (+3)":
- **150 yards** = Your target distance
- **153 yards** = How far the ball will actually go in current conditions
- **+3 yards** = The environmental effect (hot air, wind, altitude, etc.)

## 🧭 How It Works (Simple Explanation)

### The Weather Makes a Difference!
Golf balls travel differently based on:
- **Temperature**: Hot air = ball goes farther (less dense air)
- **Altitude**: Higher elevation = ball goes farther (thinner air)  
- **Humidity**: More humidity = ball goes slightly farther
- **Wind**: Tailwind helps, headwind hurts
- **Air pressure**: Lower pressure = ball goes farther

### The App's Brain
The app uses physics equations (called the "Magnus equation") to calculate exactly how these factors affect your shot. It's the same science that professional golfers and their caddies use!

## 📚 Documentation Structure

This documentation is organized into several guides:

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - How the app is built (for developers)
2. **[FEATURES.md](./FEATURES.md)** - Detailed feature explanations
3. **[API.md](./API.md)** - External services and APIs used
4. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Setup guide for developers
5. **[PHYSICS.md](./PHYSICS.md)** - The math and science behind calculations
6. **[TESTING.md](./TESTING.md)** - How to test the app

## 🎓 Learning Path

**If you're a golfer who wants to use the app:**
- Read this file (README.md)
- Check out [FEATURES.md](./FEATURES.md) for detailed feature guides

**If you're a developer who wants to understand the code:**
1. Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the structure
2. Read [DEVELOPMENT.md](./DEVELOPMENT.md) to set up your environment
3. Dive into [PHYSICS.md](./PHYSICS.md) to understand the calculations
4. Check [API.md](./API.md) to understand external integrations
5. Review [TESTING.md](./TESTING.md) to learn how to test your changes

## 🤔 Common Questions

### Q: Why does the app need my location?
**A:** To get accurate weather data for your current conditions. The app works best with real-time local weather!

### Q: Can I use it offline?
**A:** Partially. You can use manual weather input, but you'll need internet for automatic weather updates.

### Q: What's the difference between free and premium?
**A:** Premium unlocks the Wind Calculator with compass integration and advanced wind analysis.

### Q: How accurate are the calculations?
**A:** Very accurate! The app uses the same physics models that golf ball manufacturers and professionals use. However, actual results depend on your swing consistency.

### Q: Can I customize my club distances?
**A:** Yes! Go to Settings → Club Bag Manager to set your personal distances for each club.

## 🚀 Technologies Used (Non-Technical Summary)

- **React Native** - Allows the app to work on both iPhone and Android
- **Expo** - Makes development and updates easier
- **Weather APIs** - Provides real-time weather data
- **Supabase** - Handles user accounts and cloud sync
- **Device Sensors** - Uses GPS for location and compass for wind direction

## 💡 Tips for Best Results

1. **Keep location services on** - For accurate weather data
2. **Calibrate your clubs** - Set your personal distances in Settings
3. **Update weather regularly** - Pull down to refresh on the main screen
4. **Trust the physics** - The calculations account for multiple factors simultaneously

## 🆘 Need Help?

- **Found a bug?** - Report it on GitHub Issues
- **Have questions?** - Check the detailed documentation files
- **Want to contribute?** - See [DEVELOPMENT.md](./DEVELOPMENT.md)

## 📄 License

This project is part of the bnredo repository. See the main repository for license information.

---

**Ready to improve your golf game with science?** 🏌️‍♂️⛳

Start by opening the app and entering your target distance. The app will handle the rest!
