// SeedData.js
const {
    sequelize,
    User,
    Computer,
    Session,
    Payment,
    Order,
    OrderItem,
    Product,
    Reservation
  } = require('./CreateDB'); // ปรับ path ให้ถูกต้อง
  
  (async () => {
    try {
      await sequelize.authenticate();
      console.log("Connected to database successfully!");
  
      // ล้างข้อมูลเก่า (ถ้าต้องการ) เพื่อไม่ให้ซ้ำซ้อน
      // *** ระวัง: จะทำให้ข้อมูลที่มีอยู่แล้วหาย ***
      // await sequelize.sync({ force: true });
  
      // หรือถ้าต้องการแค่ sync โครงสร้างโดยไม่ล้างข้อมูล
      // await sequelize.sync({ alter: true });
  
      // สร้าง dummy data ให้แต่ละตาราง อย่างละ 15 รายการ
      await createDummyUsers(15);
      await createDummyComputers(15);
      await createDummyProducts(15);
      await createDummyOrders(15);
      await createDummyOrderItems(15);
      await createDummyPayments(15);
      await createDummySessions(15);
      await createDummyReservations(15);
  
      console.log("✅ Seeding dummy data completed!");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error seeding data:", error);
      process.exit(1);
    }
  })();
  
  /* ========== ฟังก์ชันสำหรับสร้าง Dummy Data ========== */
  
  // สร้าง Dummy Users
  async function createDummyUsers(count) {
    for (let i = 1; i <= count; i++) {
      await User.create({
        username: `user${i}`,
        password: `pass${i}`,
        email: `user${i}@example.com`,
        phone_number: `09000000${i}`,
        is_vip: i % 2 === 0,   // สลับ true/false
        is_admin: i === 1      // สมมติให้ user1 เป็น admin
      });
    }
    console.log(`✅ Created ${count} Users`);
  }
  
  // สร้าง Dummy Computers
  async function createDummyComputers(count) {
    const statuses = ["Available", "In Use", "Maintenance"];
    for (let i = 1; i <= count; i++) {
      await Computer.create({
        name: `Computer_${i}`,
        status: statuses[i % statuses.length],
        last_used: new Date()
      });
    }
    console.log(`✅ Created ${count} Computers`);
  }
  
  // สร้าง Dummy Products (ใช้ฟิลด์ stock)
  async function createDummyProducts(count) {
    const categories = ["Food", "Drink", "Snack"];
    for (let i = 1; i <= count; i++) {
      await Product.create({
        name: `Product_${i}`,
        price: 10 + i * 2,
        category: categories[i % categories.length],
        stock: 5 + (i % 10) // เช่น มี stock ตั้งแต่ 5 ถึง 14
      });
    }
    console.log(`✅ Created ${count} Products`);
  }
  
  // สร้าง Dummy Orders
  async function createDummyOrders(count) {
    // สมมติให้ user_id = 1 ถึง 5 เท่านั้น
    for (let i = 1; i <= count; i++) {
      await Order.create({
        total_price: 50 + i * 5,
        status: i % 2 === 0 ? "Pending" : "Completed",
        user_id: ((i % 5) + 1)  // หมุนเวียนค่า 1..5
      });
    }
    console.log(`✅ Created ${count} Orders`);
  }
  
  // สร้าง Dummy OrderItems
  async function createDummyOrderItems(count) {
    // สมมติให้ order_id = 1..5, product_id = 1..5
    for (let i = 1; i <= count; i++) {
      await OrderItem.create({
        quantity: 1 + (i % 3),
        order_id: ((i % 5) + 1),
        product_id: ((i % 5) + 1)
      });
    }
    console.log(`✅ Created ${count} OrderItems`);
  }
  
  // สร้าง Dummy Payments
  async function createDummyPayments(count) {
    const methods = ["Cash", "Credit Card", "Online"];
    // สมมติให้ user_id = 1..5
    for (let i = 1; i <= count; i++) {
      await Payment.create({
        amount: 100 + i * 10,
        payment_method: methods[i % methods.length],
        user_id: ((i % 5) + 1)
      });
    }
    console.log(`✅ Created ${count} Payments`);
  }
  
  // สร้าง Dummy Sessions
  async function createDummySessions(count) {
    // สมมติให้ user_id = 1..5, computer_id = 1..5
    for (let i = 1; i <= count; i++) {
      const start = new Date();
      const end = new Date(start.getTime() + i * 60 * 1000); // บวก i นาที
      await Session.create({
        start_time: start,
        end_time: end,
        total_price: i * 5,
        user_id: ((i % 5) + 1),
        computer_id: ((i % 5) + 1)
      });
    }
    console.log(`✅ Created ${count} Sessions`);
  }
  
  // สร้าง Dummy Reservations
  async function createDummyReservations(count) {
    // สมมติให้ user_id = 1..5, computer_id = 1..5
    for (let i = 1; i <= count; i++) {
      const now = new Date();
      await Reservation.create({
        reservation_time: now,
        status: i % 2 === 0 ? "Pending" : "Completed",
        hours: 1 + (i % 3),
        discount: i % 2 === 0 ? 10 : 0,
        total_price: 30 + i * 3,
        start_time: now,
        end_time: new Date(now.getTime() + i * 60 * 60 * 1000),
        user_id: ((i % 5) + 1),
        computer_id: ((i % 5) + 1)
      });
    }
    console.log(`✅ Created ${count} Reservations`);
  }
  