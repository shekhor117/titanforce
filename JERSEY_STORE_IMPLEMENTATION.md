# Jersey Store Implementation with Real Supabase & BDT Currency

## Overview

The Jersey Store system integrates a complete e-commerce solution for customized Titan Force player jerseys with:
- Real player data from Supabase database
- Bangladeshi currency (BDT) pricing system
- Admin order management interface
- Order persistence to Supabase

## Features Implemented

### 1. Currency System (lib/currency.ts)
- **Exchange Rate**: 1 USD = 110 BDT
- **Currency Utilities**:
  - `usdToBdt(amount)` - Convert USD to BDT
  - `bdtToUsd(amount)` - Convert BDT to USD
  - `formatPrice(amount, currency)` - Format with currency symbol (৳ for BDT, $ for USD)
  - `calculateJerseyPrice(options)` - Calculate total with customizations
  
**Jersey Base Prices (USD)**:
- Base Jersey: $45
- Away Kit: +$5
- Third Kit: +$8
- Champions Gold Badge: +$8
- Premier Silver Badge: +$5
- League Patch: +$3
- Size XXL: +$3
- Size XXXL: +$5

### 2. Jersey Store Component
**Location**: `/components/JerseyStore.tsx`

**Features**:
- Browse all players from Supabase
- Customize jersey:
  - Select player name or custom name
  - Choose jersey number
  - Select kit type (Home, Away, Third)
  - Choose size (XS to XXXL)
  - Select badge type (Champions Gold, Premier Silver, Classic Bronze)
  - Add league patch option
- Real-time price calculation
- Add to cart (stored in Supabase)
- Order history view
- Interactive UI with animations

### 3. Jersey Store Page
**Location**: `/app/store/jerseys/page.tsx`

**Functionality**:
- Loads all players from `players` table
- Displays real player data and images
- Handles order creation and management
- Manages cart state via Supabase orders
- Toast notifications for user feedback

### 4. Jersey Order System

**Data Structure** (JerseyOrder):
```typescript
interface JerseyOrder {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  jerseyItems: JerseyOrderItem[] // Array of customized jerseys
  subtotalUSD: number
  subtotalBDT: number
  tax: number
  shipping: number
  totalUSD: number
  totalBDT: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  currency: 'USD' | 'BDT'
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

interface JerseyOrderItem {
  playerId?: string
  playerName?: string
  playerNumber?: number
  kitType: 'Home' | 'Away' | 'Third'
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'
  badgeType: 'Champions Gold' | 'Premier Silver' | 'Classic Bronze'
  hasLeaguePatch: boolean
  customName?: string
  customNumber?: number
  quantity: number
  priceUSD: number
  priceBDT: number
}
```

### 5. Admin Order Manager
**Location**: `/app/admin/store/orders/page.tsx`

**Features**:
- **Dual Tabs**: Jersey Orders | Regular Orders
- **Search & Filter**: By order number, customer name, status
- **Jersey Order Details**:
  - Player customization info (kit, size, badge, etc.)
  - Customer information
  - Pricing in BDT
  - Status management (Pending → Processing → Shipped → Delivered)
- **Bilingual Support**: English & Bengali (uses language context)
- **Real-time Updates**: All changes sync to Supabase

**Admin Capabilities**:
- View all orders with customization details
- Update order status
- Track order history
- View customer contact information
- See itemized jersey details

## Database Schema

### jersey_orders Table (Supabase)
```sql
CREATE TABLE jersey_orders (
  id UUID PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  customer_address TEXT,
  jersey_items JSONB, -- Array of JerseyOrderItem
  subtotal_usd DECIMAL(10,2),
  subtotal_bdt DECIMAL(10,2),
  tax DECIMAL(10,2),
  shipping DECIMAL(10,2),
  total_usd DECIMAL(10,2),
  total_bdt DECIMAL(10,2),
  status VARCHAR(50), -- pending, processing, shipped, delivered, cancelled
  payment_method VARCHAR(100),
  currency VARCHAR(10), -- USD or BDT
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## Data Service Methods

**StoreDataService** (lib/store-data-service.ts):

### Jersey Order Methods
- `getJerseyOrders()`: Fetch all jersey orders
- `getJerseyOrderById(id)`: Fetch specific order
- `createJerseyOrder(order)`: Create new order and persist to Supabase
- `updateJerseyOrderStatus(id, status)`: Update order status
- `deleteJerseyOrder(id)`: Remove order
- `mapJerseyOrder(data)`: Convert Supabase data to JerseyOrder object

## File Structure

```
/vercel/share/v0-project/
├── components/
│   └── JerseyStore.tsx (2,670+ lines)
├── lib/
│   ├── currency.ts (NEW - currency utilities)
│   └── store-data-service.ts (UPDATED - jersey order methods)
├── app/
│   ├── store/
│   │   └── jerseys/
│   │       └── page.tsx (NEW - store page)
│   └── admin/
│       └── store/
│           └── orders/
│               └── page.tsx (UPDATED - admin order manager)
└── JERSEY_STORE_IMPLEMENTATION.md (This file)
```

## Usage Flow

### Customer Journey
1. **Browse Store**: `/store/jerseys`
2. **Select Player**: Choose from real player data
3. **Customize Jersey**:
   - Choose kit type, size, badge
   - Set custom name/number
   - See live price in BDT
4. **Add to Cart**: Jersey saved as pending order
5. **Checkout**: Order persisted to Supabase

### Admin Journey
1. **View Orders**: `/admin/store/orders`
2. **Filter**: By status, search by customer/order
3. **Jersey Details**: See customization info
4. **Update Status**: Change order status
5. **Track**: See all customer orders

## Currency Display

All prices throughout the system:
- **Website**: Displays in BDT (৳ symbol)
- **Admin Panel**: Shows BDT pricing
- **Database**: Stores both USD and BDT for reference
- **Conversion**: Automatic, using 1 USD = 110 BDT rate

**Examples**:
- Base Jersey: $45 USD = ৳ 4,950 BDT
- With Badge: $53 USD = ৳ 5,830 BDT
- With All Options: $61 USD = ৳ 6,710 BDT

## Real Data Integration

### Player Data
- Loaded from `players` table in Supabase
- Displays:
  - Player name
  - Jersey number
  - Player image
  - Position info
  - Rating

### Order Persistence
- Orders stored in `jersey_orders` table
- Automatic timestamp tracking
- Status workflow management
- Full audit trail

## Bilingual Support

- **English**: Default interface
- **Bengali**: 
  - Order details in Bengali
  - Status labels translated
  - Form labels translated
  - Uses `useLanguage()` context hook

**Translated Strings**:
- Status labels (Pending, Processing, Shipped, etc.)
- Customer info labels
- Jersey customization labels
- Currency formatting in local locale

## Type Safety

All components use TypeScript with full type definitions:
- `JerseyOrder` - Order interface
- `JerseyOrderItem` - Jersey customization
- `Currency` - Currency type ('USD' | 'BDT')
- Full Supabase type mapping

## Error Handling

- Try-catch blocks on all async operations
- User-friendly error messages
- Console logging with [v0] prefix for debugging
- Graceful fallback states

## Performance Considerations

- Lazy loading of player data
- Memoized components to prevent re-renders
- Efficient Supabase queries
- Debounced search inputs
- Client-side filtering for responsiveness

## Testing Checklist

- [ ] Create new jersey order with customizations
- [ ] Verify BDT pricing calculations
- [ ] Update order status in admin panel
- [ ] Filter orders by status and customer
- [ ] Confirm Supabase persistence
- [ ] Test bilingual toggle
- [ ] Verify player data loads correctly
- [ ] Check responsive design (mobile/desktop)

## Future Enhancements

- Payment gateway integration (bKash, Nagad)
- Email notifications for order updates
- Order tracking via tracking number
- Customer account order history
- Bulk order discounts
- Size chart and fit guide
- User reviews and ratings
- Bulk jersey orders for teams

## Deployment Notes

1. Ensure `jersey_orders` table exists in Supabase
2. Run migration for new table if needed
3. Set exchange rate in currency.ts if updated
4. Configure email notifications (future)
5. Test with real player data before launch

## Support & Debugging

**Common Issues**:
- **Orders not saving**: Check Supabase connection
- **Price calculation off**: Verify EXCHANGE_RATE constant
- **Player data not loading**: Confirm players table access
- **BDT not displaying**: Check locale settings in formatPrice()

**Debug Steps**:
1. Check browser console for [v0] messages
2. Verify Supabase connection in browser DevTools
3. Check network tab for failed requests
4. Confirm user has appropriate permissions

## Commit History

- Integrate Jersey Store with real Supabase data and BDT currency
  - Added currency utility with USD/BDT conversion
  - Implemented jersey order CRUD operations
  - Updated admin order manager with jersey support
  - All orders persist to Supabase jersey_orders table
