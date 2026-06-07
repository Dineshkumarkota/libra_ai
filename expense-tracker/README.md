# Expense Tracker Application

A full-stack expense tracking application built with React.js frontend and Node.js backend.

## Features

### Core Features
- ✅ **Add Expense** - Create new expense entries with title, amount, category, and date
- ✅ **Edit Expense** - Update existing expense records
- ✅ **Delete Expense** - Remove expense entries
- ✅ **View Expense History** - Browse all expenses with pagination
- ✅ **Search Expenses** - Search by title or description
- ✅ **Filter by Category** - Filter expenses by category
- ✅ **Dashboard** - View statistics and charts
  - Total expenses
  - Monthly expenses
  - Recent transactions
  - Expenses by category

### Bonus Features
- ✅ **User Authentication** - Register and login with JWT tokens
- ✅ **Expense Charts** - Pie and bar charts for category breakdown (using Recharts)
- ✅ **Dark Mode** - Toggle between light and dark themes
- ✅ **Responsive UI** - Mobile-friendly design

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **API Documentation:** REST

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **UI Styling:** CSS3 with CSS Variables
- **HTTP Client:** Axios
- **Routing:** React Router v7
- **Charts:** Recharts
- **State Management:** React Context API

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   └── Expense.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── expenseController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api.js
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ExpenseContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Home.jsx
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── ExpenseForm.jsx
    │   │   └── ExpenseList.jsx
    │   ├── App.jsx
    │   └── App.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

4. Make sure MongoDB is running (if using local MongoDB)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/dashboard` - Get dashboard statistics

## Query Parameters

### Get Expenses
- `category` - Filter by category (Food, Transport, Entertainment, etc.)
- `search` - Search by title or description
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)

Example:
```
GET /api/expenses?category=Food&search=lunch
```

## Category Options
- Food
- Transport
- Entertainment
- Utilities
- Healthcare
- Shopping
- Education
- Other

## Payment Methods
- Cash
- Credit Card
- Debit Card
- Online
- Bank Transfer

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Model
```javascript
{
  user: ObjectId (reference to User),
  title: String (required),
  description: String,
  amount: Number (required, min: 0),
  category: String (enum, default: 'Other'),
  date: Date (default: now),
  paymentMethod: String (enum, default: 'Cash'),
  createdAt: Date,
  updatedAt: Date
}
```

## Features Explained

### Authentication
- Users can register with name, email, and password
- Password is hashed using bcryptjs (10 salt rounds)
- JWT tokens are issued upon successful login
- Tokens are stored in localStorage and sent with every API request
- Tokens expire after 30 days

### Dashboard
- Displays total expenses across all time
- Shows monthly expenses for current month
- Displays total transaction count
- Pie chart showing expense distribution by category
- Bar chart for category breakdown
- Recent 5 transactions list

### Expense Management
- Add, edit, and delete expenses
- Real-time UI updates
- Form validation
- Search and filter capabilities

### Dark Mode
- Toggle between light and dark themes
- Preference saved in localStorage
- Smooth transitions

### Responsive Design
- Mobile-friendly layout
- Responsive grid for charts
- Touch-friendly buttons
- Optimized for all screen sizes

## Error Handling

The application includes comprehensive error handling:
- Form validation errors
- API error responses
- Network error handling
- User authentication errors
- Database constraint errors

## Security Features

- Password hashing with bcryptjs
- JWT authentication tokens
- Protected API endpoints
- CORS enabled for frontend access
- Request validation
- Error messages don't expose sensitive info

## Build and Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

This creates an optimized production build in the `dist` folder.

### Backend Deployment

Before deploying to production:
1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Set up MongoDB Atlas cloud database
4. Configure environment variables on the hosting platform

## Development

### Running Tests
Tests can be added using Jest and React Testing Library. Currently, manual testing can be done through the UI.

### Code Style
- No specific linter configured
- Follow standard JavaScript/React conventions

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check firewall settings if using MongoDB Atlas

### CORS Errors
- Ensure backend is running on port 5000
- Check CORS configuration in server.js

### Login Issues
- Verify credentials are correct
- Check if user exists in database
- Clear localStorage and try again

### Charts Not Displaying
- Ensure Recharts is properly installed
- Check console for JavaScript errors

## Future Enhancements

- Export expenses as CSV/PDF
- Recurring expenses
- Budget alerts
- Multi-currency support
- Mobile app (React Native)
- Email notifications
- Data backup and restore
- Advanced analytics

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.

---

**Note:** Remember to change the JWT_SECRET and database credentials before deploying to production!
