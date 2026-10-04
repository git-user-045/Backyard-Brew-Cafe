☕ Backyard Brew Cafe

A full-stack cafe management and customer experience platform built using **Next.js, React, TypeScript, NextAuth.js, Prisma, and SQLite**.

Backyard Brew Cafe combines a modern customer-facing cafe website with customer accounts, reservations, menu management, business operations, and administrative dashboards in a single application.

---

🔗 Repository

**GitHub Repository:**  
https://github.com/git-user-045/Backyard-Brew-Cafe

---

📌 Project Overview

**Backyard Brew Cafe** is a full-stack web application designed to digitally manage the customer experience and day-to-day operations of a cafe.

The application provides separate functionality for:

- Customers
- Cafe/Business Owners
- Platform Administrators

Customers can explore the cafe, browse the menu, make reservations, manage their profiles, and save favorite menu items.

Cafe owners can manage reservations, menu items, categories, tasks, and business-related information.

Administrators can monitor cafes, customers, subscriptions, support requests, onboarding, system health, access control, and operational metrics.

---

✨ Key Features

👤 Customer Experience

- Modern responsive cafe landing page
- Hero section and cafe introduction
- Menu preview and complete menu browsing
- Food and cafe gallery
- About and contact sections
- Table reservation system
- Reservation availability/slot management
- Customer registration and authentication
- Customer dashboard
- Reservation history and status
- Favorite menu items
- Customer profile management
- Secure sign-out functionality

🏪 Cafe Business Operations

- Owner dashboard
- Reservation management
- Menu category management
- Menu item management
- Business task management
- Cafe-specific business data
- Centralized operational dashboard

🛠️ Administration

- Admin dashboard
- Client/cafe management
- Subscription overview
- Customer and business monitoring
- Support management
- Cafe onboarding management
- System health monitoring
- Access control
- Operational metrics

---

🧑‍💻 Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js | Full-stack React framework |
| React | Frontend UI development |
| TypeScript | Type-safe application development |
| NextAuth.js | Authentication and session management |
| Prisma ORM | Database access and ORM |
| SQLite | Relational database |
| bcryptjs | Password hashing |
| Lucide React | UI icons |
| ESLint | Code quality and linting |

---

🏗️ Architecture

The project follows a modular full-stack architecture using the Next.js App Router.

```text
Backyard-Brew-Cafe/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── menu/
│   │   ├── reservations/
│   │   ├── tasks/
│   │   └── admin/
│   │
│   ├── customer/
│   ├── owner/
│   ├── admin/
│   └── ...
│
├── src/
│   ├── modules/
│   │   ├── customer-experience/
│   │   ├── business-operations/
│   │   └── admin/
│   │
│   └── lib/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
