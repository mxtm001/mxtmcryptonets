# Firebase Data Storage Locations

## 🔥 Where to Find Your Data in Firebase Console

### 1. **Access Firebase Console**
\`\`\`
URL: https://console.firebase.google.com
Project: Your MXTM Investment Project
\`\`\`

### 2. **Firestore Database Collections**

Navigate to **Firestore Database** → **Data** tab to see these collections:

#### **📊 Login Activities Collection**
\`\`\`
Collection: login_activities
Location: /login_activities/{documentId}

Document Structure:
{
  id: "auto-generated-id",
  userId: "user-document-id",
  userEmail: "user@example.com",
  userName: "John Doe",
  loginTime: timestamp,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  success: true/false
}
\`\`\`

#### **👤 User Activities Collection**
\`\`\`
Collection: user_activities
Location: /user_activities/{documentId}

Document Structure:
{
  id: "auto-generated-id",
  userId: "user-document-id",
  userEmail: "user@example.com",
  action: "LOGIN" | "LOGOUT" | "DEPOSIT" | "WITHDRAWAL" | etc,
  details: "Detailed description of action",
  timestamp: timestamp,
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0..."
}
\`\`\`

#### **⚙️ Site Settings Collection**
\`\`\`
Collection: site_settings
Document ID: main
Location: /site_settings/main

Document Structure:
{
  id: "main",
  maintenanceMode: false,
  allowRegistrations: true,
  autoApproveWithdrawals: false,
  emailNotifications: true,
  maxWithdrawalAmount: 100000,
  minDepositAmount: 100,
  siteName: "MXTM Investment Platform",
  supportEmail: "support@mxtminvestment.com",
  updatedAt: timestamp,
  updatedBy: "admin@example.com"
}
\`\`\`

#### **👥 Users Collection**
\`\`\`
Collection: users
Location: /users/{userId}

Document Structure:
{
  id: "auto-generated-id",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  country: "United States",
  balance: 12000,
  isVerified: true,
  isBlocked: false,
  lastLogin: timestamp,
  createdAt: timestamp,
  blockedAt: timestamp (if blocked),
  blockedBy: "admin@example.com" (if blocked),
  blockReason: "Reason for blocking" (if blocked)
}
\`\`\`

#### **💰 Transactions Collection**
\`\`\`
Collection: transactions
Location: /transactions/{transactionId}

Document Structure:
{
  id: "auto-generated-id",
  userId: "user-document-id",
  userEmail: "user@example.com",
  type: "deposit" | "withdrawal",
  amount: 1000,
  currency: "EUR",
  method: "Bitcoin" | "Bank Transfer" | etc,
  status: "pending" | "completed" | "rejected",
  date: timestamp,
  createdAt: timestamp
}
\`\`\`

#### **📈 Investments Collection**
\`\`\`
Collection: investments
Location: /investments/{investmentId}

Document Structure:
{
  id: "auto-generated-id",
  userId: "user-document-id",
  userEmail: "user@example.com",
  planName: "Basic Plan",
  amount: 5000,
  duration: "30 days",
  profit: 500,
  status: "active" | "completed",
  startDate: timestamp,
  endDate: timestamp,
  createdAt: timestamp
}
\`\`\`

### 3. **How to View Data in Firebase Console**

#### **Step 1: Open Firebase Console**
1. Go to https://console.firebase.google.com
2. Select your MXTM Investment project
3. Click on "Firestore Database" in the left sidebar

#### **Step 2: Navigate Collections**
1. Click on "Data" tab
2. You'll see all collections listed:
   - `login_activities`
   - `user_activities` 
   - `site_settings`
   - `users`
   - `transactions`
   - `investments`

#### **Step 3: View Login Activities**
1. Click on `login_activities` collection
2. You'll see all login attempts with:
   - User email and name
   - Login timestamp
   - Success/failure status
   - IP address and browser info

#### **Step 4: View User Activities**
1. Click on `user_activities` collection
2. You'll see all user actions:
   - Registration events
   - Login/logout events
   - Transaction attempts
   - Profile updates
   - Admin actions (block/unblock)

#### **Step 5: Monitor Site Settings**
1. Click on `site_settings` collection
2. Click on the `main` document
3. You'll see current site configuration:
   - Maintenance mode status
   - Registration settings
   - Withdrawal settings
   - Email notification settings

### 4. **Real-Time Monitoring**

#### **Live Updates**
- Firebase Console shows real-time data
- New logins appear instantly
- User activities update in real-time
- No need to refresh the page

#### **Filtering and Searching**
\`\`\`
In Firebase Console, you can:
- Filter by user email
- Sort by timestamp
- Search specific actions
- Export data to CSV/JSON
\`\`\`

### 5. **Data Backup Locations**

#### **LocalStorage Backup**
If Firebase is unavailable, data is also stored in browser localStorage:

\`\`\`javascript
// Browser Developer Tools → Application → Local Storage
localStorage.getItem('login_activities')
localStorage.getItem('user_activities')
localStorage.getItem('site_settings')
localStorage.getItem('users')
localStorage.getItem('transactions')
localStorage.getItem('investments')
\`\`\`

### 6. **Security Rules**

Your Firestore security rules should allow admin access:

\`\`\`javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin full access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Specific rules for login activities
    match /login_activities/{activityId} {
      allow read, write: if true; // Adjust based on your needs
    }
    
    // Specific rules for user activities
    match /user_activities/{activityId} {
      allow read, write: if true; // Adjust based on your needs
    }
  }
}
\`\`\`

### 7. **Monitoring Dashboard URLs**

#### **Firebase Console Sections:**
\`\`\`
Main Dashboard: https://console.firebase.google.com/project/YOUR_PROJECT_ID
Firestore Data: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore/data
Authentication: https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication/users
Analytics: https://console.firebase.google.com/project/YOUR_PROJECT_ID/analytics
\`\`\`

#### **Your Admin Panel:**
\`\`\`
Local Admin: http://localhost:3000/admin/login
Production Admin: https://your-domain.com/admin/login
\`\`\`

### 8. **Data Export Options**

#### **From Firebase Console:**
1. Select any collection
2. Click "Export" button
3. Choose format (JSON/CSV)
4. Download complete data

#### **Programmatic Export:**
\`\`\`javascript
// Export all login activities
const loginActivities = await adminService.getLoginActivities(1000)
console.log(JSON.stringify(loginActivities, null, 2))
