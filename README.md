# BikeRepair - Mobile Bike Repair Service

A modern, responsive web application for on-demand bike repair services that comes to you.

## Features

- 🔐 **Authentication**: Secure sign-in/sign-up with Supabase
- 📱 **Mobile-First Design**: Responsive design optimized for mobile devices
- 🛠️ **Service Booking**: Multi-step booking process with diagnostic tools
- 📍 **Location Services**: GPS-based service location
- 👨‍🔧 **Mechanic Selection**: Choose from available mechanics
- 📅 **Booking Management**: View and manage service requests
- 💳 **Profile Management**: User profiles and subscription plans
- 🔄 **PWA Support**: Progressive Web App capabilities

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Backend**: Supabase (Auth & Database)
- **Build Tool**: Vite
- **PWA**: Vite PWA Plugin

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Mobile Testing & Deployment

### Option 1: PWA (Recommended for Quick Testing)

1. **Build and serve the app:**
   ```bash
   npm run build
   npm run preview:mobile
   ```

2. **Access on mobile device:**
   - Connect your mobile device to the same WiFi network
   - Open browser and go to: `http://[YOUR_IP]:4173`
   - Add to home screen when prompted

### Option 2: Capacitor (Native App)

1. **Install Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/android @capacitor/ios
   ```

2. **Initialize Capacitor:**
   ```bash
   npx cap init BikeRepair com.bikerepair.app
   ```

3. **Build and add platforms:**
   ```bash
   npm run build
   npx cap add android
   npx cap add ios
   ```

4. **Sync and open:**
   ```bash
   npx cap sync
   npx cap open android  # For Android
   npx cap open ios      # For iOS
   ```

### Option 3: Expo (React Native Alternative)

1. **Install Expo CLI:**
   ```bash
   npm install -g @expo/cli
   ```

2. **Create Expo project:**
   ```bash
   npx create-expo-app BikeRepairMobile --template blank-typescript
   ```

3. **Install dependencies and adapt components**

### Option 4: Netlify/Vercel Deployment

1. **Deploy to Netlify:**
   ```bash
   npm run build
   # Upload dist folder to Netlify
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

## Mobile Testing Steps

1. **Local Network Testing:**
   - Run `npm run preview:mobile`
   - Access via mobile browser using your computer's IP
   - Test all functionality on actual device

2. **PWA Installation:**
   - Open in mobile browser
   - Look for "Add to Home Screen" prompt
   - Install and test as native-like app

3. **Performance Testing:**
   - Test on different network conditions
   - Verify offline functionality (if implemented)
   - Check loading times and responsiveness

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── lib/               # Utilities and configurations
├── pages/             # Page components
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

MIT License - see LICENSE file for details