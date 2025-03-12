// backend.js
const express = require('express');
const cors = require('cors');
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
const port = process.env.PORT || 8000;

// Middleware สำหรับแปลงข้อมูล JSON และเปิดใช้งาน CORS
app.use(cors());
app.use(express.json());

// Middleware สำหรับตรวจสอบสิทธิ์แอดมิน
const adminAuth = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  if (adminPassword && adminPassword === 'secret-admin-password') {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden: Admins only' });
  }
};

/* ================================
   Authentication Endpoints (สำหรับผู้ใช้ทั่วไป)
================================ */

// Endpoint สำหรับ Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin,
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint สำหรับ Register (สมัครสมาชิก)
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================================
   Public Endpoints (สำหรับผู้ใช้ทั่วไป)
================================ */

// Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      // หาก Notification ไม่ได้ใช้งาน ให้คอมเมนต์ออก
      include: [Session, Payment, Order],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/users/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [Session, Payment, Order],
    });
    if (userData) res.json(userData);
    else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/users/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (userData) {
      await userData.update(req.body);
      res.json(userData);
    } else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/users/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (userData) {
      await userData.destroy();
      res.json({ message: 'User deleted successfully' });
    } else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Computers
app.get('/computers', async (req, res) => {
  try {
    const computers = await Computer.findAll();
    res.json(computers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/computers/:id', async (req, res) => {
  try {
    const computer = await Computer.findByPk(req.params.id);
    if (computer) res.json(computer);
    else res.status(404).json({ error: 'Computer not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/computers', async (req, res) => {
  try {
    const newComputer = await Computer.create(req.body);
    res.status(201).json(newComputer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/computers/:id', async (req, res) => {
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
app.delete('/computers/:id', async (req, res) => {
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

// Sessions
app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/sessions/:id', async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id);
    if (session) res.json(session);
    else res.status(404).json({ error: 'Session not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/sessions', async (req, res) => {
  try {
    const newSession = await Session.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/sessions/:id', async (req, res) => {
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
app.delete('/sessions/:id', async (req, res) => {
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

// Payments
app.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/payments/:id', async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (payment) res.json(payment);
    else res.status(404).json({ error: 'Payment not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/payments', async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/payments/:id', async (req, res) => {
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
app.delete('/payments/:id', async (req, res) => {
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

// Orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: OrderItem,
        include: [Product]  // Include Product to get product name and price
      }]
    });
    if (order) res.json(order);
    else res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Endpoint สำหรับชำระเงิน อัปเดตสถานะออเดอร์เป็น "Paid"
app.put('/orders/:id/pay', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = 'Paid'; // หรือ 'Completed'
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/orders/:id', async (req, res) => {
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

// OrderItems
app.get('/orderitems', async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/orderitems/:id', async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (orderItem) res.json(orderItem);
    else res.status(404).json({ error: 'OrderItem not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/orderitems', async (req, res) => {
  try {
    const newOrderItem = await OrderItem.create(req.body);
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/orderitems/:id', async (req, res) => {
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
app.delete('/orderitems/:id', async (req, res) => {
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

// Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: 'Product not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/products/:id', async (req, res) => {
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
app.delete('/products/:id', async (req, res) => {
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

// Coupons
app.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/coupons/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (coupon) res.json(coupon);
    else res.status(404).json({ error: 'Coupon not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/coupons', async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/coupons/:id', async (req, res) => {
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
app.delete('/coupons/:id', async (req, res) => {
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

// Reports
app.get('/reports', async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/reports/:id', async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (report) res.json(report);
    else res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/reports', async (req, res) => {
  try {
    const newReport = await Report.create(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/reports/:id', async (req, res) => {
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
app.delete('/reports/:id', async (req, res) => {
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

// Notifications
app.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/notifications/:id', async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) res.json(notification);
    else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/notifications', async (req, res) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/notifications/:id', async (req, res) => {
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
app.delete('/notifications/:id', async (req, res) => {
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

// Reservations
// Endpoint สำหรับสร้าง Reservation
app.post('/reservations', async (req, res) => {
  try {
    // map ค่าจาก req.body ให้ตรงกับชื่อ field ใน Model (user_id, computer_id)
    const newReservation = await Reservation.create({
      user_id: req.body.UserId,
      computer_id: req.body.ComputerId,
      hours: req.body.hours,
      discount: req.body.discount,
      total_price: req.body.total_price,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      deadline: req.body.deadline,
      price_per_hour: req.body.price_per_hour,
      status: req.body.status,
      reservation_time: req.body.reservation_time
    });
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [User, Computer],
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/reservations/:id', async (req, res) => {
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
app.put('/reservations/:id', async (req, res) => {
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
app.delete('/reservations/:id', async (req, res) => {
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

/* ================================
   Admin Endpoints (เฉพาะแอดมิน) - ใช้ adminAuth middleware
================================ */

// Admin - Users
app.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Session, Payment, Order],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (userData) {
      await userData.update(req.body);
      res.json(userData);
    } else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (userData) {
      await userData.destroy();
      res.json({ message: 'User deleted successfully' });
    } else res.status(404).json({ error: 'User not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin - Computers
app.get('/admin/computers', adminAuth, async (req, res) => {
  try {
    const computers = await Computer.findAll();
    res.json(computers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/computers', adminAuth, async (req, res) => {
  try {
    const newComputer = await Computer.create(req.body);
    res.status(201).json(newComputer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/computers/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/computers/:id', adminAuth, async (req, res) => {
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

// Admin - Sessions
app.get('/admin/sessions', adminAuth, async (req, res) => {
  try {
    const sessions = await Session.findAll();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/sessions', adminAuth, async (req, res) => {
  try {
    const newSession = await Session.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/sessions/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/sessions/:id', adminAuth, async (req, res) => {
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

// Admin - Payments
app.get('/admin/payments', adminAuth, async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/payments', adminAuth, async (req, res) => {
  try {
    const newPayment = await Payment.create(req.body);
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/payments/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/payments/:id', adminAuth, async (req, res) => {
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

// Admin - Orders
app.get('/admin/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/orders', adminAuth, async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/orders/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/orders/:id', adminAuth, async (req, res) => {
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

// Admin - OrderItems
app.get('/admin/orderitems', adminAuth, async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/orderitems', adminAuth, async (req, res) => {
  try {
    const newOrderItem = await OrderItem.create(req.body);
    res.status(201).json(newOrderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/orderitems/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/orderitems/:id', adminAuth, async (req, res) => {
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

// Admin - Products
app.get('/admin/products', adminAuth, async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/products', adminAuth, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/products/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/products/:id', adminAuth, async (req, res) => {
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

// Admin - Coupons
app.get('/admin/coupons', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/coupons', adminAuth, async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/coupons/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/coupons/:id', adminAuth, async (req, res) => {
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

// Admin - Reports
app.get('/admin/reports', adminAuth, async (req, res) => {
  try {
    const reports = await Report.findAll();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/admin/reports/:id', adminAuth, async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (report) res.json(report);
    else res.status(404).json({ error: 'Report not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/reports', adminAuth, async (req, res) => {
  try {
    const newReport = await Report.create(req.body);
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/reports/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/reports/:id', adminAuth, async (req, res) => {
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

// Admin - Notifications
app.get('/admin/notifications', adminAuth, async (req, res) => {
  try {
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/admin/notifications/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (notification) res.json(notification);
    else res.status(404).json({ error: 'Notification not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/notifications', adminAuth, async (req, res) => {
  try {
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/notifications/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/notifications/:id', adminAuth, async (req, res) => {
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

// Admin - Reservations
app.get('/admin/reservations', adminAuth, async (req, res) => {
  try {
    const reservations = await Reservation.findAll({ include: [User, Computer] });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/admin/reservations/:id', adminAuth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id, { include: [User, Computer] });
    if (reservation) res.json(reservation);
    else res.status(404).json({ error: 'Reservation not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/admin/reservations', adminAuth, async (req, res) => {
  try {
    const newReservation = await Reservation.create(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put('/admin/reservations/:id', adminAuth, async (req, res) => {
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
app.delete('/admin/reservations/:id', adminAuth, async (req, res) => {
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

/* ================================
   สร้าง Admin User (username: admin, password: 1234)
================================ */
async function createAdminUser() {
  try {
    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      await User.create({
        username: 'admin',
        password: '1234',
        email: 'admin@example.com',
        phone_number: '',
        is_vip: false,
        is_admin: true
      });
      console.log('Admin user created.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

/* ================================
   เริ่มต้นเซิร์ฟเวอร์หลังจากซิงค์ฐานข้อมูล
================================ */
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database & tables synchronized with force!');
    createAdminUser();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

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
