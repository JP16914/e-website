# E-Commerce Frontend

This is a Next.js 14 frontend for an e-commerce platform.

## Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

## Features

-   **Public**: Home, Product Listing (Filtering/Sorting), Product Detail, Cart.
-   **Auth**: Login, Signup, Guest Cart Support.
-   **User**: Checkout, Order Success, Account (Orders, Addresses).
-   **Admin**: Dashboard, Product Management.

## Tech Stack

-   Next.js 14 (App Router)
-   TypeScript
-   Tailwind CSS
-   Zustand (State Management)
-   React Hook Form + Zod
-   Lucide React (Icons)
