const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// 🗄️ ตั้งค่าการเชื่อมต่อ SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'netcafe-db.sqlite'),
  logging: false, // ปิด log ของ SQL query
});

// 🧑‍💻 Users (ลูกค้าและสมาชิก VIP)
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone_number: { type: DataTypes.STRING, allowNull: true },
  is_vip: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

// 🖥️ Computers (เครื่องคอมพิวเตอร์)
const Computer = sequelize.define('Computer', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, defaultValue: 'Available' }, // ENUM -> STRING เพราะ SQLite ไม่รองรับ ENUM
  last_used: { type: DataTypes.DATE, allowNull: true },
}, { timestamps: true });

// ⏳ Sessions (การใช้งานคอมพิวเตอร์)
const Session = sequelize.define('Session', {
  start_time: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
  end_time: { type: DataTypes.DATE, allowNull: true },
  total_price: { type: DataTypes.FLOAT, allowNull: true },
}, { timestamps: true });

// 💰 Payments (การชำระเงิน)
const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.FLOAT, allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false }, // ENUM -> STRING
}, { timestamps: true });

// 🍔 Orders (พรีออเดอร์อาหาร)
const Order = sequelize.define('Order', {
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }, // ENUM -> STRING
}, { timestamps: true });

// 🥤 Order_Items (รายการอาหาร)
const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

// 📜 Products (เมนูอาหาร)
const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false }, // ENUM -> STRING
}, { timestamps: true });

// 🎟️ Coupons (คูปองส่วนลด)
const Coupon = sequelize.define('Coupon', {
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discount: { type: DataTypes.FLOAT, allowNull: false },
  expiry_date: { type: DataTypes.DATE, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

// 📊 Reports (รายงานยอดขาย)
const Report = sequelize.define('Report', {
  report_date: { type: DataTypes.DATEONLY, allowNull: false },
  total_income: { type: DataTypes.FLOAT, allowNull: false },
  total_users: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

// 🔔 Notifications (แจ้งเตือน)
const Notification = sequelize.define('Notification', {
  message: { type: DataTypes.TEXT, allowNull: false },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

// 🌐 **Relationships (ความสัมพันธ์ของตาราง)**
User.hasMany(Session, { foreignKey: 'user_id' });
Session.belongsTo(User, { foreignKey: 'user_id' });

Computer.hasMany(Session, { foreignKey: 'computer_id' });
Session.belongsTo(Computer, { foreignKey: 'computer_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

User.hasMany(Coupon, { foreignKey: 'user_id' });
Coupon.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// 🚀 **ฟังก์ชันเชื่อมต่อฐานข้อมูล**
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to SQLite database!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

// 🚀 **ฟังก์ชันสร้างฐานข้อมูล**
const initDB = async () => {
  try {
    console.log("📌 Syncing database...");
    await sequelize.sync({ force: true }); // บังคับให้สร้างใหม่หมด
    console.log('✅ Database & tables synchronized!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

// 📌 เชื่อมต่อและสร้างฐานข้อมูล
(async () => {
  await connectDB();
  await initDB();
})();

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
};
