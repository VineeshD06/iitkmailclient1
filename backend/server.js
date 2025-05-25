const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const inboxRoutes = require('./routes/inbox');
const sendRoutes = require('./routes/send');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);
app.use('/api', inboxRoutes);
app.use('/api', sendRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Mail backend server running on port ${PORT}`);
}
);
