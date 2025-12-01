# 🐟 FISH WEB - Advanced Aquarium E-Commerce Platform

منصة تجارة إلكترونية متقدمة ومتكاملة لمستلزمات الأسماك والأحواض المائية، تجمع بين التصميم الحديث والتقنيات المتقدمة.

This project is a full-stack aquarium e-commerce platform with immersive UX, 3D visualizations, and sustainability focus.

## 🏆 Award-Winning Design Features

This project implements several cutting-edge design patterns:

- **Immersive Themes**: Switch between Day, Deep Ocean, Neon Bioluminescent, and Pastel Reef modes.
- **Micro-Interactions**: "Fish swim to cart" animations, water ripples, and bubble trails.
- **3D & AR**: Interactive 3D aquarium scenes and AR product previews.
- **Guided Commerce**: A "Fish Finder" wizard to help beginners choose the right setup.
- **Sustainability First**: Dedicated eco-friendly guides and transparency features.

## 🎨 Themes

We support multiple themes using CSS variables and Tailwind:
- **Light**: Clean, modern e-commerce look.
- **Dark**: Deep ocean vibe, reduces eye strain.
- **Neon Ocean**: Cyberpunk-inspired aquatic aesthetic.
- **Pastel**: Soft, calming colors inspired by coral reefs.
- **Monochrome**: High-contrast, minimal design.

To switch themes, use the button in the navbar.

## 🚀 Feature Flags

Features can be toggled in `src/lib/config/features.ts`:
- `enhanced3D`: Enables WebGL aquarium scenes.
- `fishFinder`: Enables the guided selection wizard.
- `arViewer`: Enables Augmented Reality product previews.
- `sustainability`: Enables eco-score and donation features.

## 🛠 Full Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type safety and better DX
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling with Vite plugin
- **Shadcn UI** - Beautiful, accessible components
- **Framer Motion** - Smooth animations
- **Three.js (R3F)** - 3D graphics and AR previews
- **React Query** - Server state management
- **Wouter** - Lightweight routing
- **Canvas Confetti** - Celebration effects

### Backend
- **Express.js** - Web framework
- **Drizzle ORM** - Type-safe database ORM
- **Neon PostgreSQL** - Serverless database
- **Express Session** - Authentication & sessions
- **Cloudflare R2** - Object storage
- **Resend** - Transactional emails

### DevOps & Deployment
- **Vercel** - Serverless deployment (recommended)
- **PM2** - Process manager (traditional deployment)
- **ESBuild** - Fast bundling
- **Vitest** - Modern testing framework
- **pnpm** - Fast, disk-efficient package manager

## 📋 Prerequisites

- **Node.js** >= 20.11.0
- **pnpm** >= 8.0.0
- **PostgreSQL** database (Neon recommended)

## 📦 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/JAAFAR1996/FIST-LIVE.git
cd FIST-LIVE
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Random secret for sessions
- `JWT_SECRET` - Secret for JWT tokens
- `VITE_SITE_URL` - Your site URL
- `RESEND_API_KEY` - API key for emails
- `R2_*` - Cloudflare R2 credentials

### 4. Setup database

```bash
pnpm db:push
```

### 5. Run development server

```bash
pnpm dev
```

Visit `http://localhost:5000`

## 🚀 Build & Deployment

### Build for production

```bash
pnpm build
```

Output:
- `dist/public/` - Frontend static files
- `dist/index.js` - Bundled server

### Deploy to Vercel (Recommended)

```bash
vercel deploy --prod
```

### Traditional deployment (VPS/Cloud)

```bash
# Using PM2
pm2 start dist/index.js --name fish-web

# Or directly
node dist/index.js
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guides.

## 🧪 Testing

```bash
pnpm test              # Run tests
pnpm test:ui           # Run with UI
pnpm test:coverage     # With coverage
pnpm test:watch        # Watch mode
```

## 📋 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production server
pnpm check        # TypeScript type checking
pnpm db:push      # Push database schema
pnpm test         # Run tests
pnpm test:ui      # Tests with UI
pnpm test:coverage # Tests with coverage
```

## 📁 Project Structure

```
FIST-LIVE/
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities & helpers
│   │   ├── pages/       # Page components
│   │   └── types/       # TypeScript types
│   └── index.html
├── server/              # Backend server
│   ├── index.ts         # Main Express server
│   ├── routes.ts        # API route handlers
│   ├── db.ts            # Database connection
│   └── storage.ts       # Database operations
├── api/                 # Vercel serverless functions
│   └── index.ts         # Serverless entry point
├── shared/              # Shared code
│   └── schema.ts        # Database schema (Drizzle)
├── dist/                # Build output
│   ├── public/          # Static files
│   └── index.js         # Bundled server
└── attached_assets/     # Static assets & uploads
```

## 🎯 Key Features

- ✅ **Complete E-Commerce** - Products, cart, checkout, orders
- 👤 **User Authentication** - Secure login & registration
- 🔍 **Advanced Search** - Filter by category, brand, price
- 📱 **Responsive Design** - Works on all devices
- 🌙 **Dark Mode** - Multiple theme options
- 📦 **Admin Dashboard** - Product & order management
- ⭐ **Reviews & Ratings** - Customer feedback system
- 🚀 **PWA Ready** - Progressive Web App support
- 🔐 **Secure** - Session-based auth & JWT
- 🎨 **Beautiful UI** - Modern design with animations
- 🐠 **3D Visualization** - Interactive product previews
- 🌱 **Sustainability** - Eco-friendly product tracking

## 🔒 Security Features

- ✅ Environment variables properly secured
- ✅ Session-based authentication
- ✅ HTTPS in production
- ✅ Input validation with Zod
- ✅ SQL injection protection (Drizzle ORM)
- ✅ XSS protection
- ✅ Structured logging for monitoring

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide (Vercel & Traditional)
- [PROJECT_ISSUES.md](./PROJECT_ISSUES.md) - Known issues & TODO list
- `.env.example` - Environment variables reference

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 📞 Contact

- **Website**: [fishweb.iq](https://fishweb.iq)
- **Email**: support@fishweb.iq

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Vercel](https://vercel.com/) - Deployment platform

---

Made with ❤️ for the Iraqi community
