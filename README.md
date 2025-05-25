# 📬 IITK Mail Client

A cross-platform email client built with **React Native (Expo)** and a **Node.js/Express.js** backend.  
It allows users of **IIT Kanpur’s mail system** to securely login, view inbox emails, and compose/send emails using internal SMTP and IMAP services.

---

## ✨ Features

- 🔐 **Secure login** via IITK SMTP (`mmtp.iitk.ac.in`)
- 📥 **Inbox fetching** via IMAP (`qasid.iitk.ac.in`)
- 📨 **Compose and send emails**
- 💾 **Secure credential storage** (using `expo-secure-store`)
- ✅ Works over **IITK intranet**
- 🧪 Fully testable via **Postman** and **mobile emulator**

---

## 🛠️ Tech Stack

### Frontend (React Native)
- [Expo](https://expo.dev/)
- [Axios](https://axios-http.com/)
- [expo-router](https://expo.github.io/router/docs)
- [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)

### Backend (Node.js + Express)
- `nodemailer` for SMTP mail sending
- `imap-simple` for inbox fetching
- `cors`, `dotenv`, `express`

---

## 📁 Folder Structure

```
iitk-mail-client/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── inboxController.js
│   │   └── sendController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── inbox.js
│   │   └── send.js
│   └── server.js
└── frontend/
    └── app/
        ├── index.tsx
        ├── login.tsx
        ├── inbox.tsx
        ├── email/[id].tsx
        └── compose.tsx
```

---

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
npm install
node server.js
```

- Ensure you’re on **IITK Intranet**.
- Runs on: `http://<your-ip>:3000`

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

- Open using emulator or Expo Go.
- API base URL should match your local IP: `http://<your-ip>:3000`

---

## 🧪 Testing with Postman

1. **Login**
   ```http
   POST /api/login
   {
     "email": "yourid@iitk.ac.in",
     "password": "your_password"
   }
   ```

2. **Fetch Inbox**
   ```http
   POST /api/inbox
   {
     "email": "yourid@iitk.ac.in",
     "password": "your_password"
   }
   ```

3. **Send Mail**
   ```http
   POST /api/send
   {
     "from": "yourid@iitk.ac.in",
     "password": "your_password",
     "to": "recipient@iitk.ac.in",
     "subject": "Test",
     "text": "Hello from IITK Mail Client"
   }
   ```

---

## 🚢 Deployment Instructions

### Backend Deployment

1. Use a server on IITK intranet or cloud VM (with IITK network access).
2. Install Node.js & dependencies:
   ```bash
   npm install
   node server.js
   ```
3. Use `pm2` or `forever` for background running.
4. Expose backend on port `3000` or your preferred port.

### Frontend Deployment

- This app is Expo-based and can be published via:
  ```bash
  npx expo publish
  ```
- To build APK:
  ```bash
  npx expo build:android
  ```

### Notes

- Ensure API URL in frontend points to correct backend IP.
- Secure credentials using Expo Secure Store.

---

## 🔒 Security Notes

- Passwords are **never stored in backend**.
- Credentials are securely stored in Expo Secure Store on device.
- TLS is used for SMTP/IMAP communication with IITK servers.

---

## 📚 Documentation

- IITK SMTP: `mmtp.iitk.ac.in` (port `25`)
- IITK IMAP: `qasid.iitk.ac.in` (port `993`)
- Expo Secure Store: [Docs](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## 🙌 Acknowledgements

- **CC IITK** for email infrastructure
- **OpenAI / ChatGPT** for development guidance
- Inspired by open-source mail clients

--
