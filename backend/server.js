const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db'); // Import database connection
const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Configure Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routes
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const oeuvreRoutes = require('./routes/oeuvreRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/order');
const authRoutes = require('./routes/authRoutes');
const enchereRoutes = require('./routes/enchereRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/oeuvres', oeuvreRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/enchere', enchereRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API fonctionne 😎');
});

// Socket.io for real-time auction handling
io.on('connection', (socket) => {
  console.log(`Nouvel utilisateur connecté: ${socket.id}`);

  // Join specific auction room
  socket.on('joinEnchere', (enchereId) => {
    socket.join(enchereId);
    console.log(`Utilisateur ${socket.id} a rejoint l'enchère ${enchereId}`);
  });

  // Handle new bids
  socket.on('nouvelleMise', (data) => {
    const { enchere_id, utilisateur_id, montant } = data;

    // Validate and save bid
    const miseModel = require('./model/miseModel');
    miseModel.placerMise({ enchere_id, utilisateur_id, montant }, (err, result) => {
      if (err) {
        socket.emit('miseError', { message: err.message });
        return;
      }

      // Broadcast new bid to all users in the auction room
      io.to(enchere_id).emit('miseUpdate', {
        enchere_id,
        utilisateur_id,
        montant,
        date_mise: new Date()
      });
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
  });
});

// Check for completed auctions every minute
const checkEncheresTerminees = () => {
  const sql = `
    SELECT e.enchere_id, e.oeuvre_id, MAX(m.montant) as max_mise, m.utilisateur_id
    FROM enchere e
    LEFT JOIN mises m ON e.enchere_id = m.enchere_id
    WHERE e.date_fin <= NOW() AND e.est_validee = TRUE
    GROUP BY e.enchere_id, e.oeuvre_id`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des enchères terminées:', err);
      return;
    }

    results.forEach((enchere) => {
      if (enchere.utilisateur_id) {
        // Update artwork as sold and assign buyer
        const sqlUpdate = `UPDATE oeuvres SET statut = 'vendue', acheteur_id = ? WHERE oeuvre_id = ?`;
        db.query(sqlUpdate, [enchere.utilisateur_id, enchere.oeuvre_id], (err) => {
          if (err) console.error('Erreur lors de la mise à jour de l\'œuvre:', err);
          else {
            console.log(`Œuvre ${enchere.oeuvre_id} vendue à l'utilisateur ${enchere.utilisateur_id}`);
            // Notify winner via Socket.io
            io.to(enchere.enchere_id).emit('enchereTerminee', {
              enchere_id: enchere.enchere_id,
              oeuvre_id: enchere.oeuvre_id,
              gagnant_id: enchere.utilisateur_id,
              montant: enchere.max_mise
            });
          }
        });
      }

      // Delete completed auction
      const sqlDelete = `DELETE FROM enchere WHERE enchere_id = ?`;
      db.query(sqlDelete, [enchere.enchere_id], (err) => {
        if (err) console.error('Erreur lors de la suppression de l\'enchère:', err);
      });
    });
  });
};

// Run auction check every minute
setInterval(checkEncheresTerminees, 60 * 1000);

// Start server
server.listen(port, async () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  try {
    const createAdminIfNotExists = require('./model/createAdmin');
    await createAdminIfNotExists();
    console.log('✅ Admin setup completed');
  } catch (err) {
    console.error('❌ Error during admin setup:', err.message);
  }
});