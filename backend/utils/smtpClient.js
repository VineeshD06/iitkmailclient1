const nodemailer = require('nodemailer');

function createTransporter(user, pass) {
  return nodemailer.createTransport({
    host: 'mmtp.iitk.ac.in',
    port: 25,
    secure: false, // port 25 is not secure
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

async function verifyLogin(user, pass) {
  const transporter = createTransporter(user, pass);

  try {
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

async function sendMail(user, pass, mailOptions) {
  const transporter = createTransporter(user, pass);

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = { verifyLogin, sendMail };
