# SmartInv Frontend | Modern Order & Inventory Management UI

A powerful, high-performance UI for managing inventory and order fulfillment. Built with **Next.js**, **Tailwind CSS**, and **Redux Toolkit** to deliver a seamless management experience.

## 🚀 Repositories & Live Demo
- **Live Demo:** [order-management-frontend-nine.vercel.app](https://order-management-frontend-nine.vercel.app/)
- **Frontend Repository:** [github.com/apponislam/OrderManagement-Frontend.git](https://github.com/apponislam/OrderManagement-Frontend.git)
- **Backend Repository:** [github.com/apponislam/OrderManagement-Backend.git](https://github.com/apponislam/OrderManagement-Backend.git)

---

## ✨ Key Features

### 📦 Dashboard & Overview
- **Statistics:** Real-time summary of today's revenue, total orders, pending orders, and low-stock items.
- **System Activity Log:** Paginated list of all system actions for auditing.
- **Restock Queue:** Priority list of items that need immediate replenishment based on thresholds.

### 🛒 Order Fulfillment
- **Smart Cart:** Dynamic order creation with stock validation.
- **Status Selection:** Smooth dropdown-based order lifecycle management.
- **Modern Cancellation:** Non-intrusive `sonner` toast confirmation for order cancellation.

### 🔐 Secure & Responsive
- **JWT Auth:** Integrated with Redux Persist for persistent sessions.
- **Role-Based Views:** Optimized UI for Admins and Managers.
- **Fully Responsive:** Beautifully designed for all screen sizes with Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **State Management:** Redux Toolkit & RTK Query
- **Styling:** Tailwind CSS & Shadcn UI
- **Icons:** Lucide React
- **Notifications:** Sonner

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- Backend API (running on port 5000)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_BASE_API=http://localhost:5000
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.
