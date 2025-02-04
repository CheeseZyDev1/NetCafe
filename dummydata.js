// dummyData.js
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
    Notification 
  } = require('./CreateDB');
  
  const seedDummyData = async () => {
    try {
      // ถ้าต้องการลบและสร้างตารางใหม่ทั้งหมด (force sync)
      await sequelize.sync({ force: true });
      console.log('✅ Database & tables recreated.');
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Users
      // ================================
      const user1 = await User.create({
        username: "alice",
        password: "password1",
        email: "alice@example.com",
        phone_number: "0123456789",
        is_vip: true
      });
      const user2 = await User.create({
        username: "bob",
        password: "password2",
        email: "bob@example.com",
        phone_number: "0987654321",
        is_vip: false
      });
      console.log("✅ Dummy users created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Computers
      // ================================
      const computer1 = await Computer.create({
        name: "PC-A",
        status: "Available"
      });
      const computer2 = await Computer.create({
        name: "PC-B",
        status: "In Use"
      });
      console.log("✅ Dummy computers created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Sessions
      // ================================
      const session1 = await Session.create({
        user_id: user1.id,
        computer_id: computer1.id,
        total_price: 100
      });
      const session2 = await Session.create({
        user_id: user2.id,
        computer_id: computer2.id,
        total_price: 80
      });
      console.log("✅ Dummy sessions created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Payments
      // ================================
      const payment1 = await Payment.create({
        user_id: user1.id,
        amount: 100,
        payment_method: "Credit Card"
      });
      const payment2 = await Payment.create({
        user_id: user2.id,
        amount: 80,
        payment_method: "Cash"
      });
      console.log("✅ Dummy payments created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Products
      // ================================
      const product1 = await Product.create({
        name: "Coffee",
        price: 30,
        category: "Drink"
      });
      const product2 = await Product.create({
        name: "Sandwich",
        price: 50,
        category: "Food"
      });
      const product3 = await Product.create({
        name: "Cake",
        price: 40,
        category: "Dessert"
      });
      console.log("✅ Dummy products created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Orders และ OrderItems
      // ================================
      const order1 = await Order.create({
        user_id: user1.id,
        total_price: 120,
        status: "Completed"
      });
      const order2 = await Order.create({
        user_id: user2.id,
        total_price: 90,
        status: "Pending"
      });
      // สร้าง OrderItems สำหรับ order1
      await OrderItem.create({
        order_id: order1.id,
        product_id: product1.id,
        quantity: 1
      });
      await OrderItem.create({
        order_id: order1.id,
        product_id: product2.id,
        quantity: 1
      });
      // สร้าง OrderItems สำหรับ order2
      await OrderItem.create({
        order_id: order2.id,
        product_id: product3.id,
        quantity: 2
      });
      console.log("✅ Dummy orders and order items created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Coupons
      // ================================
      const coupon1 = await Coupon.create({
        code: "ALICE50",
        discount: 50,
        expiry_date: new Date("2025-12-31"),
        is_active: true,
        user_id: user1.id
      });
      const coupon2 = await Coupon.create({
        code: "BOB20",
        discount: 20,
        expiry_date: new Date("2025-06-30"),
        is_active: true,
        user_id: user2.id
      });
      console.log("✅ Dummy coupons created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Reports
      // ================================
      const report1 = await Report.create({
        report_date: new Date(),
        total_income: 180,
        total_users: 2
      });
      console.log("✅ Dummy reports created.");
  
      // ================================
      // สร้างข้อมูล dummy สำหรับ Notifications
      // ================================
      await Notification.create({
        user_id: user1.id,
        message: "Welcome Alice! Your session has started."
      });
      await Notification.create({
        user_id: user2.id,
        message: "Welcome Bob! Enjoy your session."
      });
      console.log("✅ Dummy notifications created.");
  
      console.log("🎉 All dummy data seeded successfully!");
    } catch (error) {
      console.error("❌ Error seeding dummy data:", error);
    } finally {
      await sequelize.close();
      console.log("🔌 Database connection closed.");
    }
  };
  
  seedDummyData();
  