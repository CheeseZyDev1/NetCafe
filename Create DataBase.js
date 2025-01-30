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

// 🎯 ตาราง computers - คอมพิวเตอร์ในร้าน
const Computer = sequelize.define('Computer', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('available', 'in-use', 'maintenance'), defaultValue: 'available' }
}, { tableName: 'computers', timestamps: true });

// 🎯 ตาราง time_packages - แพ็กเกจเวลา
const TimePackage = sequelize.define('TimePackage', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    duration: { type: DataTypes.INTEGER, allowNull: false }, // นาที
    price: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'time_packages', timestamps: false });

// 🎯 ตาราง promotions - จัดโปรลดราคา
const Promotion = sequelize.define('Promotion', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    discountPercent: { type: DataTypes.FLOAT, allowNull: true }, // เช่น ลด 10%
    specialPrice: { type: DataTypes.FLOAT, allowNull: true } // ราคาพิเศษสำหรับแพ็กเกจ
}, { tableName: 'promotions', timestamps: true });

// 🎯 ตาราง sessions - บันทึกการใช้งานคอม
const Session = sequelize.define('Session', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    startTime: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    endTime: { type: DataTypes.DATE },
    duration: { type: DataTypes.INTEGER }, // นาที
    price: { type: DataTypes.FLOAT, allowNull: true } // ราคาหลังคำนวณส่วนลด
}, { tableName: 'sessions', timestamps: true });

// 🎯 ตาราง payments - บันทึกการชำระเงิน
const Payment = sequelize.define('Payment', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    method: { type: DataTypes.ENUM('cash', 'credit', 'paypal'), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending' }
}, { tableName: 'payments', timestamps: true });

// 📌 ความสัมพันธ์ระหว่างตาราง
User.hasMany(Session, { as: 'sessions', foreignKey: 'userId' });
Session.belongsTo(User, { as: 'user', foreignKey: 'userId' });

Computer.hasMany(Session, { as: 'sessions', foreignKey: 'computerId' });
Session.belongsTo(Computer, { as: 'computer', foreignKey: 'computerId' });

Session.belongsTo(TimePackage, { as: 'timePackage', foreignKey: 'packageId' });
TimePackage.hasMany(Session, { as: 'sessions', foreignKey: 'packageId' });

Session.belongsTo(Promotion, { as: 'promotion', foreignKey: 'promotionId' });
Promotion.hasMany(Session, { as: 'sessions', foreignKey: 'promotionId' });

Session.hasOne(Payment, { as: 'payment', foreignKey: 'sessionId' });
Payment.belongsTo(Session, { as: 'session', foreignKey: 'sessionId' });

// 🚀 ซิงค์ฐานข้อมูล
sequelize.sync({ force: true })
    .then(() => console.log("✅ Database synced with time packages and promotions!"))
    .catch(err => console.error("❌ Sync error:", err));

// 🕐 ฟังก์ชันเพิ่มแพ็กเกจเวลา
async function addTimePackages() {
    await TimePackage.bulkCreate([
        { duration: 30, price: 15 },
        { duration: 60, price: 25 },
        { duration: 120, price: 45 },
        { duration: 180, price: 60 },
        { duration: 360, price: 100 },
        { duration: 720, price: 180 }
    ]);
    console.log("✅ แพ็กเกจเวลาเพิ่มเรียบร้อย!");
}

// 🎁 ฟังก์ชันเพิ่มโปรโมชั่น
async function addPromotions() {
    await Promotion.bulkCreate([
        { name: "ส่วนลด 10%", discountPercent: 10 },
        { name: "โปรพิเศษ 6 ชม. เหลือ 80 บาท", specialPrice: 80 }
    ]);
    console.log("✅ โปรโมชั่นเพิ่มเรียบร้อย!");
}

// 💰 ฟังก์ชันซื้อแพ็กเกจ
async function buyTimePackage(userId, packageId, promotionId = null) {
    const timePackage = await TimePackage.findByPk(packageId);
    if (!timePackage) return console.log("❌ ไม่พบแพ็กเกจนี้");

    let finalPrice = timePackage.price;
    if (promotionId) {
        const promotion = await Promotion.findByPk(promotionId);
        if (promotion) {
            if (promotion.discountPercent) {
                finalPrice *= (1 - promotion.discountPercent / 100);
            } else if (promotion.specialPrice) {
                finalPrice = promotion.specialPrice;
            }
        }
    }

    const session = await Session.create({
        userId, 
        packageId, 
        promotionId, 
        duration: timePackage.duration, 
        price: finalPrice, 
        startTime: new Date(),
        endTime: new Date(Date.now() + timePackage.duration * 60000)
    });

    console.log(`✅ ซื้อแพ็กเกจ ${timePackage.duration} นาที ราคา ${finalPrice.toFixed(2)} บาท`);
}

// 🚀 ตัวอย่างการใช้งาน
async function runExample() {
    await addTimePackages();
    await addPromotions();

    const user = await User.create({ name: "John Doe", email: "john@example.com", phone: "0812345678" });

    // ซื้อแพ็กเกจ 2 ชม. พร้อมใช้โปรลด 10%
    await buyTimePackage(user.id, 3, 1);

    // ซื้อแพ็กเกจ 6 ชม. พร้อมโปรพิเศษ 80 บาท
    await buyTimePackage(user.id, 5, 2);
}

runExample();
