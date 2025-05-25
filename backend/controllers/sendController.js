const nodemailer = require('nodemailer');

exports.sendMail = async (req, res) => {
  const { email, password, to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'mmtp.iitk.ac.in',
    port: 25,
    secure: false,
    auth: {
      user: email,
      pass: password
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: email,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: '✅ Mail sent successfully' });
  } catch (err) {
    console.error('Mail send error:', err.message);
    res.status(500).json({ message: '❌ Failed to send mail', error: err.message });
  }
};
