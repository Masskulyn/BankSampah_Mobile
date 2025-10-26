# Admin Access Credentials

## Admin Account

**Email:** `admin@ecobank.id`  
**Password:** `admin123`

---

## Admin Dashboard Features

### 1. **Dashboard Overview**
- Real-time statistics (Total Users, Transactions, Waste, Money)
- Quick actions panel
- System information

### 2. **QR Code Generator**
- Create QR codes for waste deposits
- Select waste type (Plastic, Paper, Glass Bottles, Cans, Electronics, Textile)
- Enter weight in kg
- Automatic price calculation
- Download QR code as PNG
- Transaction ID tracking

### 3. **User Management**
- View all registered users
- Search and filter users
- User details (balance, earnings, waste deposited)
- Activity status tracking
- User profile details modal

### 4. **Transaction Management**
- View all system transactions
- Filter by type (Deposit/Cash Out)
- Filter by status (Completed/Pending/Failed)
- Search transactions
- Export to CSV
- Transaction statistics

---

## How to Use

### For Admin:

1. **Login as Admin**
   - Use the credentials above to login
   - You will be redirected to the Admin Dashboard automatically

2. **Generate QR Code for Deposit**
   - Go to "QR Code" tab
   - Select waste type
   - Enter weight (e.g., 2.5 kg)
   - Click "Buat QR Code"
   - Show the QR code to users or download it

3. **Manage Users**
   - Go to "Pengguna" tab
   - View all users, their balances, and activity
   - Click "Detail" to see full user information

4. **Monitor Transactions**
   - Go to "Transaksi" tab
   - Filter and search transactions
   - Export data for reporting

### For Users:

1. **Scan QR Code**
   - Login to user account
   - Click "Scan QR" button on home screen
   - Allow camera access
   - Point camera at admin-generated QR code
   - Balance will be updated automatically

2. **View Balance**
   - Check your balance on the home screen
   - View transaction history
   - Cash out when ready

---

## Demo User Accounts

**User 1:**
- Email: `demo@ecobank.id`
- Password: `demo123`
- Starting Balance: Rp 125,000

**User 2:**
- Email: `siti@ecobank.id`
- Password: `siti123`
- Starting Balance: Rp 89,000

**User 3:**
- Email: `budi@ecobank.id`
- Password: `budi123`
- Starting Balance: Rp 205,000

---

## Technical Notes

- Admin dashboard has a different UI/UX from user interface
- QR codes contain encrypted transaction data
- All data is stored in browser localStorage (NoSQL approach)
- Transactions are tracked with unique IDs
- Role-based access control (admin/user)
- Mobile-first responsive design for both admin and user interfaces

---

## Security

⚠️ **Important:** This is a demo application for development purposes only. In production:
- Use proper backend authentication
- Store passwords with bcrypt or similar
- Implement JWT tokens
- Use a real database
- Add proper authorization middleware
- Implement rate limiting
- Add input validation and sanitization
