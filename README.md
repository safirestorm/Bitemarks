# Bitemarks

En React Native app til at gemme og review dine favorit spisesteder.

## Forudsætninger

- [Node.js](https://nodejs.org/) installeret
- [Expo Go](https://expo.dev/go) på din telefon, eller en iOS/Android emulator
- En Google Maps API-nøgle med **Geocoding API** aktiveret ([opret her](https://console.cloud.google.com/))

## Kom i gang

1. Clone projektet:
   ```bash
   git clone https://github.com/safirestorm/Bitemarks.git
   cd Bitemarks
   ```

2. Installér afhængigheder:
   ```bash
   npm install
   ```

3. Opret din konfigurationsfil ved at kopiere eksemplet:
   ```bash
   cp config.example.js config.js
   ```

4. Åbn `config.js` og indsæt din Google Maps API-nøgle:
   ```js
   export const GOOGLE_MAPS_API_KEY = "DIN_NØGLE_HER"
   ```

5. Start appen:
   ```bash
   npx expo start
   ```

6. Scan QR-koden med Expo Go, eller tryk `i` for iOS-simulator / `a` for Android-emulator.
