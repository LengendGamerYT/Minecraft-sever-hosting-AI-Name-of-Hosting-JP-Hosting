# 🎮 JP Hosting - Minecraft Server Hosting Platform

A comprehensive Minecraft server hosting platform built with React, Node.js, and MongoDB. Features include user authentication, multiple hosting plans, UPI payment integration, and server management.

## ✨ Features

### 🔐 Authentication & User Management
- **Persistent Login**: Users stay logged in across sessions
- **Secure JWT Authentication**: Token-based authentication system
- **User Registration**: Easy signup process with email validation
- **Profile Management**: Users can update their profile information

### 💳 Payment & Plans
- **Multiple Hosting Plans**: From free trials to enterprise solutions
- **UPI Payment Integration**: Direct payments to `jaydendpenha@fam`
- **Indian Rupee Pricing**: Plans starting from ₹100 to ₹5000
- **QR Code Payments**: Easy mobile payments via UPI apps
- **Free Plan**: 7-day free trial for new users

### 🖥️ Server Management
- **Server Creation**: Easy server setup with multiple configurations
- **Real-time Monitoring**: Track server status and player count
- **Multiple Server Types**: Vanilla, Bukkit, Spigot, Paper, Forge, Fabric
- **Server Controls**: Start, stop, and configure servers
- **Resource Allocation**: RAM, storage, and bandwidth management

### 🎨 Beautiful UI/UX
- **Modern Design**: Glass morphism and gradient effects
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Dark Theme**: Eye-friendly dark interface
- **Smooth Animations**: Engaging user interactions
- **Custom Logo**: Professional branding throughout

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/minecraft-server-hosting-app.git
   cd minecraft-server-hosting-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/minecraft-hosting
   JWT_SECRET=your-super-secret-jwt-key
   UPI_ID=jaydendpenha@fam
   PORT=5000
   ```

5. **Start the application**
   ```bash
   # Start backend server
   npm run dev
   
   # In another terminal, start frontend
   cd client
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Mobile App (APK)

To convert this web app to an APK:

1. **Using Capacitor (Recommended)**
   ```bash
   cd client
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```

2. **Using Cordova**
   ```bash
   npm install -g cordova
   cordova create mobile-app com.jphosting.minecraft "JP Hosting"
   cd mobile-app
   cordova platform add android
   cordova build android
   ```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/         # Page components
│   │   └── ...
│   ├── public/            # Static assets
│   └── package.json
├── models/                # MongoDB models
├── routes/                # Express API routes
├── middleware/            # Custom middleware
├── server.js             # Express server
├── package.json          # Backend dependencies
└── README.md
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Plans
- `GET /api/plans` - Get all plans
- `GET /api/plans/:id` - Get specific plan
- `GET /api/plans/free/available` - Check free plan availability

### Servers
- `GET /api/servers` - Get user servers
- `POST /api/servers` - Create new server
- `GET /api/servers/:id` - Get server details
- `POST /api/servers/:id/start` - Start server
- `POST /api/servers/:id/stop` - Stop server
- `DELETE /api/servers/:id` - Delete server

### Payments
- `POST /api/payments/create-payment-intent` - Create payment
- `POST /api/payments/confirm-payment` - Confirm payment
- `GET /api/payments/history` - Payment history

## 💰 Pricing Plans

| Plan | Price | RAM | Storage | Players | Features |
|------|-------|-----|---------|---------|----------|
| **Free** | ₹0 | 1GB | 5GB | 5 | 7-day trial |
| **Starter** | ₹100/month | 2GB | 10GB | 10 | Backups |
| **Basic** | ₹250/month | 4GB | 20GB | 20 | DDoS Protection |
| **Premium** | ₹500/month | 8GB | 50GB | 50 | Custom Domain |
| **Enterprise** | ₹1000/month | 16GB | 100GB | 100 | Priority Support |
| **Ultimate** | ₹2000/month | 32GB | 200GB | 200 | Max Performance |
| **Mega** | ₹5000/month | 64GB | 500GB | 500 | Enterprise Grade |

## 🔧 Configuration

### Database Models
- **User**: Authentication and subscription data
- **Plan**: Hosting plan configurations
- **Server**: Minecraft server instances
- **Payment**: Transaction records

### Payment Integration
The app uses UPI payment system with the following features:
- Direct UPI payments to `jaydendpenha@fam`
- QR code generation for mobile payments
- Transaction ID verification
- Payment history tracking

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas or production database
3. Set secure JWT secret
4. Configure domain and SSL certificates

### Docker Deployment
```bash
# Build and run with Docker
docker-compose up --build
```

### Heroku Deployment
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and inquiries:
- **UPI ID**: jaydendpenha@fam
- **GitHub**: [Create an Issue](https://github.com/your-username/minecraft-server-hosting-app/issues)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database solution
- Tailwind CSS for the styling system
- Lucide React for the beautiful icons

---

**Built with ❤️ by JP Hosting Team**