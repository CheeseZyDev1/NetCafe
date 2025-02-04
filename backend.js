// backend.js
const express = require('express');
const {
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
} = require('./CreateDB');

const app = express();
const port = process.env.PORT || 3000;

// Middleware สำหรับแปลงข้อมูล JSON
app.use(express.json());

// ----------------------------------------
// Middleware สำหรับตรวจสอบสิทธิ์ของแอดมิน
// ----------------------------------------
const adminAuth = (req, res, next) => {
  const token = req.headers['x-admin-auth'];
  if (token && token === 'secret-admin-token') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admins only' });
  }
};

// ================================
// Endpoints สำหรับ Users
// ================================

// ดึงข้อมูล Users ทั้งหมด (เฉพาะแอดมิน)
app.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Session, Payment, Order, Notification],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล User ตาม id (เฉพาะแอดมิน)
app.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Session, Payment, Order, Notification],
    });
    if (user) res.json(user);
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้าง User ใหม่ (เปิดให้ลูกค้าสมัครสมาชิก)
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไขข้อมูล User ตาม id (เฉพาะแอดมิน)
app.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ User ตาม id (เฉพาะแอดมิน)
app.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Computers
// ================================

// ดึงข้อมูลเครื่องคอมพิวเตอร์ทั้งหมด (เปิดให้ลูกค้าเข้าดูได้)
app.get('/computers', async (req, res) => {
  try {
    const computers = await Computer.findAll();
    res.json(computers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูลเครื่องคอมพิวเตอร์ตาม id (เปิดให้ลูกค้าเข้าดูได้)
app.get('/computers/:id', async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (computer) res.json(computer);
    else res.status(404).json({ error: 'Computer not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้างเครื่องคอมพิวเตอร์ใหม่ (เฉพาะแอดมิน)
app.post('/computers', adminAuth, async (req, res) => {
  try {
    const newComputer = await Computer.create(req.body);
    res.status(201).json(newComputer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไขข้อมูลเครื่องคอมพิวเตอร์ (เฉพาะแอดมิน)
app.put('/computers/:id', adminAuth, async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (computer) {
      await computer.update(req.body);
      res.json(computer);
    } else res.status(404).json({ error: 'Computer not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบเครื่องคอมพิวเตอร์ (เฉพาะแอดมิน)
app.delete('/computers/:id', adminAuth, async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (computer) {
      await computer.destroy();
      res.json({ message: 'Computer deleted successfully' });
    } else res.status(404).json({ error: 'Computer not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Sessions
// ================================

// ดึงข้อมูล Sessions ทั้งหมด (เฉพาะแอดมิน)
app.get('/sessions', adminAuth, async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Session ตาม id (เฉพาะแอดมิน)
app.get('/sessions/:id', adminAuth, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (session) res.json(session);
    else res.status(404).json({ error: 'Session not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้าง Session ใหม่ (เปิดให้ระบบ/ลูกค้าสร้างได้)
app.post('/sessions', async (req, res) => {
  try {
    const newSession = await Session.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไข Session (เฉพาะแอดมิน)
app.put('/sessions/:id', adminAuth, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (session) {
      await session.update(req.body);
      res.json(session);
    } else res.status(404).json({ error: 'Session not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ Session (เฉพาะแอดมิน)
app.delete('/sessions/:id', adminAuth, async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (session) {
      await session.destroy();
      res.json({ message: 'Session deleted successfully' });
    } else res.status(404).json({ error: 'Session not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Payments
// ================================

// ดึงข้อมูล Payments ทั้งหมด (เฉพาะแอดมิน)
app.get('/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Payment ตาม id (เฉพาะแอดมิน)
app.get('/payments/:id', adminAuth, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (payment) res.json(payment);
    else res.status(404).json({ error: 'Payment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้าง Payment ใหม่ (เปิดให้ลูกค้าชำระเงิน)
app.post('/payments', async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไข Payment (เฉพาะแอดมิน)
app.put('/payments/:id', adminAuth, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (payment) {
      await payment.update(req.body);
      res.json(payment);
    } else res.status(404).json({ error: 'Payment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ Payment (เฉพาะแอดมิน)
app.delete('/payments/:id', adminAuth, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (payment) {
      await payment.destroy();
      res.json({ message: 'Payment deleted successfully' });
    } else res.status(404).json({ error: 'Payment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Orders
// ================================

// ดึงข้อมูล Orders ทั้งหมด (เฉพาะแอดมิน)
app.get('/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Order ตาม id (เฉพาะแอดมิน)
app.get('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
    if (order) res.json(order);
    else res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้าง Order ใหม่ (เปิดให้ลูกค้าสั่งอาหาร)
app.post('/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไข Order (เฉพาะแอดมิน)
app.put('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.update(req.body);
      res.json(order);
    } else res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ Order (เฉพาะแอดมิน)
app.delete('/orders/:id', adminAuth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (order) {
      await order.destroy();
      res.json({ message: 'Order deleted successfully' });
    } else res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ OrderItems
// ================================

// ดึงข้อมูล OrderItems ทั้งหมด (เฉพาะแอดมิน)
app.get('/orderitems', adminAuth, async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล OrderItem ตาม id (เฉพาะแอดมิน)
app.get('/orderitems/:id', adminAuth, async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) res.json(orderItem);
    else res.status(404).json({ error: 'OrderItem not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้าง OrderItem ใหม่ (เปิดให้ลูกค้าสร้าง Order พร้อมรายการสินค้า)
app.post('/orderitems', async (req, res) => {
  try {
    const newOrderItem = await OrderItem.create(req.body);
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไข OrderItem (เฉพาะแอดมิน)
app.put('/orderitems/:id', adminAuth, async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) {
      await orderItem.update(req.body);
      res.json(orderItem);
    } else res.status(404).json({ error: 'OrderItem not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ OrderItem (เฉพาะแอดมิน)
app.delete('/orderitems/:id', adminAuth, async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) {
      await orderItem.destroy();
      res.json({ message: 'OrderItem deleted successfully' });
    } else res.status(404).json({ error: 'OrderItem not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Products (เมนูอาหาร)
// ================================

// ดึงข้อมูล Products ทั้งหมด (เปิดให้ลูกค้าเข้าดูเมนูอาหาร)
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล Product ตาม id (เปิดให้ลูกค้าเข้าดูเมนูอาหาร)
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// สร้าง Product ใหม่ (เฉพาะแอดมิน)
app.post('/products', adminAuth, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไข Product (เฉพาะแอดมิน)
app.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.update(req.body);
      res.json(product);
    } else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ Product (เฉพาะแอดมิน)
app.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: 'Product deleted successfully' });
    } else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Coupons
// ================================

app.get('/coupons', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/coupons/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (coupon) res.json(coupon);
    else res.status(404).json({ error: 'Coupon not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/coupons', adminAuth, async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/coupons/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (coupon) {
      await coupon.update(req.body);
      res.json(coupon);
    } else res.status(404).json({ error: 'Coupon not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/coupons/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (coupon) {
      await coupon.destroy();
      res.json({ message: 'Coupon deleted successfully' });
    } else res.status(404).json({ error: 'Coupon not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Reports
// ================================

app.get('/reports', adminAuth, async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/reports/:id', adminAuth, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (report) res.json(report);
    else res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/reports', adminAuth, async (req, res) => {
  try {
    const newReport = await Report.create(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/reports/:id', adminAuth, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (report) {
      await report.update(req.body);
      res.json(report);
    } else res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/reports/:id', adminAuth, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (report) {
      await report.destroy();
      res.json({ message: 'Report deleted successfully' });
    } else res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Notifications
// ================================

app.get('/notifications', adminAuth, async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/notifications/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) res.json(notification);
    else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/notifications', adminAuth, async (req, res) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/notifications/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) {
      await notification.update(req.body);
      res.json(notification);
    } else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/notifications/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) {
      await notification.destroy();
      res.json({ message: 'Notification deleted successfully' });
    } else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// Endpoints สำหรับ Reservations
// ================================

// ลูกค้าสามารถจองเครื่องคอมพิวเตอร์ได้ (ไม่ต้องมี adminAuth)
app.post('/reservations', async (req, res) => {
  // คาดหวัง req.body มี { user_id, computer_id, reservation_time }
  try {
    const newReservation = await Reservation.create(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงรายการ Reservations ทั้งหมด (เฉพาะแอดมิน)
app.get('/reservations', adminAuth, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [User, Computer],
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงรายละเอียด Reservation ตาม id (เฉพาะแอดมิน)
app.get('/reservations/:id', adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [User, Computer],
    });
    if (reservation) res.json(reservation);
    else res.status(404).json({ error: 'Reservation not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไข Reservation (เฉพาะแอดมิน)
app.put('/reservations/:id', adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (reservation) {
      await reservation.update(req.body);
      res.json(reservation);
    } else res.status(404).json({ error: 'Reservation not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ลบ Reservation (เฉพาะแอดมิน)
app.delete('/reservations/:id', adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (reservation) {
      await reservation.destroy();
      res.json({ message: 'Reservation deleted successfully' });
    } else res.status(404).json({ error: 'Reservation not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================================
// เริ่มต้นเซิร์ฟเวอร์
// ================================
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to the database!');
    console.log(`🚀 Server is running on port ${port}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});
