# 🔥 Firebase CLI Setup Guide

## 📋 Prerequisites
- Node.js installed on your computer
- A Google account
- Your MXTM Investment website code

## 🚀 Step 1: Install Firebase CLI

\`\`\`bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
\`\`\`

## 🔐 Step 2: Login to Firebase

\`\`\`bash
# Login to your Google account
firebase login

# This will open your browser for authentication
# Follow the prompts to sign in
\`\`\`

## 🏗️ Step 3: Create Firebase Project

### Option A: Using Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "MXTM Investment" or similar
4. Enable Google Analytics (optional)
5. Wait for project creation

### Option B: Using CLI
\`\`\`bash
# Create new project
firebase projects:create mxtm-investment --display-name "MXTM Investment"
\`\`\`

## ⚙️ Step 4: Initialize Firebase in Your Project

\`\`\`bash
# Navigate to your project directory
cd your-mxtm-investment-folder

# Initialize Firebase
firebase init

# Select these services:
# ✅ Firestore: Configure security rules and indexes
# ✅ Hosting: Configure files for Firebase Hosting
# ✅ Storage: Configure security rules for Cloud Storage
# ✅ Emulators: Set up local emulators

# Follow the prompts:
# - Use existing project: Select your MXTM Investment project
# - Firestore rules: Use default (firestore.rules)
# - Firestore indexes: Use default (firestore.indexes.json)
# - Public directory: Enter "out"
# - Single-page app: Yes
# - Automatic builds: No
# - Storage rules: Use default (storage.rules)
# - Emulators: Select Auth, Firestore, Storage, Hosting
\`\`\`

## 🔧 Step 5: Configure Your Project

### Update Firebase Config
1. Go to Firebase Console → Project Settings → General
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Register your app with name "MXTM Investment Web"
5. Copy the config object
6. Update `lib/firebase-config.ts` with your actual config:

\`\`\`typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};
\`\`\`

## 🛡️ Step 6: Set Up Firestore Database

\`\`\`bash
# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
\`\`\`

### Enable Firestore in Console:
1. Go to Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your preferred location

## 📦 Step 7: Set Up Storage

\`\`\`bash
# Deploy storage rules
firebase deploy --only storage
\`\`\`

### Enable Storage in Console:
1. Go to Firebase Console → Storage
2. Click "Get started"
3. Review security rules
4. Choose storage location

## 🧪 Step 8: Test with Emulators (Development)

\`\`\`bash
# Start Firebase emulators
firebase emulators:start

# This will start:
# - Firestore Emulator: http://localhost:8080
# - Auth Emulator: http://localhost:9099
# - Storage Emulator: http://localhost:9199
# - Hosting Emulator: http://localhost:5000
# - Emulator UI: http://localhost:4000
\`\`\`

## 🚀 Step 9: Build and Deploy

\`\`\`bash
# Build your Next.js app
npm run build

# Deploy to Firebase Hosting
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only storage
\`\`\`

## 🔍 Step 10: Verify Deployment

1. **Check Hosting**: Visit your Firebase hosting URL
2. **Test Registration**: Create a new user account
3. **Check Firestore**: Go to Firebase Console → Firestore to see user data
4. **Test Features**: Try deposit, withdrawal, verification

## 📊 Useful Firebase CLI Commands

\`\`\`bash
# View project info
firebase projects:list
firebase use --add

# Check deployment status
firebase hosting:channel:list

# View logs
firebase functions:log

# Backup Firestore
firebase firestore:export gs://your-bucket/backup

# Import data
firebase firestore:import gs://your-bucket/backup

# Manage users
firebase auth:export users.json
firebase auth:import users.json
\`\`\`

## 🛠️ Development Workflow

### Local Development
\`\`\`bash
# Start emulators
firebase emulators:start

# In another terminal, start Next.js
npm run dev
\`\`\`

### Production Deployment
\`\`\`bash
# Build and deploy
npm run build
firebase deploy
\`\`\`

## 🔐 Environment Variables

Create `.env.local` for local development:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
\`\`\`

## 🎯 Key Benefits of Firebase CLI

### 🚀 **Deployment**
- One-command deployment
- Automatic SSL certificates
- Global CDN hosting
- Custom domain support

### 🧪 **Development**
- Local emulators for testing
- Hot reload with emulators
- Offline development
- Data import/export

### 🛡️ **Security**
- Firestore security rules
- Storage access control
- Authentication management
- User permissions

### 📊 **Management**
- Database backups
- User management
- Analytics integration
- Performance monitoring

## 🆘 Troubleshooting

### Common Issues:

**1. Permission Denied**
\`\`\`bash
firebase login --reauth
\`\`\`

**2. Project Not Found**
\`\`\`bash
firebase use --add
# Select your project
\`\`\`

**3. Build Errors**
\`\`\`bash
# Clear cache
rm -rf .next
rm -rf out
npm run build
\`\`\`

**4. Emulator Issues**
\`\`\`bash
# Kill all processes
firebase emulators:exec --only firestore "echo 'done'"
\`\`\`

## 🎉 You're All Set!

Your MXTM Investment platform now has:
- ✅ **Full Firebase Integration**
- ✅ **Real-time Database**
- ✅ **Secure File Storage**
- ✅ **Professional Hosting**
- ✅ **Development Emulators**
- ✅ **Production Deployment**

Visit your Firebase Console to monitor users, transactions, and system health!
