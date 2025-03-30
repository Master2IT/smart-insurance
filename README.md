# Smart Insurance

A modern insurance application management system built with Next.js.

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/Master2IT/smart-insurance.git
cd smart-insurance
```

2. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

3. Set up environment variables
   Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=your_api_url
```

4. Run the development server

```bash
npm run dev
# or
pnpm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Assumptions Made

1. **Authentication**: The application assumes a logged-in user context. Authentication implementation details are not included in this version.

2. **Data Persistence**: The application uses a backend API for data persistence. The actual database implementation is abstracted away from the frontend.

3. **Insurance Types**: The system currently supports basic insurance types (health, auto, home, life). Additional types would require backend and frontend updates.

4. **User Roles**: The current implementation assumes a single user role with access to all features. Role-based access control would need to be implemented for multi-role support.

5. **Browser Compatibility**: The application is designed for modern browsers and may not support older browser versions.

6. **Responsive Design**: The UI is designed to be responsive and work on both desktop and mobile devices.

7. **API Rate Limiting**: No specific rate limiting is implemented in the frontend. Backend rate limiting is assumed to be in place.
