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

### Deployment Options

#### 1. Netlify Deployment

**Automatic Deployment:**
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Manual Deployment:**
```bash
npm run build
# Upload dist folder to Netlify or use Netlify CLI
npx netlify deploy --prod --dir=dist
```

#### 2. Vercel Deployment

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Vercel will auto-detect Vite configuration
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Manual Deployment:**
```bash
npm run build
# Deploy using Vercel CLI
npx vercel --prod
```

#### 3. Manual Build and Deploy
```bash
npm run build
# Upload dist folder to any static hosting service
```

### Deployment Checklist

✅ **Pre-deployment:**
- [ ] Environment variables configured
- [ ] Build completes without errors
- [ ] All routes work with SPA routing
- [ ] PWA manifest and service worker configured
- [ ] Images and assets load correctly

✅ **Post-deployment:**
- [ ] Test authentication flow
- [ ] Verify Supabase connection
- [ ] Test mobile responsiveness
- [ ] Check PWA installation
- [ ] Validate all navigation routes

### Environment Variables Setup

Both platforms require these environment variables:

   ```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Build Optimization

The app includes several optimizations for production:

- **Code splitting** for vendor and UI libraries
- **PWA support** with offline caching
- **Image optimization** for external assets
- **Security headers** for enhanced protection
- **SPA routing** with proper redirects

### Troubleshooting Deployment

**Common Issues:**

1. **404 on page refresh:**
   - Ensure SPA redirects are configured (`_redirects` for Netlify, `vercel.json` for Vercel)

2. **Environment variables not working:**
   - Verify variables are prefixed with `VITE_`
   - Check they're set in the hosting platform dashboard

3. **Build failures:**
   ```bash
npm run type-check  # Check for TypeScript errors
npm run build       # Test local build
   ```

4. **Supabase connection issues:**
   - Verify URL and key are correct
   - Check Supabase project is active
   - Ensure RLS policies allow anonymous access where needed

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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: Never commit the `.env` file to version control. Add your environment variables directly in your hosting platform's dashboard.

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