# Brightloop Subscription Management System

Starter repository for the Brightloop Software subscription-management coding challenge.

## Current stack (provisional)
- Frontend: React + Vite
- Backend: Java + Spring Boot (Maven)
- Database: MySQL

The stack and module ownership should be confirmed by the team before substantial implementation.

## Repository structure

```text
brightloop-subscription-system/
├── frontend/                 # React application
├── backend/                  # Spring Boot REST API
├── database/                 # SQL schema and seed data
├── docs/                     # API contracts, architecture and team notes
├── .gitignore
└── README.md
```

## Prerequisites
- Git
- Node.js LTS and npm
- JDK 21 or newer
- MySQL 8.x

## Run locally

### 1. Database
Create a MySQL database, for example:

```sql
CREATE DATABASE brightloop;
```

Copy `backend/src/main/resources/application-example.properties` to
`backend/src/main/resources/application.properties` and update the database
username/password. Do not commit real credentials.

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

The API will run at `http://localhost:8080`.

### 3. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will print the local development URL (normally `http://localhost:5173`).

## Team collaboration

- Keep the submitted solution in the required repository branch (`main`, unless
  the organizers clarify otherwise).
- Agree on module/file ownership before parallel coding.
- Pull the latest `main` before starting work and before pushing.
- Make small, meaningful commits; do not commit passwords, `.env` files,
  build output, `node_modules`, or IDE folders.
- Coordinate edits to shared files such as `pom.xml`, `package.json`,
  application configuration and common frontend components.

## Initial module boundaries

- `auth`: registration, login, password reset and roles
- `catalog`: products, variants, plans and taxes
- `subscriptions`: quotations, templates and subscription lifecycle
- `billing`: invoices, recurring billing, payments and reporting

These are starter package boundaries, not a final architecture. Agree on API
contracts and database ownership before implementing cross-module features.

## Important
This is a scaffold, not a completed application. Authentication, authorization,
validation, billing schedules, invoice generation, payment handling, email
delivery, reporting and production security still need to be implemented and
tested.
