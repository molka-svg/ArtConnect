const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configurer CORS avant toutes les routes
app.use(cors({
  origin: 'http://localhost:4200', // Autoriser uniquement le frontend Angular
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Si tu utilises des cookies
}));

// Parser JSON
app.use(express.json());

// Routes
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const oeuvreRoutes = require('./routes/oeuvreRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const admin = require('./routes/adminRoutes');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/oeuvres', oeuvreRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/admin', admin);

// Route de test
app.get('/', (req, res) => {
  res.send('API fonctionne 😎');
});

// Démarrer le serveur
app.listen(port, async () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  try {
    const createAdminIfNotExists = require('./model/createAdmin');
    await createAdminIfNotExists();
    console.log('✅ Admin setup completed');
  } catch (err) {
    console.error('❌ Error during admin setup:', err.message);
  }
});