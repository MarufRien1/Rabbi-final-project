# AgroMart - Project Overview

## Introduction
AgroMart is a comprehensive web-based platform designed to bridge the gap between farmers and customers in Bangladesh. It empowers farmers to sell their fresh produce directly to consumers, eliminating middlemen and ensuring fair prices for both parties. The platform also provides valuable agricultural information to help users understand farming conditions across different regions.

## Key Features

### 1. User Roles & Authentication
The system supports three distinct user roles, each with a tailored experience:
*   **Farmers**: Can register using their mobile number, manage their product inventory, and view incoming orders.
*   **Customers**: Can sign up with their email, browse products, add items to a cart, and place orders.
*   **Admin**: Has a dedicated dashboard to oversee the entire platform, including order management and system monitoring.
*   **Secure Login**: Both session-based and persistent login options are available for a seamless user experience.

### 2. Farmer Dashboard
*   **Product Management**: Farmers can easily add new products with details like category, price, stock, and images. They can also edit or delete their existing listings.
*   **Order Management**: Farmers receive real-time updates on orders placed for their products and can update the status (e.g., Shipped, Delivered).
*   **Sales Tracking**: A clear view of their sales performance and inventory status.

### 3. Customer Experience
*   **Product Browsing**: Customers can search for products by name or category (Vegetables, Fruits, Rice, etc.).
*   **Shopping Cart**: A fully functional cart system allows users to manage their selected items before checkout.
*   **Checkout & Payment**: A streamlined checkout process where users provide delivery details and complete payment via a secure (simulated) card payment gateway.
*   **Order History**: Customers can track the status of their current and past orders.

### 4. Agricultural Insights
*   **Regional Data**: The "Locations" feature provides detailed information about farming conditions in different divisions of Bangladesh (e.g., Dhaka, Rajshahi, Sylhet).
*   **Soil & Weather Info**: Users can learn about the specific soil types and weather patterns suitable for different crops in each region.

### 5. Admin Control
*   **System Oversight**: Admins have full visibility into all orders and user activities.
*   **Order Status**: Admins can intervene and update order statuses if necessary to ensure smooth operations.

## Technical Highlights
*   **Frontend**: Built with **Next.js** (React) for a fast, responsive, and SEO-friendly user interface.
*   **Backend**: Powered by **Next.js API Routes** for server-side logic.
*   **Database**: Uses **SQLite** with **Prisma ORM** for efficient and type-safe database management.
*   **Styling**: Designed with **Tailwind CSS** and **Material UI** for a modern and accessible aesthetic.
*   **Animations**: Integrated **Framer Motion** for smooth transitions and an engaging user experience.

## Conclusion
AgroMart is more than just an e-commerce site; it's a digital ecosystem that supports the agricultural community. By connecting farmers directly with consumers and providing educational resources, it aims to modernize the way agricultural products are bought and sold in Bangladesh.
