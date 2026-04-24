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
├── src/
│   ├── components/       # Reusable UI components (Form, List, Charts)
│   ├── pages/            # Page-level components
│   ├── server/           # NestJS Backend Logic
│   │   ├── entities/     # TypeORM Database Models
│   │   ├── invoice/      # Invoice Module (Controller, Service)
│   │   └── product/      # Product Module (Controller, Service)
│   └── main.tsx          # Frontend Entry Point
├── server.ts             # Main Server Entry (NestJS + Vite Middleware)
├── package.json          # Dependencies & Scripts
└── README.md             # Documentation
```

## 📊 Database Schema (ERD Overview)

- **Invoice**: `id (UUID)`, `customerName`, `salespersonName`, `totalAmount`, `date`, `notes`, `createdAt`.
- **Product**: `id (UUID)`, `name`, `picture`, `stock`, `price`.
- **InvoiceItem**: `id (UUID)`, `quantity`, `priceAtPurchase`, `invoiceId (FK)`, `productId (FK)`.

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd wida-tech-pos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file based on `.env.example` if needed (The system handles defaults automatically in the current environment).

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 📝 Usage

- **Creating an Invoice**: Navigate to the "New Invoice" tab. Start typing product names (e.g., "MacBook") to see the autocomplete in action. Fill in customer details and hit "Complete Transaction".
- **Viewing Analytics**: Go to the "Analytics" tab to view revenue trends. Use the buttons to toggle between daily, weekly, and monthly views.
- **History**: The "History" tab displays all published invoices with professional cards and summary details.

## ⚖️ License
This project is licensed under the Apache-2.0 License.
