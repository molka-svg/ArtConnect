const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
const oeuvreRoutes = require('./routes/oeuvreRoutes');
const evenementRoutes = require('./routes/evenementRoutes');
const createAdminIfNotExists = require('./model/createAdmin');
const admin=require('./routes/adminRoutes');
app.use('/api/users', userRoutes);
app.use('/api/oeuvres', oeuvreRoutes);
app.use('/api/evenements', evenementRoutes);
app.use('/api/admin', admin);

app.use
app.get('/', (req, res) => {
  res.send('API fonctionne 😎');
});

app.listen(port, async () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  
  try {
    await createAdminIfNotExists(); 
    console.log('✅ Admin setup completed');
  } catch (err) {
    console.error('❌ Error during admin setup:', err.message);
  }
});