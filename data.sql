-- 🔹 1) เพิ่ม Users (10 รายการ)
INSERT INTO users (username, password, email, phone_number, is_vip, is_admin)
VALUES 
    ('user1', 'pass1', 'user1@example.com', '0900000001', FALSE, TRUE),
    ('user2', 'pass2', 'user2@example.com', '0900000002', TRUE, FALSE),
    ('user3', 'pass3', 'user3@example.com', '0900000003', FALSE, FALSE),
    ('user4', 'pass4', 'user4@example.com', '0900000004', TRUE, FALSE),
    ('user5', 'pass5', 'user5@example.com', '0900000005', FALSE, FALSE),
    ('user6', 'pass6', 'user6@example.com', '0900000006', TRUE, FALSE),
    ('user7', 'pass7', 'user7@example.com', '0900000007', FALSE, FALSE),
    ('user8', 'pass8', 'user8@example.com', '0900000008', TRUE, FALSE),
    ('user9', 'pass9', 'user9@example.com', '0900000009', FALSE, FALSE),
    ('user10', 'pass10', 'user10@example.com', '0900000010', TRUE, FALSE);

-- 🔹 2) เพิ่ม Computers (10 เครื่อง)
INSERT INTO computers (name, status, last_used, price_per_hour)
VALUES 
    ('Computer_1', 'Available', NOW(), 50),
    ('Computer_2', 'In Use', NOW(), 50),
    ('Computer_3', 'Maintenance', NOW(), 50),
    ('Computer_4', 'Available', NOW(), 50),
    ('Computer_5', 'In Use', NOW(), 50),
    ('Computer_6', 'Maintenance', NOW(), 50),
    ('Computer_7', 'Available', NOW(), 50),
    ('Computer_8', 'In Use', NOW(), 50),
    ('Computer_9', 'Maintenance', NOW(), 50),
    ('Computer_10', 'Available', NOW(), 50);

-- 🔹 3) เพิ่ม Products (12 รายการ)
INSERT INTO products (name, price, category, stock)
VALUES 
    ('Coke', 12, 'Drink', 10),
    ('Pepsi', 14, 'Drink', 12),
    ('Lays', 20, 'Snack', 8),
    ('Doritos', 25, 'Snack', 7),
    ('Snickers', 30, 'Candy', 6),
    ('KitKat', 28, 'Candy', 5),
    ('Fanta', 13, 'Drink', 15),
    ('Sprite', 14, 'Drink', 10),
    ('Oreo', 20, 'Snack', 8),
    ('Pringles', 30, 'Snack', 5),
    ('Mars', 27, 'Candy', 6),
    ('M&Ms', 29, 'Candy', 7);

-- 🔹 4) เพิ่ม Orders (10 รายการ)
INSERT INTO orders (total_price, status, user_id)
VALUES 
    (55, 'Pending', 1),
    (60, 'Completed', 2),
    (65, 'Pending', 3),
    (70, 'Completed', 4),
    (75, 'Pending', 5),
    (80, 'Completed', 6),
    (85, 'Pending', 7),
    (90, 'Completed', 8),
    (95, 'Pending', 9),
    (100, 'Completed', 10);

-- 🔹 5) เพิ่ม OrderItems (10 รายการ)
INSERT INTO orderItems (quantity, order_id, product_id)
VALUES 
    (1, 1, 1),
    (2, 2, 2),
    (3, 3, 3),
    (1, 4, 4),
    (2, 5, 5),
    (3, 6, 6),
    (1, 7, 7),
    (2, 8, 8),
    (3, 9, 9),
    (1, 10, 10);

-- 🔹 6) เพิ่ม Payments (10 รายการ)
INSERT INTO payments (amount, payment_method, user_id)
VALUES 
    (110, 'Cash', 1),
    (120, 'Credit Card', 2),
    (130, 'Online', 3),
    (140, 'Cash', 4),
    (150, 'Credit Card', 5),
    (160, 'Online', 6),
    (170, 'Cash', 7),
    (180, 'Credit Card', 8),
    (190, 'Online', 9),
    (200, 'Cash', 10);

-- 🔹 7) เพิ่ม Sessions (10 รายการ)
INSERT INTO sessions (start_time, end_time, total_price, user_id, computer_id)
VALUES 
    (NOW(), NOW() + INTERVAL '1 hour', 10, 1, 1),
    (NOW(), NOW() + INTERVAL '2 hours', 20, 2, 2),
    (NOW(), NOW() + INTERVAL '3 hours', 30, 3, 3),
    (NOW(), NOW() + INTERVAL '1 hour', 10, 4, 4),
    (NOW(), NOW() + INTERVAL '2 hours', 20, 5, 5),
    (NOW(), NOW() + INTERVAL '3 hours', 30, 6, 6),
    (NOW(), NOW() + INTERVAL '1 hour', 10, 7, 7),
    (NOW(), NOW() + INTERVAL '2 hours', 20, 8, 8),
    (NOW(), NOW() + INTERVAL '3 hours', 30, 9, 9),
    (NOW(), NOW() + INTERVAL '1 hour', 10, 10, 10);

-- 🔹 8) เพิ่ม Reservations (10 รายการ)
INSERT INTO reservations (reservation_time, status, hours, discount, total_price, start_time, end_time, user_id, computer_id)
VALUES 
    (NOW(), 'Pending', 1, 10, 40, NOW(), NOW() + INTERVAL '1 hour', 1, 1),
    (NOW(), 'Completed', 2, 0, 50, NOW(), NOW() + INTERVAL '2 hours', 2, 2),
    (NOW(), 'Pending', 3, 10, 60, NOW(), NOW() + INTERVAL '3 hours', 3, 3),
    (NOW(), 'Completed', 1, 0, 30, NOW(), NOW() + INTERVAL '1 hour', 4, 4),
    (NOW(), 'Pending', 2, 10, 50, NOW(), NOW() + INTERVAL '2 hours', 5, 5),
    (NOW(), 'Completed', 3, 0, 60, NOW(), NOW() + INTERVAL '3 hours', 6, 6),
    (NOW(), 'Pending', 1, 10, 40, NOW(), NOW() + INTERVAL '1 hour', 7, 7),
    (NOW(), 'Completed', 2, 0, 50, NOW(), NOW() + INTERVAL '2 hours', 8, 8),
    (NOW(), 'Pending', 3, 10, 60, NOW(), NOW() + INTERVAL '3 hours', 9, 9),
    (NOW(), 'Completed', 1, 0, 30, NOW(), NOW() + INTERVAL '1 hour', 10, 10);
