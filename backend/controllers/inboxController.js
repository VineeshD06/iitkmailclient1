// controllers/inboxController.js
const imaps = require('imap-simple');

/**
 * Fetches emails from the user's inbox using IMAP.
 */
const fetchInbox = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const config = {
  imap: {
    user: email,
    password: password,
    host: 'qasid.iitk.ac.in',
    port: 993,         // Secure IMAPS port
    tls: true,         // Use TLS
    authTimeout: 10000,
    tlsOptions: { rejectUnauthorized: false } // Optional if self-signed
  }
};

  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      struct: true,
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);

    const emailList = messages.map(item => {
      const all = item.parts.find(part => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)');
      return {
        from: all?.body.from?.[0] || '',
        to: all?.body.to?.[0] || '',
        subject: all?.body.subject?.[0] || '',
        date: all?.body.date?.[0] || '',
      };
    });

    await connection.end();
    res.status(200).json({ message: '✅ Inbox fetched successfully', emails: emailList });

  } catch (error) {
    console.error('Inbox fetch error:', error.message);
    res.status(500).json({ message: '❌ Failed to fetch inbox', error: error.message });
  }
};

module.exports = {
  fetchInbox,
};
