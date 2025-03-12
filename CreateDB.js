// CreateDB.js
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
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true, freezeTableName: true });

// 🖥️ Computers (เครื่องคอมพิวเตอร์)
const Computer = sequelize.define('Computer', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.STRING, defaultValue: 'Available' },
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
  payment_method: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: true });

// 🍔 Orders (พรีออเดอร์อาหาร)
const Order = sequelize.define('Order', {
  total_price: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
}, { timestamps: true });

// 🥤 Order_Items (รายการอาหาร)
const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, { timestamps: true });

// 📜 Products (เมนูอาหาร) — เพิ่ม quantity
const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 } // เปลี่ยนชื่อเป็น stock
}, { timestamps: true });


/*
// 🎟️ Coupons (คูปองส่วนลด)
// (คอมเมนต์ออกเนื่องจากยังไม่ได้ใช้งาน)
// const Coupon = sequelize.define('Coupon', {
//   code: { type: DataTypes.STRING, allowNull: false, unique: true },
//   discount: { type: DataTypes.FLOAT, allowNull: false },
//   expiry_date: { type: DataTypes.DATE, allowNull: false },
//   is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
// }, { timestamps: true });

// 📊 Reports (รายงานยอดขาย)
// (คอมเมนต์ออกเนื่องจากยังไม่ได้ใช้งาน)
// const Report = sequelize.define('Report', {
//   report_date: { type: DataTypes.DATEONLY, allowNull: false },
//   total_income: { type: DataTypes.FLOAT, allowNull: false },
//   total_users: { type: DataTypes.INTEGER, allowNull: false },
// }, { timestamps: true });

// 🔔 Notifications (แจ้งเตือน)
// (คอมเมนต์ออกเนื่องจากยังไม่ได้ใช้งาน)
// const Notification = sequelize.define('Notification', {
//   message: { type: DataTypes.TEXT, allowNull: false },
//   is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
// }, { timestamps: true });
*/

// 📅 Reservations (การจองเครื่องคอมพิวเตอร์)
const Reservation = sequelize.define('Reservation', {
  reservation_time: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
  hours: { type: DataTypes.INTEGER, allowNull: true },       // จำนวนชั่วโมงที่จอง
  discount: { type: DataTypes.FLOAT, allowNull: true },      // ส่วนลด (เปอร์เซ็นต์)
  total_price: { type: DataTypes.FLOAT, allowNull: true },   // ราคาสุทธิหลังหักส่วนลด
  start_time: { type: DataTypes.DATE, allowNull: true },     // เวลาเริ่มต้นใช้งาน
  end_time: { type: DataTypes.DATE, allowNull: true },       // เวลาสิ้นสุดใช้งาน
}, { timestamps: true });

// 🌐 **Relationships (ความสัมพันธ์ของตาราง)**

// 1) Users <-> Sessions
User.hasMany(Session, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// 2) Computers <-> Sessions
Computer.hasMany(Session, { foreignKey: 'computer_id', onDelete: 'CASCADE' });
Session.belongsTo(Computer, { foreignKey: 'computer_id', onDelete: 'CASCADE' });

// 3) Users <-> Payments
User.hasMany(Payment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Payment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// 4) Users <-> Orders
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// 5) Orders <-> OrderItems
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', onDelete: 'CASCADE' });

// 6) Products <-> OrderItems
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// 7) Reservations
User.hasMany(Reservation, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Reservation.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

Computer.hasMany(Reservation, { foreignKey: 'computer_id', onDelete: 'CASCADE' });
Reservation.belongsTo(Computer, { foreignKey: 'computer_id', onDelete: 'CASCADE' });

// 🚀 **ฟังก์ชันเชื่อมต่อและซิงค์ฐานข้อมูล**
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
  //Coupon,
  //Report,
  //Notification,
  Reservation,
};
