// CreateDB.js
require('dotenv').config(); // อ่านค่า .env

const { Sequelize, DataTypes } = require('sequelize');

// ตั้งค่าการเชื่อมต่อ PostgreSQL สำหรับ Railway โดยใช้ DATABASE_URL จาก .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // รองรับ Railway
    },
  },
  logging: false,
});

// ----------------------
// Models
// ----------------------

// Users (ลูกค้าและสมาชิก VIP)
const User = sequelize.define('user', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email:    { type: DataTypes.STRING, allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING, allowNull: true },
  is_vip:   { type: DataTypes.BOOLEAN, defaultValue: false },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true, tableName: 'users' });

// Computers (เครื่องคอมพิวเตอร์)
const Computer = sequelize.define('computer', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, defaultValue: 'Available', allowNull: false },
  last_used: { type: DataTypes.DATE, allowNull: true },
  price_per_hour: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 50 },
}, { timestamps: true });

// Sessions (การใช้งานคอมพิวเตอร์)
const Session = sequelize.define('session', {
  start_time: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: Sequelize.NOW 
  },
  end_time:   { type: DataTypes.DATE, allowNull: true },
  total_price:{ 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    defaultValue: 0 
  },
}, { timestamps: true });

// Payments (การชำระเงิน)
const Payment = sequelize.define('payment', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

// Orders (พรีออเดอร์อาหาร)
const Order = sequelize.define('order', {
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending', allowNull: false },
}, { timestamps: true });

// OrderItems (รายการอาหาร)
const OrderItem = sequelize.define('orderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

// Products (เมนูอาหาร) – ราคาต้อง > 0 และ stock
const Product = sequelize.define('product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
}, { timestamps: true });

// Coupons (ตัวอย่าง Model คูปอง)
const Coupon = sequelize.define('coupon', {
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
}, { timestamps: true });

// Reports (ตัวอย่าง Model รายงาน)
const Report = sequelize.define('report', {
  title: { type: DataTypes.STRING, allowNull: false },
  detail: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: true });

// Notifications (ตัวอย่าง Model การแจ้งเตือน)
const Notification = sequelize.define('notification', {
  message: { type: DataTypes.STRING, allowNull: false },
  read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

// Reservations (การจองเครื่องคอมพิวเตอร์)
// ฟิลด์ deadline ถูกลบออก
const Reservation = sequelize.define('reservation', {
  reservation_time: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: Sequelize.NOW 
  },
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'Pending',
    allowNull: false
  },
  hours: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1 
  },
  discount: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    defaultValue: 0 
  },
  total_price: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    defaultValue: 0 
  },
  start_time: { type: DataTypes.DATE, allowNull: true },
  end_time: { type: DataTypes.DATE, allowNull: true },
  price_per_hour: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    defaultValue: 50 
  }
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
// Sync & Connect (ใช้ force: true เพื่อรีเซ็ตตารางทั้งหมด)
// ----------------------
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL database!');
  } catch (error) {
    console.error('❌ PostgreSQL Connection Error:', error);
  }
};

const initDB = async () => {
  try {
    console.log("📌 Syncing database with force: true (all tables will be dropped and recreated)...");
    await sequelize.sync({ force: true });
    console.log('✅ Database & tables synchronized with force!');
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
  Coupon,
  Report,
  Notification,
  Reservation,
};
