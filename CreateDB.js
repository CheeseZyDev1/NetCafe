// CreateDB.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// ตั้งค่าการเชื่อมต่อ SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'netcafe-db.sqlite'),
  logging: false,
});

// ----------------------
// Models
// ----------------------

// Users (ลูกค้าและสมาชิก VIP)
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING, allowNull: true },
  is_vip:   { type: DataTypes.BOOLEAN, defaultValue: false },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true, freezeTableName: true });

// Computers (เครื่องคอมพิวเตอร์)
const Computer = sequelize.define('Computer', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, defaultValue: 'Available' },
  last_used: { type: DataTypes.DATE, allowNull: true },
  price_per_hour: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 50 },
}, { timestamps: true });

// Sessions (การใช้งานคอมพิวเตอร์)
const Session = sequelize.define('Session', {
  start_time: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  end_time:   { type: DataTypes.DATE, allowNull: true },
  total_price:{ type: DataTypes.FLOAT, allowNull: true },
}, { timestamps: true });

// Payments (การชำระเงิน)
const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

// Orders (พรีออเดอร์อาหาร)
const Order = sequelize.define('Order', {
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
}, { timestamps: true });

// OrderItems (รายการอาหาร)
const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

// Products (เมนูอาหาร) – ต้องมีราคา > 0 และ stock
const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },  // ราคา ต้องมากกว่า 0
  category: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { timestamps: true });

// Reservations (การจองเครื่องคอมพิวเตอร์)
const Reservation = sequelize.define('Reservation', {
  reservation_time: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  hours: { type: DataTypes.INTEGER, allowNull: true },
  discount: { type: DataTypes.FLOAT, allowNull: true },
  total_price: { type: DataTypes.FLOAT, allowNull: true },
  start_time: { type: DataTypes.DATE, allowNull: true },
  end_time: { type: DataTypes.DATE, allowNull: true },
  deadline: { type: DataTypes.BIGINT, allowNull: true },
  price_per_hour: { type: DataTypes.FLOAT, allowNull: true }
}, { timestamps: true });

// ----------------------
// Relationships
// ----------------------

// User - Session
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Computer - Session
Computer.hasMany(Session, { foreignKey: 'computer_id', onDelete: 'CASCADE' });
Session.belongsTo(Computer, { foreignKey: 'computer_id', onDelete: 'CASCADE' });

// User - Payment
User.hasMany(Payment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Payment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// User - Order
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Order - OrderItem
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'CASCADE' });

// Product - OrderItem
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// User - Reservation
User.hasMany(Reservation, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Computer - Reservation
Computer.hasMany(Reservation, { foreignKey: 'computer_id', onDelete: 'CASCADE' });
Reservation.belongsTo(Computer, { foreignKey: 'computer_id', onDelete: 'CASCADE' });

// ----------------------
// Sync & Connect
// ----------------------
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to SQLite database!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

const initDB = async () => {
  try {
    console.log("📌 Syncing database...");
    await sequelize.sync({ alter: true });
    console.log('✅ Database & tables synchronized!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

if (require.main === module) {
  (async () => {
    await connectDB();
    await initDB();
  })();
}

module.exports = {
  sequelize,
  User,
  Computer,
  Session,
  Payment,
  Order,
  OrderItem,
  Product,
  Reservation,
};
