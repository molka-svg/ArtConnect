// model/createAdmin.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

async function createAdminIfNotExists() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'molka89@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'molka123';
    
    const [rows] = await db.promise().query('SELECT * FROM users WHERE mail = ?', [adminEmail]);
    
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await db.promise().query(
        'INSERT INTO users (nom, prenom, mail, password, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin', 'System', adminEmail, hashedPassword, 'admin']
      );
      console.log('✅ Admin account created successfully');
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin account:', err);
    throw err; // Re-throw the error to handle it in server.js
  }
}

// Make sure to export the function
module.exports = createAdminIfNotExists;