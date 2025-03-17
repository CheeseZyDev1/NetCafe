-- สร้างตาราง orders และ products ก่อน
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    total_price FLOAT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    category VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้างตาราง orderItems หลังจาก orders และ products
CREATE TABLE IF NOT EXISTS "orderItems" (
    id SERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    order_id INT,
    product_id INT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- เพิ่ม Foreign Key ให้ orderItems
ALTER TABLE "orderItems" ADD CONSTRAINT orderItems_order_id_fkey 
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE "orderItems" ADD CONSTRAINT orderItems_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- ตรวจสอบว่าตารางถูกต้อง
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- ตรวจสอบว่ามี Foreign Key ถูกต้อง
SELECT conname AS constraint_name, 
       conrelid::regclass AS table_name, 
       pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE contype = 'f';
