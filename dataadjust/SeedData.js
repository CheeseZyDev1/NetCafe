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
} = require('../CreateDB2'); 

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully!");

    // ลดจำนวน Dummy Data ให้เหลือ 5-6 รายการต่อประเภท
    await createDummyUsers(5);
    await createDummyComputers(5);
    await createDummyProducts(6);
    await createDummyOrders(5);
    await createDummyOrderItems(5);
    await createDummyPayments(5);
    await createDummySessions(5);
    await createDummyReservations(5);

    console.log("✅ Seeding optimized dummy data completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
})();

/* ========== ฟังก์ชันสำหรับสร้าง Dummy Data ========== */

async function createDummyUsers(count) {
  for (let i = 1; i <= count; i++) {
    await User.create({
      username: `user${i}`,
      password: `pass${i}`,
      email: `user${i}@example.com`,
      phone_number: `09000000${i}`,
      is_vip: i % 2 === 0,
      is_admin: i === 1
    });
  }
  console.log(`✅ Created ${count} Users`);
}

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

async function createDummyProducts(count) {
  const productNames = ["Coke", "Pepsi", "Lays", "Doritos", "Snickers", "KitKat"];
  for (let i = 0; i < count; i++) {
    await Product.create({
      name: productNames[i],
      price: 10 + i * 2,
      category: i < 2 ? "Drink" : "Snack",
      stock: 5 + (i % 10)
    });
  }
  console.log(`✅ Created ${count} Products`);
}

async function createDummyOrders(count) {
  for (let i = 1; i <= count; i++) {
    await Order.create({
      total_price: 50 + i * 5,
      status: i % 2 === 0 ? "Pending" : "Completed",
      user_id: ((i % 5) + 1)
    });
  }
  console.log(`✅ Created ${count} Orders`);
}

async function createDummyOrderItems(count) {
  for (let i = 1; i <= count; i++) {
    await OrderItem.create({
      quantity: 1 + (i % 3),
      order_id: ((i % 5) + 1),
      product_id: ((i % 5) + 1)
    });
  }
  console.log(`✅ Created ${count} OrderItems`);
}

async function createDummyPayments(count) {
  const methods = ["Cash", "Credit Card", "Online"];
  for (let i = 1; i <= count; i++) {
    await Payment.create({
      amount: 100 + i * 10,
      payment_method: methods[i % methods.length],
      user_id: ((i % 5) + 1)
    });
  }
  console.log(`✅ Created ${count} Payments`);
}

async function createDummySessions(count) {
  for (let i = 1; i <= count; i++) {
    const start = new Date();
    const end = new Date(start.getTime() + i * 60 * 1000);
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

async function createDummyReservations(count) {
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
