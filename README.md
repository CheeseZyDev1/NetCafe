ด้านล่างนี้คือ README ตัวอย่างสำหรับโปรเจกต์ NetCafe ครับ คุณสามารถปรับแก้รายละเอียดตามความต้องการได้:

---

# NetCafe Project

โปรเจกต์นี้เป็นระบบสำหรับจัดการคาเฟ่คอมพิวเตอร์ (NetCafe) ที่รวมทั้งส่วน Backend (API ด้วย Express & Sequelize) และ Frontend (HTML, CSS, JavaScript) ไว้ด้วยกัน

## คุณสมบัติหลัก

- **Authentication**: ระบบ Login/Register สำหรับผู้ใช้ทั่วไป
- **CRUD API**: สำหรับจัดการข้อมูลผู้ใช้, เครื่องคอมพิวเตอร์, การใช้งาน (Sessions), การชำระเงิน (Payments), พรีออเดอร์ (Orders & OrderItems), เมนูอาหาร (Products) และการจองเครื่อง (Reservations)
- **Admin Dashboard**: สำหรับจัดการข้อมูลทั้งหมด (ผู้ใช้, เครื่องคอมพิวเตอร์, sessions, orders, products, etc.) โดยใช้การตรวจสอบสิทธิ์ผ่าน middleware
- **รองรับการเชื่อมต่อกับ PostgreSQL**: สามารถใช้งานกับฐานข้อมูลบน Railway หรือ Local ได้ตามการตั้งค่าในไฟล์ `.env`
- **Frontend Static Files**: เสิร์ฟไฟล์ HTML, CSS, JavaScript จากโฟลเดอร์ `public`

## โครงสร้างโปรเจกต์

- **backend.js**: โค้ดหลักสำหรับรัน Express server และกำหนด API endpoints  
- **CreateDB.js**: ประกาศ Model และ Relationships โดยใช้ Sequelize  
- **public/**: โฟลเดอร์ที่เก็บไฟล์ Frontend (เช่น home.html, login.html, register.html, admin.html, cart.html, computer.html, snack-drink.html เป็นต้น)
- **.env**: ไฟล์สำหรับเก็บ Environment Variables เช่น `DATABASE_URL` (สำหรับเชื่อมต่อกับ PostgreSQL)

## การติดตั้ง

1. **Clone โปรเจกต์**

   ```bash
   git clone <repository-url>
   cd netcafe
   ```

2. **ติดตั้ง Dependencies**

   ```bash
   npm install
   ```

3. **สร้างไฟล์ .env**  
   ตัวอย่างไฟล์ `.env` สำหรับการใช้งาน local:

   ```
   DATABASE_URL=postgres://username:password@localhost:5432/your_database
   PORT=8000
   ```

   หากใช้ Railway ให้แน่ใจว่า `DATABASE_URL` ถูกตั้งค่าไว้ใน Railway Environment Variables

## การรันโปรเจกต์

### Local Development

1. ตรวจสอบว่ามี PostgreSQL รันอยู่ในเครื่องและสร้าง database ตามที่ระบุใน `.env`
2. รันโปรเจกต์ด้วยคำสั่ง:

   ```bash
   npm start
   ```

   คุณจะเห็น log ที่แจ้งว่าเชื่อมต่อฐานข้อมูลสำเร็จและเซิร์ฟเวอร์กำลังรันบน port ที่ระบุ

3. เปิดเว็บเบราว์เซอร์และเข้า URL:

   ```
   http://localhost:8000
   ```

### Deployment บน Railway

1. Push โค้ดขึ้น Railway repository หรือเชื่อมต่อกับ Railway CLI
2. Railway จะใช้ Environment Variables จาก Railway Dashboard (ตรวจสอบให้แน่ใจว่า `DATABASE_URL` ถูกตั้งค่าไว้ถูกต้อง)
3. เมื่อ deploy สำเร็จ ให้เข้า URL ที่ Railway มอบให้ (เช่น `https://netcafe-production.up.railway.app`)  
4. ระบบจะเสิร์ฟไฟล์ static จากโฟลเดอร์ `public` และ API endpoints จะสามารถใช้งานได้

## Testing API

คุณสามารถใช้เครื่องมือเช่น **Postman** หรือ **curl** เพื่อทดสอบ API endpoints ได้ เช่น:

- **Login**:  
  ```bash
  curl -X POST https://<your-domain>/login \
    -H "Content-Type: application/json" \
    -d '{"username": "user1", "password": "pass1"}'
  ```

- **ดูรายการผู้ใช้**:
  ```bash
  curl https://<your-domain>/users
  ```

## ข้อแนะนำเพิ่มเติม

- ตรวจสอบให้แน่ใจว่าไฟล์ในโฟลเดอร์ `public` ถูกเสิร์ฟอย่างถูกต้อง (ใช้ `app.use(express.static(...))` ใน backend.js)
- หากใช้งาน API สำหรับ Admin ให้แน่ใจว่า header `x-admin-password` ถูกส่งไปพร้อม request
- สำหรับการพัฒนาเพิ่มเติม อาจพิจารณาใช้ migrations แทน `sequelize.sync({ force: true })` เพื่อป้องกันการลบข้อมูลทุกครั้งที่ deploy

---
