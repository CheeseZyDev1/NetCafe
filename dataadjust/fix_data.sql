SELECT 
    name,
    price,
    category,
    SUM(stock) AS total_stock,
    MIN(createdAt) AS first_createdAt,
    MAX(updatedAt) AS last_updatedAt
FROM products
GROUP BY name, price, category
ORDER BY name;
