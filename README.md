# Diet Management System

A comprehensive diet management application built with React, TypeScript, and Vite. The system provides interfaces for managing diet orders, packages, food items, and patient requests.

## Features

- **Diet Order Management**: Create and manage diet orders for patients
- **Diet Package Management**: Design and maintain diet packages with meal plans
- **Food Item Management**: Manage individual food items with nutritional information
- **Diet Request Processing**: Handle patient diet requests and approvals
- **Canteen Interface**: Manage meal preparation and delivery
- **Patient History**: Track patient diet history and orders

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Backend**: JSON Server (for development)
- **Styling**: CSS modules and custom styles
- **UI Components**: Ant Design and custom components

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diet-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the JSON server (backend):
```bash
npm run server
```

4. In a separate terminal, start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
diet-management/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── context/            # React context providers
│   ├── services/           # API service layer
│   └── styles/             # CSS stylesheets
├── db.json                 # JSON database file
├── package.json            # Project dependencies
└── README.md              # This file
```

## API Documentation

The application uses a JSON server backend with the following endpoints:

- **Diet Orders**: `/dietOrders`
- **Diet Packages**: `/dietPackages`
- **Food Items**: `/foodItems`
- **Diet Requests**: `/dietRequests`
- **Canteen Orders**: `/canteenOrders`
- **Custom Plans**: `/customPlans`

For detailed API documentation, see [API_SETUP.md](./API_SETUP.md).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run server` - Start JSON server backend
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Data Storage

The application uses `db.json` as the primary data store. This file is automatically managed by the JSON server and persists data across sessions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please refer to the [API_SETUP.md](./API_SETUP.md) file for detailed setup instructions and troubleshooting.
