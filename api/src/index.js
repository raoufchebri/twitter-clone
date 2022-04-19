const express = require('express');
const cors = require('cors');
require('dotenv').config();
const api = require('./api');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use('/api', api);
app.unsubscribe(bodyParser.urlencoded());
app.get('/', (_, res) => res.json({ message: 'Welcome to ScyllaDB' }));

app.listen(PORT, () => console.log(`Listening to http://localhost:${PORT}`));
