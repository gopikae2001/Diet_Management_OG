# Diet Management System - API Setup Guide

## Overview

The diet management system has been updated to use a JSON server backend instead of localStorage for data persistence. This provides better data management, persistence across sessions, and a more scalable architecture.

## Setup Instructions

### 1. Install Dependencies

The json-server package has been added to the project. If you haven't installed it yet:

```bash
npm install json-server --save-dev
```

### 2. Start the JSON Server

To start the backend server:

```bash
npm run server
```

This will start the JSON server on `http://localhost:3001` and watch the `db.json` file for changes.

### 3. Start the Frontend Application

In a separate terminal, start the React application:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy).

## Data Structure

The `db.json` file contains the following collections:

- **dietOrders**: Diet orders submitted by users
- **dietPackages**: Predefined diet packages with meal plans
- **dietRequests**: Diet requests from patients
- **foodItems**: Individual food items with nutritional information
- **canteenOrders**: Orders for the canteen interface
- **customPlans**: Custom diet plans created by dieticians

## API Endpoints

The JSON server provides RESTful API endpoints:

### Diet Orders
- `GET /dietOrders` - Get all diet orders
- `GET /dietOrders/:id` - Get specific diet order
- `POST /dietOrders` - Create new diet order
- `PATCH /dietOrders/:id` - Update diet order
- `DELETE /dietOrders/:id` - Delete diet order

### Diet Packages
- `GET /dietPackages` - Get all diet packages
- `GET /dietPackages/:id` - Get specific diet package
- `POST /dietPackages` - Create new diet package
- `PATCH /dietPackages/:id` - Update diet package
- `DELETE /dietPackages/:id` - Delete diet package

### Food Items
- `GET /foodItems` - Get all food items
- `GET /foodItems/:id` - Get specific food item
- `POST /foodItems` - Create new food item
- `PATCH /foodItems/:id` - Update food item
- `DELETE /foodItems/:id` - Delete food item

### Diet Requests
- `GET /dietRequests` - Get all diet requests
- `GET /dietRequests/:id` - Get specific diet request
- `POST /dietRequests` - Create new diet request
- `PATCH /dietRequests/:id` - Update diet request
- `DELETE /dietRequests/:id` - Delete diet request

### Canteen Orders
- `GET /canteenOrders` - Get all canteen orders
- `GET /canteenOrders/:id` - Get specific canteen order
- `POST /canteenOrders` - Create new canteen order
- `PATCH /canteenOrders/:id` - Update canteen order
- `DELETE /canteenOrders/:id` - Delete canteen order

### Custom Plans
- `GET /customPlans` - Get all custom plans
- `GET /customPlans/:id` - Get specific custom plan
- `POST /customPlans` - Create new custom plan
- `PATCH /customPlans/:id` - Update custom plan
- `DELETE /customPlans/:id` - Delete custom plan

## Key Changes Made

### 1. API Service Layer
- Created `src/services/api.ts` with all API functions
- Defined TypeScript interfaces for all data types
- Implemented error handling for API calls

### 2. Updated Components
- **FoodContext**: Now uses API instead of localStorage
- **DietOrderForm**: Updated to use API for CRUD operations
- All components now handle async operations properly

### 3. Error Handling
- Added proper error handling for API failures
- User-friendly error messages
- Loading states for better UX

## Benefits of the New System

1. **Data Persistence**: Data is stored in `db.json` and persists across browser sessions
2. **Better Performance**: No localStorage size limitations
3. **Scalability**: Easy to extend with additional features
4. **Development**: JSON server provides a realistic API experience
5. **Data Integrity**: Centralized data storage with proper validation

## Troubleshooting

### Server Not Starting
- Make sure port 3001 is not in use
- Check if `db.json` exists and is valid JSON
- Verify json-server is installed: `npm list json-server`

### API Connection Issues
- Ensure both frontend and backend are running
- Check browser console for CORS errors
- Verify the API base URL in `src/services/api.ts`

### Data Not Loading
- Check the browser's Network tab for failed requests
- Verify the JSON server is running and accessible
- Check `db.json` file permissions

## Migration from localStorage

The system has been designed to work with a fresh start. If you had existing localStorage data, you can:

1. Export the data from localStorage (if needed)
2. Manually add it to `db.json` in the appropriate format
3. Or start fresh with the new system

## Development Notes

- The JSON server automatically saves changes to `db.json`
- All API calls include proper error handling
- TypeScript interfaces ensure type safety
- The system is ready for production deployment with a real backend

## Next Steps

To deploy this to production, you would:

1. Replace the JSON server with a real backend (Node.js, Python, etc.)
2. Update the API base URL in `src/services/api.ts`
3. Implement proper authentication and authorization
4. Add database persistence (PostgreSQL, MongoDB, etc.)
5. Set up proper CORS configuration 