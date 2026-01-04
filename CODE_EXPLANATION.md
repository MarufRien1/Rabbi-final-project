# AgroMart - Codebase Explanation

## Project Architecture
AgroMart is built using **Next.js 14+ (App Router)**, which allows us to handle both the Frontend (UI) and Backend (API) within a single project structure.

### 1. Frontend (Client-Side)
The user interface is built with **React** components located in the `app/` directory.

*   **App Router (`app/`)**: We use the file-system based router. Each folder with a `page.jsx` represents a route (e.g., `app/cart/page.jsx` -> `/cart`).
*   **Key Technologies**:
    *   **React Hooks**: Used extensively (`useState`, `useEffect`) for state management (cart, user session) and side effects (fetching data).
    *   **Tailwind CSS**: Utility-first CSS for rapid and responsive styling.
    *   **Material UI & Framer Motion**: Used for icons and smooth animations.
*   **State Management**:
    *   **Local/Session Storage**: Used to persist user login sessions (`currentUser`, `currentFarmer`) and cart data (`cart`) across page reloads.

### 2. Backend (Server-Side)
The backend logic resides in `app/api/`. These are **Serverless Functions** that handle database operations.

*   **API Routes (`app/api/`)**:
    *   `api/auth/`: Handles login and signup requests.
    *   `api/products/`: CRUD operations for products (GET all, POST new, DELETE).
    *   `api/orders/`: Handles order creation and fetching orders for specific users/farmers.
*   **Database (Prisma & SQLite)**:
    *   **Prisma ORM**: We use Prisma to interact with the database using JavaScript instead of raw SQL.
    *   **Schema (`prisma/schema.prisma`)**: Defines our data models (`User`, `Product`, `Order`, `OrderItem`) and their relationships.
    *   **SQLite**: A lightweight, file-based database used for storing all application data.

### 3. Data Flow Example: "Placing an Order"
1.  **Frontend**: User clicks "Checkout" in `CartPage`. The app checks `localStorage` for a logged-in user.
2.  **Frontend**: User enters payment info in `PaymentPage`. On submit, the app sends a `POST` request to `/api/orders` with the cart items and user ID.
3.  **Backend**: The API route receives the request, validates it, and uses `prisma.order.create()` to save the order and `prisma.orderItem.createMany()` to save the items in the database.
4.  **Frontend**: Upon success (HTTP 200), the UI shows a success message and clears the cart.

### 4. Key Files
*   `app/page.jsx`: The main landing page.
*   `lib/prisma.js`: A singleton instance of the Prisma Client to prevent multiple database connections.
*   `prisma/schema.prisma`: The blueprint of our database.
*   `middleware.js` (Implicit): Next.js handles routing and API middleware automatically.
