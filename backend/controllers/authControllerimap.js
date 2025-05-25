const imaps = require('imap-simple');

exports.login = async (req, res) => {
  const { email, password } = req.body;

 const config = {
  imap: {
    user: email,
    password: password,
    host: 'qasid.iitk.ac.in',
    port: 993,      
    tls: true,  
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false } 
  }
};

  try {
    const connection = await imaps.connect(config);
    await connection.end();
    res.status(200).json({ message: '✅ Login successful' });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ message: '❌ Login failed', error: err.message });
  }
};
