const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');
const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Création du serveur HTTP
const server = http.createServer(app);

// Configuration Socket.io
const io = new Server(server, {
  cors: corsOptions
});

// Import des routes
const routes = [
  { path: '/api/auth', route: require('./routes/authRoutes') },
  { path: '/api/orders', route: require('./routes/order') },
  { path: '/api/payment', route: require('./routes/payment') },
  { path: '/api/users', route: require('./routes/userRoutes') },
  { path: '/api/oeuvres', route: require('./routes/oeuvreRoutes') },
  { path: '/api/evenements', route: require('./routes/evenementRoutes') },
  { path: '/api/admin', route: require('./routes/adminRoutes') },
  { path: '/api/enchere', route: require('./routes/enchereRoutes') }
];

// Enregistrement des routes
routes.forEach(({ path, route }) => {
  app.use(path, route);
});

// Route de test
app.get('/', (req, res) => {
  res.send('API fonctionne 😎');
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log(`Nouvel utilisateur connecté: ${socket.id}`);

  socket.on('joinEnchere', (enchereId) => {
    socket.join(enchereId);
    console.log(`Utilisateur ${socket.id} a rejoint l'enchère ${enchereId}`);
  });

  socket.on('nouvelleMise', async (data) => {
    try {
      const { enchere_id, utilisateur_id, montant } = data;
      const miseModel = require('./model/miseModel');
      
      await miseModel.placerMise({ enchere_id, utilisateur_id, montant });
      
      io.to(enchere_id).emit('miseUpdate', {
        enchere_id,
        utilisateur_id,
        montant,
        date_mise: new Date()
      });
    } catch (err) {
      socket.emit('miseError', { message: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté: ${socket.id}`);
  });
});

const checkEncheresTerminees = async () => {
  try {
    const sql = `
      SELECT 
        e.enchere_id, 
        e.oeuvre_id, 
        MAX(m.montant) as max_mise,
        (SELECT m2.utilisateur_id 
         FROM mises m2 
         WHERE m2.enchere_id = e.enchere_id 
         ORDER BY m2.montant DESC 
         LIMIT 1) as utilisateur_id
      FROM enchere e
      LEFT JOIN mises m ON e.enchere_id = m.enchere_id
      WHERE e.date_fin <= NOW() AND e.est_validee = TRUE
      GROUP BY e.enchere_id, e.oeuvre_id`;
    
    const [results] = await db.promise().query(sql);

    for (const enchere of results) {
      if (enchere.utilisateur_id) {
        await db.promise().query(
          `UPDATE oeuvres SET statut = 'vendue', acheteur_id = ? WHERE oeuvre_id = ?`,
          [enchere.utilisateur_id, enchere.oeuvre_id]
        );
        
        io.to(enchere.enchere_id).emit('enchereTerminee', {
          enchere_id: enchere.enchere_id,
          oeuvre_id: enchere.oeuvre_id,
          gagnant_id: enchere.utilisateur_id,
          montant: enchere.max_mise
        });
      }

      await db.promise().query(
        `DELETE FROM enchere WHERE enchere_id = ?`,
        [enchere.enchere_id]
      );
    }
  } catch (err) {
    console.error('Erreur lors de la vérification des enchères terminées:', err);
  }
};

// Vérification périodique
setInterval(checkEncheresTerminees, 60 * 1000);

// Démarrage du serveur
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

// Gestion des erreurs non catchées
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});