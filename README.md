# AMX ERP System

Modern Full-Stack Enterprise Resource Planning (ERP) Platform built with **Next.js**, **NestJS**, **PostgreSQL**, **Redis**, and **AI-Powered Forecasting**.

---

# Overview

AMX ERP is a modular enterprise management platform designed to handle:

* Human Resource Management (HRM)
* Finance & Accounting
* Inventory Management
* Sales & CRM
* Reporting & Analytics
* AI Demand Forecasting

The system follows a scalable microservice-inspired architecture with separate services for:

* Frontend (Next.js)
* Backend API (NestJS)
* AI Forecasting (FastAPI + Prophet)
* PostgreSQL Database
* Redis Cache

---

# Modules

## HRM

* Employee Management
* Attendance Tracking
* Leave Management

## Finance

* Transactions
* Accounts Management
* Accounts Payable
* Accounts Receivable
* Ledger Management

## Inventory

* Inventory Management
* SKU Tracking
* Purchase Orders
* Stock Movements
* Low Stock Alerts

## Sales & CRM

* Customer Management
* Sales Orders
* Revenue Tracking

## Reports

* PDF Export
* Excel Export
* Scheduled Reports

## AI Forecasting

* Demand Prediction
* Inventory Forecasting
* Smart Reorder Recommendations

---

# Features

* Enterprise ERP Dashboard
* JWT Authentication
* Role-Based Access Control
* Multi-Tenant Architecture
* REST API Architecture
* Prisma ORM Integration
* PostgreSQL Database
* Redis Caching
* AI Forecasting Engine
* Modern Responsive UI
* Glassmorphism Dashboard Design
* Analytics & Insights
* Dockerized Deployment

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Framer Motion

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* Redis
* JWT Authentication

## AI Services

* FastAPI
* Prophet
* Pandas
* NumPy
* Scikit-Learn

## DevOps

* Docker
* Docker Compose

---

# Project Structure

```txt
amx-erp/
│
├── apps/
│   ├── api/              # NestJS Backend
│   ├── web/              # Next.js Frontend
│   └── ml-services/      # AI Forecasting Service
│
├── docker-compose.yml
│
└── README.md
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/amx-erp-system.git

cd amx-erp-system
```

---

# Environment Variables

Create:

```txt
apps/api/.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/amx_erp

JWT_SECRET=amx_super_secret

PORT=3002

REDIS_HOST=redis
REDIS_PORT=6379

ML_SERVICE_URL=http://amx-ml:8000
```

---

# Docker Deployment (Recommended)

AMX ERP supports full Docker deployment.

## Start Entire ERP System

From project root:

```bash
docker compose up -d --build
```

This starts:

* PostgreSQL
* Redis
* Backend API
* Frontend
* AI Forecasting Service

---

## Apply Database Migrations

```bash
docker exec -it amx-api npx prisma migrate deploy
```

Verify:

```bash
docker exec -it amx-api npx prisma migrate status
```

---

## Access Services

| Service                | URL                          |
| ---------------------- | ---------------------------- |
| Frontend               | http://localhost:3000        |
| Backend API            | http://localhost:3002        |
| Swagger Docs           | http://localhost:3002/docs   |
| AI Forecasting Service | http://localhost:8000/health |
| PostgreSQL             | localhost:5432               |
| Redis                  | localhost:6379               |

---

## View Running Containers

```bash
docker ps
```

---

## View Logs

Backend:

```bash
docker logs amx-api
```

Frontend:

```bash
docker logs amx-web
```

ML Service:

```bash
docker logs amx-ml
```

PostgreSQL:

```bash
docker logs amx-postgres
```

Redis:

```bash
docker logs amx-redis
```

---

## Restart Services

```bash
docker compose restart
```

Restart a specific container:

```bash
docker restart amx-api
```

---

## Stop Entire System

```bash
docker compose down
```

---

## Stop and Remove Volumes

```bash
docker compose down -v
```

⚠️ This removes database data.

---

## Rebuild After Changes

```bash
docker compose up -d --build
```

---

# Development Mode (Without Docker)

## Backend

```bash
cd apps/api
npm install
npm run start:dev
```

Runs on:

```txt
http://localhost:3002
```

---

## Frontend

```bash
cd apps/web
npm install
npm run dev
```

Runs on:

```txt
http://localhost:3000
```

---

## AI Forecasting Service

```bash
cd apps/ml-services

pip install -r requirements.txt

uvicorn main:app --reload --port 8000
```

Runs on:

```txt
http://localhost:8000
```

---

# Database Commands

Check migration status:

```bash
docker exec -it amx-api npx prisma migrate status
```

Open PostgreSQL:

```bash
docker exec -it amx-postgres psql -U postgres -d amx_erp
```

List tables:

```sql
\d
```

---

# API Features

* JWT Authentication
* Role-Based Authorization
* RESTful APIs
* Prisma ORM
* PostgreSQL Integration
* Redis Integration
* Swagger Documentation

Swagger URL:

```txt
http://localhost:3002/docs
```

---

# UI Features

* Modern ERP Dashboard
* Glassmorphism Design
* Responsive Layout
* Analytics Cards
* Smooth Animations
* Mobile Friendly UI

---

# Screenshots

The platform includes:

* Dashboard
* HRM Module
* Finance Module
* Inventory Management
* Sales CRM
* Reports Center
* AI Forecasting Dashboard

(Add screenshots here)

---

# Future Enhancements

* Email Notifications
* Advanced Analytics
* Multi-Tenant Enhancements
* Cloud Deployment
* Mobile Application
* Advanced AI Forecasting Models

---

# Author

**Saurabh Kumar**

---

# Git Commands

## Initial Setup

```bash
git init

git add .

git commit -m "Initial AMX ERP System Commit"

git branch -M main

git remote add origin https://github.com/YOUR_USERNAME/amx-erp-system.git

git push -u origin main
```

---

## Push New Changes

```bash
git add .

git commit -m "Update AMX ERP"

git push origin main
```

---

# Project Status

✅ Active Development

AMX ERP is a modern enterprise management platform featuring HRM, Finance, Inventory, Sales, Reporting, and AI-powered Forecasting with full Docker support.
