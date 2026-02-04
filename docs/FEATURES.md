# Features Documentation

Comprehensive guide to all features in AI Caddy Pro.

## 📊 Feature Overview

| Feature | Status | Premium | Description |
|---------|--------|---------|-------------|
| Shot Calculator | ✅ Live | Free | Environmental impact on shot distance |
| Wind Calculator | ✅ Live | Premium | Advanced wind analysis with compass |
| Club Manager | ✅ Live | Free | Customize club distances |
| Weather Integration | ✅ Live | Free | Real-time weather data |
| Cloud Sync | ✅ Live | Free | Sync settings across devices |
| Manual Weather Override | ✅ Live | Free | Set custom conditions |

## 🎯 Shot Calculator (Main Screen)

### Purpose
Calculate how environmental conditions affect your golf shots and recommend the optimal club.

### How It Works

1. **Enter Target Distance**
   - Use slider or manual input
   - Range: 50-300 yards (or meters)
   - Real-time calculation as you adjust

2. **Select Your Skill Level**
   - Beginner (90% consistency)
   - Intermediate (95% consistency)
   - Advanced (98% consistency)
   - Professional (100% consistency)

3. **View Results**
   ```
   Target: 150 yards
   Adjusted: 153 yards (+3)
   Environmental: +2.0% (heat + altitude)
   Club: 7-Iron
   ```

### Environmental Factors Considered

#### Temperature
- **Hot weather** (>75°F / 24°C): Ball travels farther
  - Less dense air = less resistance
  - ~2 yards per 10°F increase
- **Cold weather** (<50°F / 10°C): Ball travels shorter
  - Denser air = more resistance
  - ~2 yards per 10°F decrease

#### Altitude
- **Sea level**: Standard distance
- **High elevation** (>3000 ft): Ball travels farther
  - ~5% more distance per 2000 ft
  - Example: Denver (+5000 ft) = +12% distance

#### Humidity
- **High humidity** (>70%): Ball travels slightly farther
  - ~0.5% increase
- **Low humidity** (<30%): Ball travels slightly shorter

#### Air Pressure
- **High pressure** (>30.2 inHg): Ball travels shorter
- **Low pressure** (<29.8 inHg): Ball travels farther

### Weather Data Display

The weather card shows:
- 🌡️ Temperature (°F or °C)
- 💧 Humidity (%)
- 🏔️ Altitude (ft or m)
- 🎈 Pressure (inHg or hPa)
- 💨 Wind Speed & Direction
- 📍 Location Name

**Pull down to refresh** for latest conditions.

### Club Recommendations

The app suggests clubs based on:
- Your customized club distances (from Settings)
- Adjusted yardage after environmental factors
- Your personal club bag configuration

Example:
```
Target: 150 yards
Conditions: Hot day (95°F), altitude 5000 ft
Adjusted: 159 yards (+9)
Suggested: Switch from 7-iron to 8-iron
```

## 💨 Wind Calculator (Premium)

### Purpose
Advanced wind analysis with real-time compass integration to determine exact wind effects on your shot.

### Key Features

#### 1. Compass-Based Wind Direction
- Uses device's built-in compass
- Shows current heading in real-time
- Visual compass display with wind direction indicator
- Calculates relative wind angle automatically

#### 2. Wind Speed Input
- Manual wind speed entry
- Wind gust detection from weather data
- Units: MPH or KM/H based on preferences

#### 3. Wind Effect Calculation

The app calculates:

**Headwind/Tailwind Effect (Carry Distance)**
- Headwind: Reduces carry distance
- Tailwind: Increases carry distance
- Formula accounts for wind gradient (wind speed increases with altitude)

**Crosswind Effect (Lateral Movement)**
- Left-to-right or right-to-left push
- Displayed in yards/meters
- Helps with aim adjustment

#### 4. Recursive Club Selection

**Problem**: Wind affects distance, which might require a different club, which changes trajectory, which changes wind effect...

**Solution**: The app iteratively solves this:
```
1. Start with initial club for target distance
2. Calculate wind effect for that club's trajectory
3. Calculate new effective distance needed
4. Select club for new distance
5. Repeat until convergence (usually 2-3 iterations)
6. Return final club recommendation
```

### Wind Calculation Example

```
Target: 150 yards
Wind: 15 MPH headwind (straight into face)
Current club: 7-iron (150 yard carry)

Step 1: Calculate 7-iron wind effect
  - 15 MPH headwind reduces carry by ~12 yards
  - Need 162 yards carry to reach target
  
Step 2: Select club for 162 yards
  - 6-iron (165 yards) is closest
  
Step 3: Recalculate with 6-iron trajectory
  - 6-iron has higher ball flight
  - More wind exposure
  - Wind effect: -14 yards
  - Need 164 yards carry
  
Step 4: Converged!
  - 6-iron with 164-yard carry
  - Accounts for 14-yard headwind effect
  
Result: Use 6-iron (instead of 7-iron)
        Aim dead at pin
        Ball will land at target
```

### Wind Visualization

**Compass Display:**
- Green arrow: Your target direction
- Red arrow: Wind direction
- Number: Relative wind angle (0° = headwind, 180° = tailwind)

**Wind Strength Colors:**
- 🟢 0-10 MPH: Light (minimal effect)
- 🟡 10-20 MPH: Moderate (noticeable effect)
- 🟠 20-30 MPH: Strong (significant adjustment needed)
- 🔴 30+ MPH: Severe (consider not playing!)

## ⚙️ Settings & Configuration

### User Profile
- Email/password authentication via Supabase
- Anonymous mode supported (local-only)
- Cloud sync when logged in

### Unit Preferences

Choose your preferred units:
- **Distance**: Yards or Meters
- **Speed**: MPH or KM/H
- **Temperature**: Fahrenheit or Celsius
- **Pressure**: inHg or hPa

All calculations automatically convert based on preferences.

### Club Bag Manager

#### Default Clubs
The app includes 13 standard clubs with physics-based distances:

| Club | Default Distance (yards) |
|------|-------------------------|
| Driver | 250 |
| 3-Wood | 230 |
| 5-Wood | 210 |
| 3-Hybrid | 200 |
| 4-Iron | 190 |
| 5-Iron | 180 |
| 6-Iron | 170 |
| 7-Iron | 160 |
| 8-Iron | 150 |
| 9-Iron | 140 |
| Pitching Wedge | 130 |
| Gap Wedge | 115 |
| Sand Wedge | 100 |
| Lob Wedge | 85 |

#### Customization Options

1. **Edit Distances**
   - Tap any club to edit
   - Enter your personal carry distance
   - App uses this for recommendations

2. **Enable/Disable Clubs**
   - Toggle clubs you don't carry
   - Disabled clubs won't appear in recommendations

3. **Reorder Clubs**
   - Drag to reorder (future feature)
   - Match your actual bag layout

4. **Reset to Defaults**
   - Restore factory distances
   - Useful if you want to start over

#### Cloud Sync

When logged in:
- ✅ Club distances sync across devices
- ✅ Automatic backup
- ✅ Restore on new device
- ✅ Always up-to-date

When anonymous:
- 📱 Local storage only
- ⚠️ Lost if app deleted
- 🔄 No cross-device sync

### Weather Provider Settings

Choose your weather data source:

#### Open-Meteo (Default - Free)
- ✅ No API key required
- ✅ Reliable global coverage
- ✅ 5-minute update frequency
- ✅ Includes wind data

#### Tomorrow.io (Premium)
- 🔑 Requires API key
- ⚡ Faster updates
- 🎯 More accurate hyperlocal data
- 💰 Paid service

#### Manual Override
- 🛠️ Set custom weather conditions
- 🧪 Test different scenarios
- 📚 Learning tool
- ⚠️ Bypasses automatic updates

## 🎨 UI/UX Features

### Dark Theme
- Optimized for outdoor use
- Reduces battery drain
- Better contrast in bright sunlight
- Eye-friendly in low light

### Haptic Feedback
- Subtle vibrations on slider adjustments
- Confirms button presses
- Enhances tactile experience
- Can be disabled via system settings

### Animations
- Smooth transitions between screens
- Loading skeletons for async data
- Respects "Reduce Motion" accessibility setting
- 60 FPS performance target

### Accessibility
- Large touch targets (44x44 pt minimum)
- High contrast text
- Screen reader support
- Reduce motion support
- Adjustable text size

## 🔄 Data Sync & Persistence

### Local Storage (AsyncStorage)
- Club distances
- User preferences
- Last known location
- Weather cache (5 min)
- Auth session token

### Cloud Storage (Supabase)

**Tables:**
```sql
-- User club customizations
user_clubs (
  user_id,
  club_name,
  distance,
  enabled
)

-- User preferences
user_preferences (
  user_id,
  units,
  skill_level,
  weather_provider,
  is_premium
)
```

**Sync Strategy:**
1. Load from local storage (instant)
2. Fetch from cloud in background
3. Merge conflicts (cloud wins)
4. Update UI seamlessly

## 🔐 Premium Features

### What's Included
- ✅ Wind Calculator with compass integration
- ✅ Advanced wind analysis
- ✅ Recursive club selection
- ✅ Lateral movement calculations
- ✅ Priority support

### Coming Soon (Premium)
- 📊 Shot history tracking
- 📈 Performance analytics
- 🎯 Handicap calculator
- 🏌️ Swing tempo analyzer
- 🤖 AI-powered club recommendations

## 📱 Platform-Specific Features

### iOS
- Native haptic engine (Taptic Engine)
- Core Location for precise GPS
- HealthKit integration (future)
- Apple Watch companion (future)

### Android
- Material Design 3 components
- Fused Location Provider
- Wear OS companion (future)
- Google Fit integration (future)

### Web
- Progressive Web App (PWA)
- Desktop-optimized layout
- Keyboard shortcuts
- Offline support (service workers)

## 🎓 Pro Tips

### For Best Accuracy
1. Calibrate your clubs on a calm day
2. Update weather frequently
3. Use manual override to test conditions
4. Trust the physics – don't second-guess

### Common Mistakes
❌ Forgetting to update club distances
❌ Not refreshing weather data
❌ Ignoring altitude effects
❌ Using wrong skill level

✅ Keep clubs calibrated
✅ Refresh before each round
✅ Check altitude at new courses
✅ Be honest about skill level

### Advanced Techniques
- **Pre-round Setup**: Set manual weather for different holes
- **Wind Practice**: Use manual wind to learn effects
- **Altitude Training**: See how your home course compares to destinations
- **Club Gapping**: Analyze spacing between club distances

## 🐛 Troubleshooting

### Weather Not Loading
1. Check internet connection
2. Enable location services
3. Pull down to refresh
4. Try manual override mode

### Inaccurate Calculations
1. Verify club distances are correct
2. Check skill level setting
3. Ensure weather data is current
4. Recalibrate compass (figure-8 motion)

### Compass Not Working
1. Calibrate compass (wave phone in figure-8)
2. Move away from magnetic interference
3. Ensure location permission is granted
4. Restart app

### Sync Issues
1. Check internet connection
2. Verify logged in to Supabase
3. Force sync in Settings
4. Re-login if needed

---

**Questions?** Check the [README](./README.md) or [DEVELOPMENT](./DEVELOPMENT.md) docs!
