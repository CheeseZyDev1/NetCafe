// app.js
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
} = require('./CreateDB');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// ================================
// CRUD Endpoints สำหรับ Users
// ================================

// ดึงข้อมูล Users ทั้งหมด (พร้อมข้อมูลความสัมพันธ์)
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [Session, Payment, Order, Notification],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงข้อมูล User ตาม id
app.get('/users/:id', async (req, res) => {
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

// สร้าง User ใหม่
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// แก้ไขข้อมูล User ตาม id
app.put('/users/:id', async (req, res) => {
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

// ลบ User ตาม id
app.delete('/users/:id', async (req, res) => {
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
// CRUD Endpoints สำหรับ Computers
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Sessions
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Payments
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Orders
// ================================

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
    const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
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

app.put('/orders/:id', async (req, res) => {
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

// ================================
// CRUD Endpoints สำหรับ OrderItems
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Products
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Coupons
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Reports
// ================================

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

// ================================
// CRUD Endpoints สำหรับ Notifications
// ================================

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

// ================================
// เริ่มต้นเซิร์ฟเวอร์
// ================================
app.listen(port, async () => {
  try {
    // ทดสอบการเชื่อมต่อฐานข้อมูลก่อนเปิดเซิร์ฟเวอร์
    await sequelize.authenticate();
    console.log('✅ Connected to the database!');
    console.log(`🚀 Server is running on port ${port}`);
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
});
