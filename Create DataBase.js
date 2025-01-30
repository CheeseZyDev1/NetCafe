const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// เชื่อมต่อฐานข้อมูล SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'netcafe-db.sqlite'),
    logging: false
});

// 🎯 ตาราง users - เก็บข้อมูลลูกค้า
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    phone: { type: DataTypes.STRING }
}, { tableName: 'users', timestamps: true });

// 🎯 ตาราง snacks - เก็บเมนูขนมและเครื่องดื่ม
const Snack = sequelize.define('Snack', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    category: { 
        type: DataTypes.ENUM('potato', 'drink', 'milk', 'noodle', 'rice'), 
        allowNull: false 
    }
}, { tableName: 'snacks', timestamps: false });

// 🎯 ตาราง snack_promotions - ระบบโปรโมชั่นสำหรับขนม
const SnackPromotion = sequelize.define('SnackPromotion', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    discountPercent: { type: DataTypes.FLOAT, allowNull: true }, // ลด 10%
    buyAmount: { type: DataTypes.INTEGER, allowNull: true }, // ซื้อครบกี่ชิ้น
    freeAmount: { type: DataTypes.INTEGER, allowNull: true } // แถมกี่ชิ้น
}, { tableName: 'snack_promotions', timestamps: true });

// 🎯 ตาราง orders - เก็บข้อมูลคำสั่งซื้อขนมและเครื่องดื่ม
const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'orders', timestamps: true });

// 📌 กำหนดความสัมพันธ์ระหว่างตาราง
User.hasMany(Order, { as: 'orders', foreignKey: 'userId' });
Order.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Snack.hasMany(Order, { as: 'orders', foreignKey: 'snackId' });
Order.belongsTo(Snack, { as: 'snack', foreignKey: 'snackId' });

Snack.hasMany(SnackPromotion, { as: 'promotions', foreignKey: 'snackId' });
SnackPromotion.belongsTo(Snack, { as: 'snack', foreignKey: 'snackId' });

// 🚀 ซิงค์ฐานข้อมูล
sequelize.sync({ force: true })
    .then(() => console.log("✅ Database synced with snack categories!"))
    .catch(err => console.error("❌ Sync error:", err));

// 🛒 ฟังก์ชันเพิ่มเมนูขนมและเครื่องดื่ม (1-5 ตัวเลือกต่อประเภท)
async function addSnacks() {
    await Snack.bulkCreate([
        { name: 'มันฝรั่งทอด เล็ก', price: 20, category: 'potato' },
        { name: 'มันฝรั่งทอด กลาง', price: 30, category: 'potato' },
        { name: 'มันฝรั่งทอด ใหญ่', price: 40, category: 'potato' },
        { name: 'โค้ก', price: 20, category: 'drink' },
        { name: 'น้ำเปล่า', price: 10, category: 'drink' },
        { name: 'ชาเขียว', price: 25, category: 'drink' },
        { name: 'นมจืด', price: 15, category: 'milk' },
        { name: 'นมหวาน', price: 20, category: 'milk' },
        { name: 'บะหมี่กึ่งรสต้มยำ', price: 30, category: 'noodle' },
        { name: 'บะหมี่กึ่งรสหมูสับ', price: 25, category: 'noodle' },
        { name: 'ข้าวไข่เจียว', price: 40, category: 'rice' },
        { name: 'ข้าวกะเพราไก่', price: 50, category: 'rice' }
    ]);
    console.log("✅ เพิ่มเมนูขนมและเครื่องดื่มเรียบร้อย!");
}

// 🎁 ฟังก์ชันเพิ่มโปรโมชั่นขนม
async function addSnackPromotions() {
    await SnackPromotion.bulkCreate([
        { name: "ซื้อ 2 แถม 1", buyAmount: 2, freeAmount: 1 },
        { name: "ลด 10% ทุกเครื่องดื่ม", discountPercent: 10 }
    ]);
    console.log("✅ โปรโมชั่นขนมเพิ่มเรียบร้อย!");
}

// 🥤 ฟังก์ชันสั่งขนมและเครื่องดื่ม
async function createOrder(userId, snackId, quantity = 1) {
    if (quantity < 1 || quantity > 5) {
        return console.log("❌ กรุณาเลือกจำนวน 1-5 ชิ้น");
    }

    const snack = await Snack.findByPk(snackId);
    if (!snack) return console.log("❌ ไม่พบเมนูนี้");

    let totalQuantity = quantity;
    let totalPrice = snack.price * quantity;

    // ตรวจสอบโปรโมชั่นที่ใช้ได้
    const promotions = await SnackPromotion.findAll({ where: { snackId } });
    for (const promo of promotions) {
        if (promo.discountPercent) {
            totalPrice *= (1 - promo.discountPercent / 100);
        }
        if (promo.buyAmount && promo.freeAmount && quantity >= promo.buyAmount) {
            totalQuantity += promo.freeAmount; // เพิ่มของแถม
        }
    }

    await Order.create({ userId, snackId, quantity: totalQuantity, totalPrice });

    console.log(`✅ สั่ง ${snack.name} จำนวน ${quantity} ชิ้น (รวมแถม ${totalQuantity}) | รวม ${totalPrice.toFixed(2)} บาท`);
}

// 🚀 ตัวอย่างการใช้งาน
async function runExample() {
    await addSnacks();
    await addSnackPromotions();

    const user = await User.create({ name: "John Doe", email: "john@example.com", phone: "0812345678" });

    // สั่งมันฝรั่งทอด (เลือก 3 ชิ้น)
    await createOrder(user.id, 1, 3);

    // สั่งโค้ก 2 ขวด (มีโปรลด 10%)
    await createOrder(user.id, 4, 2);

    // สั่งข้าวไข่เจียว 1 จาน
    await createOrder(user.id, 11, 1);
}

runExample();
