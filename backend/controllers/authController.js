const nodemailer = require('nodemailer');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const transporter = nodemailer.createTransport({
    host: 'mmtp.iitk.ac.in',
    port: 25,
    secure: false, // Use true if switching to port 465
    auth: {
      user: email,
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ Login failed:', error.message);
      res.status(401).json({ message: '❌ Login failed', error: error.message });
    } else {
      console.log('✅ SMTP Login successful');
      res.status(200).json({ message: '✅ Login successful' });
    }
  });
};

module.exports = { login };
