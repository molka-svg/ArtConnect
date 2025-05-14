const db = require('../config/db');

async function createAdminIfNotExists() {
  const adminEmail = 'molka89@gmail.com'; 
  const adminPassword = 'molka123'; 
  
  const [rows] = await db.promise().query('SELECT * FROM users WHERE mail = ?', [adminEmail]);
  
  if (rows.length === 0) {
    const hashedPassword = adminPassword; // Remplacez par bcrypt.hashSync(adminPassword, 10) en production
    
    await db.promise().query(
      'INSERT INTO users (nom, prenom, mail, password, role) VALUES (?, ?, ?, ?, ?)',
      ['Admin', 'System', adminEmail, hashedPassword, 'admin']
    );
    console.log('Compte admin créé avec succès');
  }
}

createAdminIfNotExists();