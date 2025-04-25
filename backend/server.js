const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes); 

app.get('/', (req, res) => {
  res.send('API fonctionne 😎');
});

app.listen(port, () => {
  console.log(` Serveur démarré sur http://localhost:${port}`);
});
