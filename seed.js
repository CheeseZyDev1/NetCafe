// seed.js
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

const seedData = async () => {
  try {
    // รีเซ็ตฐานข้อมูล: ลบตารางเก่าและสร้างใหม่
    await sequelize.sync({ force: true });
    console.log("Database synced.");

    // 1. สร้าง Users จำนวน 3 รายการ
    const usersData = [
      {
        username: "userOne",
        password: "passOne",
        email: "userone@example.com",
        phone_number: "0812345678",
        is_vip: false,
        is_admin: false,
      },
      {
        username: "userTwo",
        password: "passTwo",
        email: "usertwo@example.com",
        phone_number: "0898765432",
        is_vip: true,
        is_admin: false,
      },
      {
        username: "userThree",
        password: "passThree",
        email: "userthree@example.com",
        phone_number: "0865432198",
        is_vip: false,
        is_admin: false,
      }
    ];
    const createdUsers = await User.bulkCreate(usersData, { returning: true });

    // 2. สร้าง Computers จำนวน 3 รายการ
    const computersData = [
      {
        name: "Computer 1",
        status: "Available",
        last_used: null,
      },
      {
        name: "Computer 2",
        status: "Available",
        last_used: null,
      },
      {
        name: "Computer 3",
        status: "Available",
        last_used: null,
      }
    ];
    const createdComputers = await Computer.bulkCreate(computersData, { returning: true });

    // 3. สร้าง Products (เมนูอาหาร) จำนวน 3 รายการ
    const productsData = [
      {
        name: "Burger Deluxe",
        price: 99.99,
        category: "Food",
      },
      {
        name: "Fresh Orange Juice",
        price: 49.99,
        category: "Drink",
      },
      {
        name: "Chocolate Cookie",
        price: 19.99,
        category: "Snack",
      }
    ];
    const createdProducts = await Product.bulkCreate(productsData, { returning: true });

    // 4. สร้าง Sessions จำนวน 3 รายการ (เชื่อมโยงกับ Users และ Computers)
    const sessionsData = [
      {
        user_id: createdUsers[0].id,
        computer_id: createdComputers[0].id,
        start_time: new Date("2023-04-01T10:00:00Z"),
        end_time: null,
        total_price: 25.0,
      },
      {
        user_id: createdUsers[1].id,
        computer_id: createdComputers[1].id,
        start_time: new Date("2023-04-01T11:00:00Z"),
        end_time: null,
        total_price: 30.0,
      },
      {
        user_id: createdUsers[2].id,
        computer_id: createdComputers[2].id,
        start_time: new Date("2023-04-01T12:00:00Z"),
        end_time: null,
        total_price: 20.0,
      }
    ];
    await Session.bulkCreate(sessionsData);

    // 5. สร้าง Payments จำนวน 3 รายการ
    const paymentsData = [
      {
        user_id: createdUsers[0].id,
        amount: 100.0,
        payment_method: "Cash",
      },
      {
        user_id: createdUsers[1].id,
        amount: 50.0,
        payment_method: "Credit Card",
      },
      {
        user_id: createdUsers[2].id,
        amount: 75.0,
        payment_method: "Online",
      }
    ];
    await Payment.bulkCreate(paymentsData);

    // 6. สร้าง Orders จำนวน 3 รายการ
    const ordersData = [
      {
        user_id: createdUsers[0].id,
        total_price: 45.0,
        status: "Pending",
      },
      {
        user_id: createdUsers[1].id,
        total_price: 60.0,
        status: "Completed",
      },
      {
        user_id: createdUsers[2].id,
        total_price: 30.0,
        status: "Cancelled",
      }
    ];
    const createdOrders = await Order.bulkCreate(ordersData, { returning: true });

    // 7. สร้าง OrderItems จำนวน 3 รายการ (เชื่อมโยงกับ Orders และ Products)
    const orderItemsData = [
      {
        order_id: createdOrders[0].id,
        product_id: createdProducts[0].id,
        quantity: 2,
      },
      {
        order_id: createdOrders[1].id,
        product_id: createdProducts[1].id,
        quantity: 1,
      },
      {
        order_id: createdOrders[2].id,
        product_id: createdProducts[2].id,
        quantity: 3,
      }
    ];
    await OrderItem.bulkCreate(orderItemsData);

    // 8. สร้าง Coupons จำนวน 3 รายการ
    const couponsData = [
      {
        user_id: createdUsers[0].id,
        code: "COUPON-ABC123",
        discount: 10.0,
        expiry_date: new Date("2023-12-31T00:00:00Z"),
        is_active: true,
      },
      {
        user_id: createdUsers[1].id,
        code: "COUPON-DEF456",
        discount: 15.0,
        expiry_date: new Date("2023-12-31T00:00:00Z"),
        is_active: true,
      },
      {
        user_id: createdUsers[2].id,
        code: "COUPON-GHI789",
        discount: 20.0,
        expiry_date: new Date("2023-12-31T00:00:00Z"),
        is_active: false,
      }
    ];
    await Coupon.bulkCreate(couponsData);

    // 9. สร้าง Reports จำนวน 3 รายการ
    const reportsData = [
      {
        report_date: "2023-08-01",
        total_income: 500.0,
        total_users: 50,
      },
      {
        report_date: "2023-08-02",
        total_income: 600.0,
        total_users: 60,
      },
      {
        report_date: "2023-08-03",
        total_income: 550.0,
        total_users: 55,
      }
    ];
    await Report.bulkCreate(reportsData);

    // 10. สร้าง Notifications จำนวน 3 รายการ
    const notificationsData = [
      {
        user_id: createdUsers[0].id,
        message: "This is a test notification 1",
        is_read: false,
      },
      {
        user_id: createdUsers[1].id,
        message: "This is a test notification 2",
        is_read: true,
      },
      {
        user_id: createdUsers[2].id,
        message: "This is a test notification 3",
        is_read: false,
      }
    ];
    await Notification.bulkCreate(notificationsData);

    // 11. สร้าง Reservations จำนวน 3 รายการ
    const reservationsData = [
      {
        user_id: createdUsers[0].id,
        computer_id: createdComputers[0].id,
        reservation_time: new Date("2023-10-01T10:00:00Z"),
        status: "Pending",
      },
      {
        user_id: createdUsers[1].id,
        computer_id: createdComputers[1].id,
        reservation_time: new Date("2023-10-02T10:00:00Z"),
        status: "Pending",
      },
      {
        user_id: createdUsers[2].id,
        computer_id: createdComputers[2].id,
        reservation_time: new Date("2023-10-03T10:00:00Z"),
        status: "Pending",
      }
    ];
    await Reservation.bulkCreate(reservationsData);

    console.log("Dummy data inserted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
