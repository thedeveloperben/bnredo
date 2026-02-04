# API Key Storage Documentation

This document explains how API keys and secrets are stored and managed in this application.

## Overview

This application uses **environment variables** for API key storage, following Expo's recommended practices for secure credential management.

## Storage Mechanisms

### 1. Environment Variables (`.env` file)

All API keys are stored in a `.env` file in the project root. This file:
- Is **automatically excluded** from version control via `.gitignore`
- Uses the `EXPO_PUBLIC_*` prefix for client-side accessibility
- Is loaded automatically by Expo SDK 49+ during development

**Location**: `/path/to/project/.env`

**Format**:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_TOMORROW_IO_API_KEY=your-tomorrow-io-api-key-here
```

### 2. Runtime Access

API keys are accessed at runtime using `process.env`:

```typescript
// Example from src/lib/supabase.ts
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Example from src/services/weather/tomorrow-adapter.ts
const key = process.env.EXPO_PUBLIC_TOMORROW_IO_API_KEY;
```

### 3. Persistent Storage (AsyncStorage)

**AsyncStorage is NOT used for API keys** - it's only used for:
- User preferences (settings)
- Weather data cache
- Manual weather overrides
- Club bag data
- Authentication session tokens (via Supabase Auth)

## API Keys in Use

### Required Keys

| Key | Purpose | Provider | Get From |
|-----|---------|----------|----------|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase backend URL | Supabase | [Project Settings](https://supabase.com/dashboard) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Supabase | [Project API Settings](https://supabase.com/dashboard) |

### Optional Keys

| Key | Purpose | Provider | Get From | Fallback |
|-----|---------|----------|----------|----------|
| `EXPO_PUBLIC_TOMORROW_IO_API_KEY` | Premium weather data | Tomorrow.io | [Tomorrow.io Dashboard](https://www.tomorrow.io/) | Open-Meteo (free) |

## Security Best Practices

### ✅ Current Implementation

1. **Environment Variables**: All keys stored in `.env` file
2. **Gitignore Protection**: `.env` is excluded from version control
3. **No Hardcoded Keys**: No keys are hardcoded in source code
4. **Public Prefix**: `EXPO_PUBLIC_*` prefix indicates client-side variables
5. **Graceful Degradation**: Optional keys have fallback mechanisms
6. **Runtime Validation**: Keys are validated before use with helpful error messages

### 🔒 Additional Security Considerations

1. **Client-Side Exposure**: `EXPO_PUBLIC_*` variables are bundled into the app and visible to users. This is acceptable for:
   - Supabase anonymous key (designed for client use with Row Level Security)
   - Weather API keys (rate-limited, low security impact)

2. **Row Level Security**: Supabase uses RLS policies to protect data even with exposed anonymous key

3. **No Server Secrets**: This is a client-side app - true server secrets should be managed via:
   - Supabase Edge Functions
   - Separate backend services with proper secret management

## Setup Instructions

### For Developers

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Fill in required keys**:
   - Get Supabase keys from your project dashboard
   - Add optional weather provider keys if desired

3. **Restart development server**:
   ```bash
   npm run dev
   ```
   Expo must be restarted after changing `.env` to load new values.

### For Production Builds

For production/deployment, set environment variables through:
- **EAS Build**: Use `eas secret:create` command
- **CI/CD**: Set as encrypted secrets in GitHub Actions/CI system
- **Expo Config**: Can use `app.config.js` for dynamic configuration

Example EAS secret setup:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"
```

## Troubleshooting

### "API key not found" errors

**Symptom**: Console warning about missing API keys

**Solutions**:
1. Ensure `.env` file exists in project root
2. Check that keys use `EXPO_PUBLIC_*` prefix
3. Restart Expo dev server (`npm run dev`)
4. Verify `.env` is not empty and has correct format

### Keys not loading

**Symptom**: `process.env.EXPO_PUBLIC_*` is `undefined`

**Solutions**:
1. Confirm Expo SDK 49+ is installed
2. Restart development server after adding `.env`
3. Check for typos in variable names
4. Ensure no quotes around values in `.env` file

### Weather provider fallback

**Symptom**: App uses Open-Meteo instead of Tomorrow.io

**Reason**: `EXPO_PUBLIC_TOMORROW_IO_API_KEY` is not configured (this is expected behavior)

**Solution**: Add key to `.env` if premium weather is needed

## Code References

- **Supabase Setup**: `src/lib/supabase.ts`
- **Tomorrow.io Adapter**: `src/services/weather/tomorrow-adapter.ts`
- **Open-Meteo Adapter**: `src/services/weather/openmeteo-adapter.ts`
- **User Preferences**: `src/contexts/UserPreferencesContext.tsx` (AsyncStorage usage)
- **Weather Context**: `src/contexts/WeatherContext.tsx` (AsyncStorage usage)

## Migration Notes

If you need to move from hardcoded keys to environment variables:

1. Extract hardcoded keys to `.env`
2. Replace with `process.env.EXPO_PUBLIC_*` references
3. Add validation/error handling for missing keys
4. Update `.gitignore` to exclude `.env`
5. Create `.env.example` with placeholder values
6. Update documentation

## Related Files

- `.env.example` - Template for environment variables
- `.gitignore` - Excludes `.env` from version control
- `CLAUDE.md` - Project overview and commands
- `README.md` - General setup instructions
