# FitFlow - Health & Habit Tracker

A comprehensive health and habit tracking web application built with React.js and Firebase.

## 🚀 Features

- **Health Tracking**: Sleep and water intake monitoring
- **Activity Management**: Track activities, diets, and hobbies
- **Calendar Integration**: Visual calendar with daily entries
- **AI Chat Assistant**: Health recommendations and guidance
- **Reminder System**: Smart notifications for goals and habits
- **Progressive Web App**: Offline support and mobile installation
- **Real-time Sync**: Firebase-powered data synchronization

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Styling**: CSS Modules with CSS Variables
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Header, Modal, etc.)
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard-specific components
│   ├── calendar/       # Calendar components
│   ├── tracking/       # Health tracking components
│   ├── detail/         # Detail page components
│   └── forms/          # Form components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── context/            # React Context providers
├── services/           # Firebase and API services
├── utils/              # Utility functions
└── styles/             # Global styles and CSS variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fitflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   npm run setup-env
   ```

   This will create a `.env.local` file with the Firebase configuration.

   **⚠️ SECURITY WARNING**: Never commit `.env.local` to Git!

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Firestore, Storage, Functions, and Cloud Messaging
3. Copy your Firebase config to `.env` file
4. Set up Firestore security rules (see `firestore.rules`)

### Environment Variables

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

## 📱 Progressive Web App

FitFlow is built as a Progressive Web App with:

- **Offline Support**: Works without internet connection
- **Installable**: Can be installed on mobile devices
- **Push Notifications**: Reminder notifications
- **Background Sync**: Syncs data when connection is restored

## 🎨 Design System

The app uses a comprehensive design system with:

- **CSS Variables**: Consistent colors, spacing, and typography
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
- **Component Library**: Reusable UI components

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy to Vercel**

   ```bash
   vercel --prod
   ```

4. **Or connect your GitHub repository to Vercel for automatic deployments**

### Environment Variables Setup

Set the following environment variables in your Vercel dashboard:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 📊 Performance

- **Lighthouse Score**: > 90
- **Bundle Size**: < 1MB
- **Load Time**: < 3 seconds
- **Firebase Operations**: < 100ms

## 🔒 Security

### Environment Variables

- **Never commit `.env.local` to Git** - This file contains sensitive Firebase credentials
- Use `npm run setup-env` to create your local environment file
- Keep your Firebase credentials secure and never share them publicly

### Firebase Security

- **Firebase Security Rules**: User data isolation
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Content Security Policy
- **HTTPS**: Secure data transmission

### Best Practices

- Use different Firebase projects for development and production
- Regularly rotate API keys and credentials
- Monitor Firebase usage and set up billing alerts
- Review and update security rules regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@fitflow.app or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Advanced analytics and insights
- [ ] Social features and sharing
- [ ] Integration with fitness trackers
- [ ] Machine learning recommendations
- [ ] Multi-language support
- [ ] Dark mode theme

---

Built with ❤️ using React and Firebase
