# WidaTech POS Invoice System

A professional, full-stack Point of Sale (POS) modular feature built for managing invoices, tracking revenue analytics, and optimizing product workflows. This project was developed as a technical challenge for the Senior Full Stack Engineer position.

## 🚀 Features

- **Dynamic Invoice Management**: Create invoices with a real-time autocomplete product search.
- **Advanced Autocomplete**: Search products as you type with instant feedback on stock, pricing, and visual thumbnails.
- **Real-time Analytics**: Interactive revenue graphs (Daily, Weekly, Monthly) with panning and zoom capabilities using Recharts.
- **Professional UI/UX**: Built with Tailwind CSS, Lucide icons, and Framer Motion for smooth transitions and a polished look.
- **Robust Backend**: Powered by NestJS and TypeORM with atomic transaction support for data integrity.
- **Lazy Loading**: Efficient data fetching using TanStack Query for invoice history pagination.

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js 19
- **State & Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js NestJS
- **ORM**: TypeORM
- **Database**: MySQL (SQLite used for portable demo environment)
- **Validation**: NestJS Pipes & DTOs

## 📂 Project Structure

```text
├── backend/                # NestJS Application
│   ├── src/
│   │   ├── modules/        # Modular Services (Invoice, Product)
│   │   ├── entities/       # TypeORM Models
│   │   └── main.ts         # API Entry Point (Port 3001)
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── hooks/          # Custom Hooks (Debounce, etc)
│   │   └── main.tsx        # Frontend Entry Point (Port 3000)
├── package.json            # Root scripts (Orchestration)
└── README.md               # Documentation
```

## 📖 API Documentation (Swagger)

The backend includes a comprehensive Swagger UI for API exploration and testing.
- **URL**: `http://localhost:3001/api/docs`
- **Features**: Interactive testing, schema definitions, and endpoint grouping.

## 📊 Database Schema (ERD Overview)

- **Invoice**: `id (UUID)`, `customerName`, `salespersonName`, `paymentType (CASH/TRANSFER)`, `totalAmount`, `date`, `notes`, `createdAt`.
- **Product**: `id (UUID)`, `name`, `picture`, `stock`, `price`.
- **InvoiceItem**: `id (UUID)`, `quantity`, `priceAtPurchase`, `invoiceId (FK)`, `productId (FK)`.

## 📋 Minimum Requirements

Before installing, ensure your environment meets the following criteria:
- **Node.js**: Version 20.x or newer (LTS recommended).
- **NPM**: Version 10.x or newer.
- **Memory (RAM)**: 1GB minimum (2GB recommended for the build process).
- **Disk Space**: ~500MB for dependencies and initial database.
- **Operating System**: Linux (Ubuntu 22.04+ recommended), macOS, or Windows with WSL2.
- **Database**: Port 3306 available (if using MySQL) or write permissions for SQLite.

## ⚙️ Deployment (Personal VM Server)

This project is optimized to run on a standalone VM (Ubuntu/CentOS/etc.) using Node.js.

1. **Install Node.js & NPM**:
   Ensure you have Node.js 20+ installed.

2. **Clone & Install**:
   ```bash
   git clone <repository-url>
   cd wida-tech-pos
   npm install
   ```

3. **Database Setup**:
   The current configuration uses SQLite (`database.sqlite`) for portability. For production MySQL, update `.env` and `src/server/data-source.ts`.

4. **Build & Run**:
   ```bash
   # Build the frontend assets
   npm run build
   
   # Start the production server
   npm start
   ```

5. **Process Management (PM2)**:
   It's recommended to use PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start npm --name "widapos" -- start
   ```

## 📊 Sample Data

The application now comes pre-seeded with the sample invoice data provided in the challenge prompt:
- Invoices for John Doe (CASH)
- Invoices for Jane Doe (CREDIT)
- Transaction notes and multi-user salesperson attribution as shown in the audit log input sample.

## ⚖️ License
This project is licensed under the Apache-2.0 License.
