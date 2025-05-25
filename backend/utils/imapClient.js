const imaps = require('imap-simple');

function connectToIMAP({ email, password }) {
  const config = {
    imap: {
      user: email,
      password: password,
      host: 'qasid.iitk.ac.in',
      port: 993,
      tls: true,
      authTimeout: 10000
    }
  };

  return imaps.connect(config);
}

module.exports = { connectToIMAP };
