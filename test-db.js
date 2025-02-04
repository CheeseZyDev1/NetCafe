// testDatabase.js
const { sequelize, User, Computer, Session, Payment, Order, OrderItem, Product, Coupon, Notification } = require('./CreateDB');

const testDatabase = async () => {
  try {
    console.log('🚀 Starting CRUD tests...');
    
    // ตรวจสอบให้แน่ใจว่าตารางถูกซิงค์แล้ว
    await sequelize.sync();

    // 📌 (1) CREATE - เพิ่มข้อมูลเข้าไปในตาราง
    console.log('📌 Creating test data...');
    
    const user = await User.create({ 
      username: 'testuser', 
      password: 'password123', 
      email: 'test@example.com', 
      phone_number: '0812345678', 
      is_vip: true 
    });

    const computer = await Computer.create({ name: 'PC-01', status: 'Available' });

    const session = await Session.create({ user_id: user.id, computer_id: computer.id, total_price: 50 });

    const payment = await Payment.create({ user_id: user.id, amount: 100, payment_method: 'Cash' });

    const order = await Order.create({ user_id: user.id, total_price: 150, status: 'Pending' });

    const product = await Product.create({ name: 'Coke', price: 20, category: 'Drink' });

    const orderItem = await OrderItem.create({ order_id: order.id, product_id: product.id, quantity: 2 });

    const coupon = await Coupon.create({ code: 'DISCOUNT50', discount: 50, expiry_date: '2025-12-31' });

    const notification = await Notification.create({ user_id: user.id, message: 'Your order is ready!' });

    console.log('✅ Data created successfully!');

    // 📖 (2) READ - ดึงข้อมูลจากฐานข้อมูล
    console.log('📌 Reading test data...');
    const allUsers = await User.findAll({ include: [Session, Payment, Order, Notification] });
    console.log('👥 All Users:', JSON.stringify(allUsers, null, 2));

    const allOrders = await Order.findAll({ include: [OrderItem] });
    console.log('🍽️ All Orders:', JSON.stringify(allOrders, null, 2));

    // ✏️ (3) UPDATE - แก้ไขข้อมูล
    console.log('📌 Updating test data...');
    const updatedUser = await User.findByPk(user.id);
    if (updatedUser) {
      await updatedUser.update({ phone_number: '0998765432' });
      console.log('✅ Updated User Phone Number:', updatedUser.phone_number);
    } else {
      console.error('❌ Error: User not found in database');
    }

    // 🗑️ (4) DELETE - ลบข้อมูล
    console.log('📌 Deleting test data...');
    
    // ปิด foreign key constraints ชั่วคราว (สำหรับ SQLite)
    await sequelize.query('PRAGMA foreign_keys = OFF');

    await orderItem.destroy();
    await order.destroy();
    await session.destroy();
    await payment.destroy();
    await notification.destroy();
    await coupon.destroy();
    await product.destroy();
    await computer.destroy();
    await user.destroy();

    // เปิด foreign key constraints กลับมา
    await sequelize.query('PRAGMA foreign_keys = ON');

    console.log('✅ Test data deleted successfully!');
    console.log('🎉 All CRUD operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing database:', error);
  } finally {
    try {
      await sequelize.close();
      console.log('🔌 Database connection closed.');
    } catch (error) {
      console.error('❌ Error closing database:', error);
    }
  }
};

// เรียกใช้ฟังก์ชันทดสอบ
testDatabase();
