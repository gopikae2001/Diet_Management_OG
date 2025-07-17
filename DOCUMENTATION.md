# Diet Management System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [API Documentation](#api-documentation)
5. [Component Documentation](#component-documentation)
6. [Setup and Installation](#setup-and-installation)
7. [Feature Documentation](#feature-documentation)
8. [Data Models and Relationships](#data-models-and-relationships)

## System Overview
The Diet Management System is a comprehensive React-based solution for managing patient diets in healthcare facilities. It handles diet orders, food items, meal planning, canteen operations, and patient diet history tracking. The system uses a JSON Server backend with TypeScript interfaces and provides a modern, responsive UI.

## Project Structure

```
diet-management/
├── public/                    # Static files
│   └── vite.svg              # Vite logo
├── src/
│   ├── assets/               # Images and static files
│   │   ├── delete.png        # Delete icon
│   │   ├── edit.png          # Edit icon
│   │   ├── lefthand.png      # Left hand icon
│   │   ├── logo.png          # Application logo
│   │   ├── react.svg         # React logo
│   │   ├── righthand.png     # Right hand icon
│   │   └── sidebar-logo.jpg  # Sidebar logo
│   ├── components/           # Reusable UI components
│   │   ├── AcceptButton.tsx  # Accept action button
│   │   ├── Addressinput.tsx  # Address input component
│   │   ├── Approvebtn.tsx    # Approve button
│   │   ├── button.tsx        # Generic button component
│   │   ├── CancelButton.tsx  # Cancel action button
│   │   ├── Cards.tsx         # Card display component
│   │   ├── Date.tsx          # Date input component
│   │   ├── DeleteButton.tsx  # Delete action button
│   │   ├── EditButton.tsx    # Edit action button
│   │   ├── Footer.tsx        # Application footer
│   │   ├── Header.tsx        # Application header
│   │   ├── Input.tsx         # Generic input component
│   │   ├── Inputtype.tsx     # Typed input component
│   │   ├── MealSection.tsx   # Meal section component
│   │   ├── Notification.tsx  # Toast notification component
│   │   ├── PageContainer.tsx # Page wrapper component
│   │   ├── Pagination.tsx    # Pagination component
│   │   ├── Rejectbtn.tsx     # Reject button
│   │   ├── RejectButton.tsx  # Reject action button
│   │   ├── Searchbar.tsx     # Search functionality
│   │   ├── SectionHeading.tsx # Section title component
│   │   ├── SideBar.tsx       # Navigation sidebar
│   │   ├── Table.tsx         # Reusable table component
│   │   └── TopNavBar.tsx     # Top navigation bar
│   ├── context/              # React context providers
│   │   └── FoodContext.tsx   # Food items context
│   ├── pages/                # Page components
│   │   ├── Canteen.tsx       # Canteen operations page
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Dietician.tsx     # Dietician interface
│   │   ├── DietOrderForm.tsx # Diet order form
│   │   ├── Dietpackage.tsx   # Diet package creation
│   │   ├── Dietpackagelist.tsx # Diet package listing
│   │   ├── DietRequest.tsx   # Diet request form
│   │   ├── DietRequestApproval.tsx # Request approval
│   │   ├── Fooditem.tsx      # Food item management
│   │   ├── fooditemdata.tsx  # Food item data display
│   │   ├── Itemtable.tsx     # Item table component
│   │   └── PatientDietHistory.tsx # Patient history
│   ├── services/             # API services
│   │   └── api.ts            # API interfaces and functions
│   ├── styles/               # CSS files
│   │   ├── ApproveBtn.module.css # Approve button styles
│   │   ├── button.css        # Button styles
│   │   ├── cancelbutton.css  # Cancel button styles
│   │   ├── canteen.css       # Canteen page styles
│   │   ├── cards.css         # Card component styles
│   │   ├── DeleteButton.module.css # Delete button styles
│   │   ├── Dietician.css     # Dietician page styles
│   │   ├── DietOrder.css     # Diet order styles
│   │   ├── DietPackageForm.css # Package form styles
│   │   ├── DietPackageList.css # Package list styles
│   │   ├── Dietrequest.css   # Diet request styles
│   │   ├── DietRequestApproval.css # Request approval styles
│   │   ├── EditButton.module.css # Edit button styles
│   │   ├── Fooditem.css      # Food item styles
│   │   ├── Footer.css        # Footer styles
│   │   ├── header.css        # Header styles
│   │   ├── input.css         # Input component styles
│   │   ├── notification.css  # Notification styles
│   │   ├── page.css          # Page layout styles
│   │   ├── pageContainer.css # Page container styles
│   │   ├── Pagination.css    # Pagination styles
│   │   ├── RejectBtn.module.css # Reject button styles
│   │   ├── searchbar.css     # Search bar styles
│   │   ├── SectionHeading.css # Section heading styles
│   │   ├── ShortcutModal.css # Modal styles
│   │   ├── sidebar.css       # Sidebar styles
│   │   ├── Table.css         # Table styles
│   │   └── topbar.css        # Top bar styles
│   ├── App.css               # Main app styles
│   ├── App.tsx               # Main app component
│   ├── index.css             # Global styles
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Vite type definitions
├── db.json                   # JSON Server database
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML template
├── package-lock.json         # NPM lock file
├── package.json              # Project dependencies
├── README.md                 # Project readme
├── tsconfig.app.json         # TypeScript app config
├── tsconfig.json             # TypeScript configuration
├── tsconfig.node.json        # TypeScript node config
└── vite.config.ts            # Vite configuration
```

### Directory Descriptions

#### `/public/`
Contains static files served directly by the development server.

#### `/src/assets/`
Stores images, icons, and other static assets used throughout the application.

#### `/src/components/`
Reusable UI components that can be used across multiple pages:
- **Action Buttons**: Accept, Reject, Edit, Delete, Cancel buttons
- **Form Components**: Input, Date, Address input components
- **Layout Components**: Header, Footer, Sidebar, PageContainer
- **Data Display**: Table, Cards, Pagination components
- **Utility Components**: Searchbar, Notification, SectionHeading

#### `/src/context/`
React Context providers for state management:
- **FoodContext**: Manages food items state across the application

#### `/src/pages/`
Main page components that represent different sections of the application:
- **Dashboard**: Main overview and statistics
- **Diet Management**: OrderForm, Request, Approval pages
- **Dietician Interface**: Main dietician workflow
- **Canteen Operations**: Kitchen and delivery management
- **Package Management**: Creation and listing of diet packages
- **Food Items**: Food item management interface
- **Patient History**: Diet history tracking

#### `/src/services/`
API service layer with TypeScript interfaces and CRUD operations:
- **api.ts**: Contains all API interfaces, functions, and endpoints

#### `/src/styles/`
CSS files organized by component and page:
- **Component Styles**: Button, input, table styles
- **Page Styles**: Specific styles for each page
- **Module Styles**: CSS modules for component-specific styling

#### Configuration Files
- **package.json**: Project dependencies and scripts
- **vite.config.ts**: Vite build configuration
- **tsconfig.json**: TypeScript configuration
- **db.json**: JSON Server database file
- **eslint.config.js**: Code linting rules

### File Naming Conventions

1. **Components**: PascalCase (e.g., `DietOrderForm.tsx`)
2. **Pages**: PascalCase (e.g., `Canteen.tsx`)
3. **Services**: camelCase (e.g., `api.ts`)
4. **Styles**: camelCase or kebab-case (e.g., `canteen.css`, `DietOrder.css`)
5. **Assets**: lowercase with hyphens (e.g., `sidebar-logo.jpg`)

### Import Structure

```typescript
// Component imports
import { DietOrderForm } from '../pages/DietOrderForm';
import { Table } from '../components/Table';

// Service imports
import { dietOrdersApi } from '../services/api';

// Style imports
import './styles/canteen.css';
import styles from './styles/Button.module.css';
```

## Database Schema

### 1. Diet Orders
Stores patient diet order information.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| id | String | Primary Key (auto-generated) | Yes |
| patientName | String | Patient's full name | Yes |
| patientId | String | Unique patient identifier | Yes |
| contactNumber | String | 10-digit contact number | Yes |
| age | String | Patient's age | No |
| bed | String | Bed number | No |
| ward | String | Ward number | No |
| floor | String | Floor number | No |
| dietPackage | String | Selected diet package ID | Yes |
| packageRate | String | Rate of the package | No |
| startDate | String | Start date of diet (YYYY-MM-DD) | Yes |
| endDate | String | End date of diet (YYYY-MM-DD) | Yes |
| doctorNotes | String | Notes from the doctor | No |
| status | Enum | 'active' \| 'paused' \| 'stopped' | Yes |
| approvalStatus | Enum | 'pending' \| 'approved' \| 'rejected' | Yes |
| dieticianInstructions | String | Optional instructions from dietician | No |
| packageName | String | Name of the diet package | No |

### 2. Diet Packages
Stores different diet package configurations.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| id | String | Primary Key (auto-generated) | Yes |
| name | String | Package name | Yes |
| type | String | Package type (regular, custom, etc.) | Yes |
| breakfast | Array<MealItem> | Breakfast items | Yes |
| brunch | Array<MealItem> | Brunch items | Yes |
| lunch | Array<MealItem> | Lunch items | Yes |
| dinner | Array<MealItem> | Dinner items | Yes |
| evening | Array<MealItem> | Evening snack items | Yes |
| totalRate | Number | Total package rate | Yes |
| totalNutrition | Object | Nutritional information | Yes |

### 3. MealItem Interface
Defines individual meal items within packages.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| foodItemId | String | Reference to food item | Yes |
| foodItemName | String | Name of the food item | Yes |
| quantity | Number | Quantity of the item | Yes |
| unit | String | Measurement unit | Yes |
| time | String | Serving time (HH:MM) | No |
| period | Enum | 'AM' \| 'PM' | No |

### 4. Diet Requests
Stores initial diet requests from doctors.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| id | String | Primary Key (auto-generated) | Yes |
| patientId | String | Unique patient identifier | Yes |
| patientName | String | Patient's full name | Yes |
| age | String | Patient's age | No |
| contactNumber | String | 10-digit contact number | Yes |
| bed | String | Bed number | No |
| ward | String | Ward number | No |
| floor | String | Floor number | No |
| doctor | String | Doctor's name | No |
| doctorNotes | String | Notes from the doctor | No |
| status | Enum | 'Pending' \| 'Diet Order Placed' \| 'Rejected' | Yes |

### 5. Food Items
Stores information about individual food items.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| id | String | Primary Key (auto-generated) | Yes |
| name | String | Food item name | Yes |
| foodType | String | Type of food (Solid, Liquid, etc.) | Yes |
| category | String | Food category (Fruits, Vegetables, etc.) | Yes |
| unit | String | Measurement unit | Yes |
| quantity | String | Available quantity | Yes |
| calories | String | Caloric content | Yes |
| protein | String | Protein content | Yes |
| carbohydrates | String | Carbs content | Yes |
| fat | String | Fat content | Yes |
| price | String | Price per unit | Yes |
| pricePerUnit | String | Price per standard unit | Yes |

### 6. Canteen Orders
Manages food orders in the canteen.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| id | String | Primary Key (auto-generated) | Yes |
| patientName | String | Patient's name | Yes |
| bed | String | Bed number | No |
| ward | String | Ward number | No |
| dietPackageName | String | Name of diet package | Yes |
| dietType | String | Type of diet | Yes |
| foodItems | Array<String> | List of food items | Yes |
| specialNotes | String | Special instructions | No |
| status | Enum | 'pending' \| 'active' \| 'paused' \| 'stopped' \| 'prepared' \| 'delivered' | Yes |
| prepared | Boolean | If order is prepared | Yes |
| delivered | Boolean | If order is delivered | Yes |
| dieticianInstructions | String | Special instructions | No |
| mealItems | Object | Items by meal type | No |

### 7. Custom Plans
Stores custom diet plans created by dieticians.

| Column | Type | Description | Required |
|--------|------|-------------|----------|
| id | String | Primary Key (auto-generated) | Yes |
| packageName | String | Name of the custom plan | Yes |
| dietType | String | Type of diet | Yes |
| meals | Object | Meal configuration | Yes |
| amount | Number | Total amount | Yes |

## API Documentation

### Base URL
```
http://192.168.29.181:3001
```

### Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

### Error Handling
All API endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

### 1. Diet Orders API

#### GET /dietOrders
Retrieve all diet orders.

**Response:**
```json
[
  {
    "id": "1751724091019",
    "patientName": "kesavan",
    "patientId": "P003",
    "contactNumber": "8907890789",
    "age": "55",
    "bed": "1",
    "ward": "1",
    "floor": "1",
    "dietPackage": "1751724027513",
    "packageRate": "70",
    "startDate": "2025-07-05",
    "endDate": "2025-07-31",
    "doctorNotes": "",
    "status": "active",
    "approvalStatus": "approved",
    "dieticianInstructions": "",
    "packageName": "General"
  }
]
```

#### GET /dietOrders/:id
Retrieve a specific diet order by ID.

#### POST /dietOrders
Create a new diet order.

**Request Body:**
```json
{
  "patientName": "John Doe",
  "patientId": "P001",
  "contactNumber": "1234567890",
  "dietPackage": "package-id",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "status": "active",
  "approvalStatus": "pending"
}
```

#### PATCH /dietOrders/:id
Update an existing diet order.

#### DELETE /dietOrders/:id
Delete a diet order.

### 2. Diet Packages API

#### GET /dietPackages
Retrieve all diet packages.

**Response:**
```json
[
  {
    "id": "1751724027513",
    "name": "General",
    "type": "regular",
    "breakfast": [
      {
        "foodItemId": "e0bc",
        "foodItemName": "Apple",
        "quantity": 1,
        "unit": "Piece",
        "time": "09:00",
        "period": "AM"
      }
    ],
    "totalRate": 70,
    "totalNutrition": {
      "calories": 15,
      "protein": 17,
      "carbohydrates": 17,
      "fat": 16
    }
  }
]
```

#### GET /dietPackages/:id
Retrieve a specific diet package by ID.

#### POST /dietPackages
Create a new diet package.

#### PATCH /dietPackages/:id
Update an existing diet package.

#### DELETE /dietPackages/:id
Delete a diet package.

### 3. Diet Requests API

#### GET /dietRequests
Retrieve all diet requests.

#### GET /dietRequests/:id
Retrieve a specific diet request by ID.

#### POST /dietRequests
Create a new diet request.

#### PATCH /dietRequests/:id
Update an existing diet request.

#### DELETE /dietRequests/:id
Delete a diet request.

### 4. Food Items API

#### GET /foodItems
Retrieve all food items.

#### GET /foodItems/:id
Retrieve a specific food item by ID.

#### POST /foodItems
Create a new food item.

#### PATCH /foodItems/:id
Update an existing food item.

#### DELETE /foodItems/:id
Delete a food item.

### 5. Canteen Orders API

#### GET /canteenOrders
Retrieve all canteen orders.

#### GET /canteenOrders/:id
Retrieve a specific canteen order by ID.

#### POST /canteenOrders
Create a new canteen order.

#### PATCH /canteenOrders/:id
Update an existing canteen order.

#### DELETE /canteenOrders/:id
Delete a canteen order.

### 6. Custom Plans API

#### GET /customPlans
Retrieve all custom plans.

#### GET /customPlans/:id
Retrieve a specific custom plan by ID.

#### POST /customPlans
Create a new custom plan.

#### PATCH /customPlans/:id
Update an existing custom plan.

#### DELETE /customPlans/:id
Delete a custom plan.

## Component Documentation

### Page Components

#### 1. Dashboard.tsx
Main dashboard component displaying system overview and statistics.

**Features:**
- Patient statistics
- Order status overview
- Quick navigation to other modules
- Charts and analytics

**Props:** None

#### 2. DietOrderForm.tsx
Handles creation and editing of diet orders.

**Features:**
- Patient information input
- Diet package selection
- Date range selection
- Status management
- Form validation

**Props:**
- `sidebarCollapsed: boolean` - Sidebar state
- `toggleSidebar: () => void` - Toggle sidebar function

#### 3. DietRequest.tsx
Manages diet requests from doctors.

**Features:**
- Create new diet requests
- Patient information collection
- Doctor notes
- Request status tracking

**Props:** None

#### 4. DietRequestApproval.tsx
Handles approval/rejection of diet requests.

**Features:**
- View pending requests
- Approve or reject requests
- Add dietician instructions
- Status updates

**Props:** None

#### 5. Dietician.tsx
Main dietician interface for managing diet orders.

**Features:**
- View all diet orders
- Create custom diet packages
- Approve diet requests
- Manage patient diets
- Order status updates

**Props:** None

#### 6. Canteen.tsx
Manages canteen orders and meal preparation.

**Features:**
- View and filter orders by meal type
- Update order status (prepared, delivered)
- Meal-specific filtering
- Order management interface

**Props:** None

#### 7. Dietpackage.tsx
Creates and manages diet packages.

**Features:**
- Package creation wizard
- Meal item selection
- Nutritional calculation
- Package customization

**Props:** None

#### 8. Dietpackagelist.tsx
Displays and manages diet packages.

**Features:**
- List all packages
- Edit existing packages
- Delete packages
- Package details view

**Props:** None

#### 9. Fooditem.tsx
Manages food items in the system.

**Features:**
- Add new food items
- Edit existing items
- Nutritional information
- Price management

**Props:** None

#### 10. PatientDietHistory.tsx
Shows diet history for specific patients.

**Features:**
- Patient search by contact number
- Diet order history
- Status tracking
- Historical data

**Props:** None

### UI Components

#### 1. Header.tsx
Application header with navigation and user info.

**Props:**
- `sidebarCollapsed: boolean`
- `toggleSidebar: () => void`

#### 2. SideBar.tsx
Navigation sidebar with menu items.

**Props:**
- `collapsed: boolean`
- `onToggle: () => void`

#### 3. TopNavBar.tsx
Top navigation bar with search and notifications.

**Props:** None

#### 4. Table.tsx
Reusable table component for data display.

**Props:**
- `data: any[]` - Table data
- `columns: Column[]` - Column definitions
- `onEdit?: (item: any) => void`
- `onDelete?: (item: any) => void`

#### 5. Input.tsx
Reusable input component.

**Props:**
- `label: string`
- `value: string`
- `onChange: (value: string) => void`
- `type?: string`
- `placeholder?: string`

#### 6. Searchbar.tsx
Search functionality component.

**Props:**
- `onSearch: (query: string) => void`
- `placeholder?: string`

#### 7. Pagination.tsx
Pagination component for large datasets.

**Props:**
- `currentPage: number`
- `totalPages: number`
- `onPageChange: (page: number) => void`

#### 8. Notification.tsx
Toast notification component.

**Props:**
- `message: string`
- `type: 'success' | 'error' | 'warning' | 'info'`
- `onClose: () => void`

#### 9. MealSection.tsx
Component for managing meal sections in diet packages.

**Props:**
- `mealType: string`
- `items: MealItem[]`
- `onItemsChange: (items: MealItem[]) => void`
- `availableFoodItems: FoodItem[]`

#### 10. Action Buttons
Various action button components:
- `AcceptButton.tsx`
- `RejectButton.tsx`
- `EditButton.tsx`
- `DeleteButton.tsx`
- `CancelButton.tsx`
- `Approvebtn.tsx`
- `Rejectbtn.tsx`

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher) or yarn
- Git

### Installation Steps

1. **Clone the Repository**
```bash
git clone <repository-url>
cd diet-management
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the JSON Server (Backend)**
```bash
npm run server
```
This will start the JSON server on `http://192.168.29.181:3001`

4. **Start the Development Server**
```bash
npm run dev
```
This will start the React development server on `http://localhost:3067`

5. **Access the Application**
- Frontend: `http://localhost:3067`
- Backend API: `http://192.168.29.181:3001`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run server` | Start JSON server backend |
| `npm run lint` | Run ESLint |

### Environment Configuration

The application uses the following configuration:

- **API Base URL**: `http://192.168.29.181:3001` (configured in `src/services/api.ts`)
- **Frontend Port**: `3067` (configurable in `vite.config.ts`)
- **Backend Port**: `3001` (JSON Server)

### Network Access

The application is configured to be accessible from other devices on the network:
- Frontend: `http://192.168.29.181:3067`
- Backend: `http://192.168.29.181:3001`

## Feature Documentation

### 1. Diet Order Management

**Overview:**
Complete lifecycle management of patient diet orders from creation to completion.

**Features:**
- Create new diet orders with patient information
- Select from predefined diet packages or create custom plans
- Set start and end dates for diet periods
- Track order status (active, paused, stopped)
- Manage approval workflow (pending, approved, rejected)
- Add dietician instructions and special notes

**Workflow:**
1. Doctor creates diet request
2. Dietician reviews and approves
3. Diet order is created
4. Order is sent to canteen
5. Meals are prepared and delivered
6. Status is updated throughout the process

### 2. Diet Request System

**Overview:**
Initial request system where doctors submit diet requirements for patients.

**Features:**
- Submit diet requests with patient details
- Include doctor notes and special requirements
- Track request status (Pending, Diet Order Placed, Rejected)
- Automatic workflow to diet order creation

### 3. Diet Package Management

**Overview:**
Comprehensive system for creating and managing diet packages with nutritional information.

**Features:**
- Create predefined diet packages
- Configure meals for different times (breakfast, brunch, lunch, dinner, evening)
- Add nutritional information (calories, protein, carbs, fat)
- Set pricing for packages
- Custom meal planning capabilities

**Meal Structure:**
- **Breakfast**: Morning meals (typically 7-9 AM)
- **Brunch**: Mid-morning snacks (10-11 AM)
- **Lunch**: Midday meals (12-2 PM)
- **Dinner**: Evening meals (6-8 PM)
- **Evening**: Late evening snacks (8-9 PM)

### 4. Food Item Management

**Overview:**
Centralized management of all food items with detailed nutritional and pricing information.

**Features:**
- Add new food items with complete details
- Categorize items (Fruits, Vegetables, Proteins, etc.)
- Track nutritional values (calories, protein, carbs, fat)
- Manage pricing and units
- Support for different food types (Solid, Liquid, etc.)

**Categories:**
- Fruits
- Vegetables
- Proteins
- Grains
- Dairy
- Legumes & Pulses
- Others

### 5. Canteen Operations

**Overview:**
Kitchen and delivery management system for preparing and delivering patient meals.

**Features:**
- View all active diet orders
- Filter orders by meal type and status
- Update order status (prepared, delivered)
- Track preparation and delivery times
- Manage special dietary requirements
- Generate daily meal reports

**Order Status Flow:**
1. **Pending**: Order received, not yet started
2. **Active**: Order is being processed
3. **Prepared**: Meal is ready for delivery
4. **Delivered**: Meal has been delivered to patient

### 6. Patient Diet History

**Overview:**
Comprehensive tracking system for patient diet history and compliance.

**Features:**
- Search patients by contact number
- View complete diet order history
- Track order status changes over time
- Monitor dietary compliance
- Generate patient-specific reports

### 7. Reporting and Analytics

**Overview:**
Data analysis and reporting capabilities for diet management insights.

**Features:**
- Dashboard with key metrics
- Patient statistics
- Order status overview
- Nutritional analysis
- Cost tracking
- Compliance reporting

## Data Models and Relationships

### Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DietRequest   │    │   DietOrder     │    │  CanteenOrder   │
│                 │    │                 │    │                 │
│ - id            │    │ - id            │    │ - id            │
│ - patientId     │    │ - patientId     │    │ - patientName   │
│ - patientName   │    │ - patientName   │    │ - bed           │
│ - contactNumber │    │ - contactNumber │    │ - ward          │
│ - doctor        │    │ - dietPackage   │    │ - dietPackage   │
│ - doctorNotes   │    │ - status        │    │ - status        │
│ - status        │    │ - approvalStatus│    │ - prepared      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐
                    │  DietPackage    │
                    │                 │
                    │ - id            │
                    │ - name          │
                    │ - type          │
                    │ - breakfast[]   │
                    │ - lunch[]       │
                    │ - dinner[]      │
                    │ - totalRate     │
                    └─────────────────┘
                                 │
                                 ▼
                    ┌─────────────────┐
                    │   FoodItem      │
                    │                 │
                    │ - id            │
                    │ - name          │
                    │ - category      │
                    │ - calories      │
                    │ - protein       │
                    │ - price         │
                    └─────────────────┘
```

### Database Tables Schema

#### 1. dietOrders Table
```sql
CREATE TABLE dietOrders (
    id VARCHAR(50) PRIMARY KEY,
    patientName VARCHAR(100) NOT NULL,
    patientId VARCHAR(50) NOT NULL,
    contactNumber VARCHAR(15) NOT NULL,
    age VARCHAR(10),
    bed VARCHAR(20),
    ward VARCHAR(20),
    floor VARCHAR(20),
    dietPackage VARCHAR(50) NOT NULL,
    packageRate VARCHAR(20),
    startDate VARCHAR(10) NOT NULL,
    endDate VARCHAR(10) NOT NULL,
    doctorNotes TEXT,
    status ENUM('active', 'paused', 'stopped') DEFAULT 'active',
    approvalStatus ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    dieticianInstructions TEXT,
    packageName VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. dietPackages Table
```sql
CREATE TABLE dietPackages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    breakfast JSON,
    brunch JSON,
    lunch JSON,
    dinner JSON,
    evening JSON,
    totalRate DECIMAL(10,2) NOT NULL,
    totalNutrition JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. dietRequests Table
```sql
CREATE TABLE dietRequests (
    id VARCHAR(50) PRIMARY KEY,
    patientId VARCHAR(50) NOT NULL,
    patientName VARCHAR(100) NOT NULL,
    age VARCHAR(10),
    contactNumber VARCHAR(15) NOT NULL,
    bed VARCHAR(20),
    ward VARCHAR(20),
    floor VARCHAR(20),
    doctor VARCHAR(100),
    doctorNotes TEXT,
    status ENUM('Pending', 'Diet Order Placed', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 4. foodItems Table
```sql
CREATE TABLE foodItems (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    foodType VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity VARCHAR(20) NOT NULL,
    calories VARCHAR(20) NOT NULL,
    protein VARCHAR(20) NOT NULL,
    carbohydrates VARCHAR(20) NOT NULL,
    fat VARCHAR(20) NOT NULL,
    price VARCHAR(20) NOT NULL,
    pricePerUnit VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 5. canteenOrders Table
```sql
CREATE TABLE canteenOrders (
    id VARCHAR(50) PRIMARY KEY,
    patientName VARCHAR(100) NOT NULL,
    bed VARCHAR(20),
    ward VARCHAR(20),
    dietPackageName VARCHAR(100) NOT NULL,
    dietType VARCHAR(50) NOT NULL,
    foodItems JSON,
    specialNotes TEXT,
    status ENUM('pending', 'active', 'paused', 'stopped', 'prepared', 'delivered') DEFAULT 'pending',
    prepared BOOLEAN DEFAULT FALSE,
    delivered BOOLEAN DEFAULT FALSE,
    dieticianInstructions TEXT,
    mealItems JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 6. customPlans Table
```sql
CREATE TABLE customPlans (
    id VARCHAR(50) PRIMARY KEY,
    packageName VARCHAR(100) NOT NULL,
    dietType VARCHAR(50) NOT NULL,
    meals JSON,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Data Relationships

#### 1. One-to-Many Relationships
- **DietRequest → DietOrder**: One diet request can lead to one diet order
- **DietPackage → DietOrder**: One diet package can be used in multiple diet orders
- **FoodItem → MealItem**: One food item can be used in multiple meal items

#### 2. Many-to-Many Relationships
- **DietPackage ↔ FoodItem**: Through MealItem interface
- **CanteenOrder ↔ FoodItem**: Through foodItems array

#### 3. Hierarchical Relationships
- **DietPackage → MealItem**: Diet packages contain multiple meal items
- **MealItem → FoodItem**: Meal items reference specific food items

### Data Flow

#### 1. Diet Request to Order Flow
```
DietRequest → Approval → DietOrder → CanteenOrder → Delivery
```

#### 2. Package Creation Flow
```
FoodItems → MealItems → DietPackage → DietOrder
```

#### 3. Canteen Operations Flow
```
DietOrder → CanteenOrder → Preparation → Delivery
```

### Indexes and Performance

#### Recommended Indexes
```sql
-- Primary keys (already indexed)
-- dietOrders.id
-- dietPackages.id
-- dietRequests.id
-- foodItems.id
-- canteenOrders.id
-- customPlans.id

-- Foreign key indexes
CREATE INDEX idx_dietorders_patient ON dietOrders(patientId);
CREATE INDEX idx_dietorders_contact ON dietOrders(contactNumber);
CREATE INDEX idx_dietorders_package ON dietOrders(dietPackage);
CREATE INDEX idx_dietorders_status ON dietOrders(status);
CREATE INDEX idx_dietorders_approval ON dietOrders(approvalStatus);

CREATE INDEX idx_dietrequests_status ON dietRequests(status);
CREATE INDEX idx_dietrequests_contact ON dietRequests(contactNumber);

CREATE INDEX idx_canteenorders_status ON canteenOrders(status);
CREATE INDEX idx_canteenorders_patient ON canteenOrders(patientName);

CREATE INDEX idx_fooditems_category ON foodItems(category);
CREATE INDEX idx_fooditems_type ON foodItems(foodType);
```

### Data Validation Rules

#### 1. Contact Number Validation
- Must be exactly 10 digits
- Must be numeric only
- Must be unique per patient

#### 2. Date Validation
- Start date must be before end date
- Dates must be in YYYY-MM-DD format
- End date cannot be in the past

#### 3. Status Validation
- Order status must follow the defined workflow
- Approval status must be one of the allowed values
- Canteen order status must follow preparation flow

#### 4. Nutritional Validation
- Calories, protein, carbs, and fat must be positive numbers
- Total nutrition must match sum of individual items
- Price values must be positive numbers

This comprehensive documentation provides a complete overview of the Diet Management System, including all APIs, components, setup instructions, features, and data relationships.
