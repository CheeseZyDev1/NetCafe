-- ✅ ตรวจสอบ `orders` และ `products`
SELECT id FROM orders;
SELECT id FROM products;

-- ✅ เพิ่มข้อมูลใน `orders` (ถ้ายังไม่มี)
INSERT INTO orders (total_price, status, user_id)
SELECT * FROM (VALUES
    (55, 'Pending', 2),
    (60, 'Completed', 3),
    (65, 'Pending', 4),
    (70, 'Completed', 5),
    (75, 'Pending', 6),
    (80, 'Completed', 7),
    (85, 'Pending', 8),
    (90, 'Completed', 9),
    (95, 'Pending', 10),
    (100, 'Completed', 11)
) AS new_orders(total_price, status, user_id)
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE user_id = new_orders.user_id);

-- ✅ เพิ่มข้อมูลใน `products` (ถ้ายังไม่มี)
INSERT INTO products (name, price, category, stock)
SELECT * FROM (VALUES
    ('Coke', 12, 'Drink', 10),
    ('Pepsi', 14, 'Drink', 12),
    ('Lays', 20, 'Snack', 8),
    ('Doritos', 25, 'Snack', 7),
    ('Snickers', 30, 'Candy', 6),
    ('KitKat', 28, 'Candy', 5),
    ('Fanta', 13, 'Drink', 15),
    ('Sprite', 14, 'Drink', 10),
    ('Oreo', 20, 'Snack', 8),
    ('Pringles', 30, 'Snack', 5)
) AS new_products(name, price, category, stock)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = new_products.name);

-- ✅ ลบ `orderItems` ถ้ามีอยู่แล้ว
DROP TABLE IF EXISTS "orderItems" CASCADE;

-- ✅ สร้าง `orderItems` ใหม่
CREATE TABLE "orderItems" (
    id SERIAL PRIMARY KEY,
    quantity INT NOT NULL,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✅ ตรวจสอบ `order_id` และ `product_id` ก่อน `INSERT`
SELECT id FROM orders WHERE id BETWEEN 11 AND 20;
SELECT id FROM products WHERE id BETWEEN 2 AND 11;

-- ✅ เพิ่มข้อมูลเข้า `orderItems`
INSERT INTO "orderItems" (quantity, order_id, product_id)
SELECT * FROM (VALUES
    (1, 11, 2),
    (2, 12, 3),
    (3, 13, 4),
    (1, 14, 5),
    (2, 15, 6),
    (3, 16, 7),
    (1, 17, 8),
    (2, 18, 9),
    (3, 19, 10),
    (1, 20, 11)
) AS new_orderItems(quantity, order_id, product_id)
WHERE EXISTS (SELECT 1 FROM orders WHERE id = new_orderItems.order_id)
AND EXISTS (SELECT 1 FROM products WHERE id = new_orderItems.product_id);
