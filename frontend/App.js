// app.js

document.addEventListener('DOMContentLoaded', () => {
  /* ===============================
     ส่วน Authentication (Login/ Register)
  =============================== */
  const authContainer = document.getElementById('auth-container');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const showRegisterLink = document.getElementById('showRegister');
  const showLoginLink = document.getElementById('showLogin');
  const logoutBtn = document.getElementById('logoutBtn');
  const userDisplayName = document.getElementById('userDisplayName');

  // สลับไปยังหน้าลงทะเบียน
  if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-form').classList.remove('active');
      document.getElementById('register-form').classList.add('active');
    });
  }
  // สลับไปยังหน้าล็อกอิน
  if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-form').classList.remove('active');
      document.getElementById('login-form').classList.add('active');
    });
  }

  // ส่งข้อมูลการสมัครสมาชิก
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('registerUsername').value;
      const password = document.getElementById('registerPassword').value;
      const email = document.getElementById('registerEmail').value;
      const phone = document.getElementById('registerPhone').value;
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, email, phone_number: phone })
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Registration failed');
        }
        const newUser = await response.json();
        alert('Registration successful. Please login.');
        document.getElementById('register-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
      } catch (error) {
        alert('Registration error: ' + error.message);
      }
    });
  }

  // ส่งข้อมูลการเข้าสู่ระบบ
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || 'Login failed');
        }
        const user = await response.json();
        // เก็บข้อมูลผู้ใช้ลง localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        userDisplayName.textContent = user.username;
        authContainer.style.display = 'none';
        dashboard.style.display = 'block';
      } catch (error) {
        alert('Login error: ' + error.message);
      }
    });
  }

  // กำหนดปุ่ม Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      dashboard.style.display = 'none';
      authContainer.style.display = 'block';
    });
  }

  // หากมีผู้ใช้ที่ล็อกอินอยู่แล้ว ให้แสดง Dashboard
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    userDisplayName.textContent = user.username;
    authContainer.style.display = 'none';
    dashboard.style.display = 'block';
  }

  /* ===============================
     ส่วน Dashboard และ SPA Navigation
  =============================== */

  // Header Navigation
  const navLinks = document.querySelectorAll('header nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // กำหนด active class ให้กับ link ที่ถูกเลือก
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      const sectionId = link.getAttribute('data-section');
      showSection(sectionId);
      // โหลดข้อมูลตาม section ที่เลือก (สำหรับ endpoints ที่ต้องการ admin auth ให้ส่ง header)
      switch (sectionId) {
        case 'users': fetchUsers(); break;
        case 'computers': fetchComputers(); break;
        case 'sessions': fetchSessions(); break;
        case 'payments': fetchPayments(); break;
        case 'orders': fetchOrders(); break;
        case 'products': fetchProducts(); break;
        // สามารถเพิ่มกรณีอื่น ๆ ได้
        default: break;
      }
    });
  });

  // เมื่อคลิกปุ่มใน Hero ให้ไปที่ Products
  const goToProductsBtn = document.getElementById('goToProducts');
  if (goToProductsBtn) {
    goToProductsBtn.addEventListener('click', () => {
      document.querySelector('a[data-section="products"]').click();
    });
  }

  // ฟังก์ชันสำหรับแสดง Section ที่เลือก
  function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.toggle('active', section.id === sectionId);
    });
  }

  // กำหนด header สำหรับ Admin endpoints
  const adminHeaders = {
    "x-admin-auth": "secret-admin-token"
  };

  // ฟังก์ชันสำหรับแสดงข้อมูลใน container (แสดงในรูปแบบ JSON formatted)
  function displayData(containerId, data) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (Array.isArray(data) && data.length > 0) {
      data.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('data-card');
        card.innerHTML = `<pre>${JSON.stringify(item, null, 2)}</pre>`;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = '<p>ไม่มีข้อมูล</p>';
    }
  }

  // ดึงข้อมูล Users (Admin)
  async function fetchUsers() {
    try {
      const response = await fetch('http://localhost:3000/users', { headers: adminHeaders });
      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล Users');
      const users = await response.json();
      displayData('usersContainer', users);
    } catch (error) {
      console.error(error);
      document.getElementById('usersContainer').innerHTML = '<p>ไม่สามารถโหลด Users ได้</p>';
    }
  }

  // ดึงข้อมูล Computers (Public)
  async function fetchComputers() {
    try {
      const response = await fetch('http://localhost:3000/computers');
      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล Computers');
      const computers = await response.json();
      displayData('computersContainer', computers);
    } catch (error) {
      console.error(error);
      document.getElementById('computersContainer').innerHTML = '<p>ไม่สามารถโหลด Computers ได้</p>';
    }
  }

  // ดึงข้อมูล Sessions (Admin)
  async function fetchSessions() {
    try {
      const response = await fetch('http://localhost:3000/sessions', { headers: adminHeaders });
      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล Sessions');
      const sessions = await response.json();
      displayData('sessionsContainer', sessions);
    } catch (error) {
      console.error(error);
      document.getElementById('sessionsContainer').innerHTML = '<p>ไม่สามารถโหลด Sessions ได้</p>';
    }
  }

  // ดึงข้อมูล Payments (Admin)
  async function fetchPayments() {
    try {
      const response = await fetch('http://localhost:3000/payments', { headers: adminHeaders });
      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล Payments');
      const payments = await response.json();
      displayData('paymentsContainer', payments);
    } catch (error) {
      console.error(error);
      document.getElementById('paymentsContainer').innerHTML = '<p>ไม่สามารถโหลด Payments ได้</p>';
    }
  }

  // ดึงข้อมูล Orders (Admin)
  async function fetchOrders() {
    try {
      const response = await fetch('http://localhost:3000/orders', { headers: adminHeaders });
      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล Orders');
      const orders = await response.json();
      displayData('ordersContainer', orders);
    } catch (error) {
      console.error(error);
      document.getElementById('ordersContainer').innerHTML = '<p>ไม่สามารถโหลด Orders ได้</p>';
    }
  }

  // ดึงข้อมูล Products (Public)
  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล Products');
      const products = await response.json();
      displayData('productsContainer', products);
    } catch (error) {
      console.error(error);
      document.getElementById('productsContainer').innerHTML = '<p>ไม่สามารถโหลด Products ได้</p>';
    }
  }

});
