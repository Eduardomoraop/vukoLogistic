require('dotenv').config();
const express = require('express');
const cors = require('cors');
const itemsRoutes = require('./routes/items');
const movementsRoutes = require('./routes/movements');
const errorHandler = require('./middleware/errorHandler');
const { testDb } = require('./controllers/movementsController');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test-db', testDb);

app.use('/items', itemsRoutes);
app.use('/movimientos', movementsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
