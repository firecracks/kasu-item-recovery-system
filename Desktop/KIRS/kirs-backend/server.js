// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2/promise'); // using promise-based mysql2
// const app = express();
// const PORT = 5234;
// const bcrypt = require('bcrypt');

// app.use(cors());
// app.use(express.json());

// // Create MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Ibrahim3306',
//   database: 'kirs_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// // GET all users
// app.get('/users', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM users');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST new user (register)
// app.post('/users', async (req, res) => {
//   const { fullName, email, matricId, password } = req.body;

//   try {
//     // Check if email or matricId exists
//     const [existing] = await pool.query(
//       'SELECT * FROM users WHERE email = ? OR matricId = ?',
//       [email, matricId]
//     );

//     if (existing.length > 0) {
//       const user = existing[0];
//       if (user.status === 'rejected') {
//         // Overwrite old details for rejected user
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         await pool.query(
//           'UPDATE users SET fullName = ?, email = ?, password = ?, status = ? WHERE id = ?',
//           [fullName, email, hashedPassword, 'pending', user.id]
//         );

//         const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [user.id]);
//         return res.status(200).json({
//           id: updatedUser[0].id,
//           fullName: updatedUser[0].fullName,
//           email: updatedUser[0].email,
//           matricId: updatedUser[0].matricId,
//           status: updatedUser[0].status
//         });
//       } else {
//         return res.status(400).json({ message: 'Email or Matric ID already registered' });
//       }
//     }

//     // Hash the password before storing
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert user with hashed password
//     const [result] = await pool.query(
//       'INSERT INTO users (fullName, email, matricId, password, status) VALUES (?, ?, ?, ?, ?)',
//       [fullName, email, matricId, hashedPassword, 'pending']
//     );

//     const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

//     res.status(201).json({
//       id: newUser[0].id,
//       fullName: newUser[0].fullName,
//       email: newUser[0].email,
//       matricId: newUser[0].matricId,
//       status: newUser[0].status
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST login
// app.post('/login', async (req, res) => {
//   const { matricId, password } = req.body;

//   try {
//     // Find user by matricId
//     const [users] = await pool.query('SELECT * FROM users WHERE matricId = ?', [matricId]);

//     if (users.length === 0) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const user = users[0];

//     // Compare hashed password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check account status
//     if (user.status === 'pending') {
//       return res.status(403).json({ message: 'Your account is still pending verification. Please wait for approval.' });
//     }

//     if (user.status === 'rejected') {
//       return res.status(403).json({ message: 'Your registration was rejected. Please register again or contact Admin.' });
//     }

//     // Successful login
//     res.json({
//       message: 'Login successful',
//       fullName: user.fullName,
//       matricId: user.matricId,
//       email: user.email,
//       status: user.status
//       // ❌ Don't return password
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // POST /admin-login
// app.post("/admin-login", async (req, res) => {
//   const { password } = req.body;

//   try {
//     const [rows] = await pool.query(
//       "SELECT * FROM admins WHERE password = ?",
//       [password]
//     );

//     if (rows.length > 0) {
//       res.status(200).json({ success: true, message: "Login successful" });
//     } else {
//       res.status(401).json({ success: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// const multer = require('multer');
// const path = require('path');

// // Setup file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // folder to save uploads
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });

// const upload = multer({ storage: storage });

// // GET all verifications
// app.get('/verifications', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM verifications');
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST /verifyidentity
// app.post('/verifyidentity', upload.fields([
//   { name: 'idCard', maxCount: 1 },
//   { name: 'livePhoto', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     console.log('req.body:', req.body);
//     console.log('req.files:', req.files);
//     const { matricId } = req.body;
//     const idCard = req.files['idCard']?.[0];
//     const livePhoto = req.files['livePhoto']?.[0];

//     if (!matricId || !idCard || !livePhoto) {
//       return res.status(400).json({ message: 'Missing data or files.' });
//     }

//     // Save file paths to verifications table
//     await pool.query(`
//       INSERT INTO verifications (matricId, idCardPath, livePhotoPath)
//       VALUES (?, ?, ?)
//     `, [matricId, idCard.filename, livePhoto.filename]);

//     res.json({ message: 'Verification documents uploaded successfully.' });

//   } catch (err) {
//     console.error('Verification upload error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// app.use('/uploads', express.static('uploads'));

// // PATCH /users/:id to approve or reject
// app.patch('/users/:id', async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;

//   try {
//     await pool.query(
//       'UPDATE users SET status = ? WHERE id = ?',
//       [status, id]
//     );
//     res.json({ message: `User status updated to ${status}` });
//   } catch (err) {
//     console.error('Update error:', err);
//     res.status(500).json({ message: 'Database update failed' });
//   }
// });

// // POST /found-items
// app.post('/found-items', async (req, res) => {
//   const { itemName, description, location, image, reporterName, reporterEmail } = req.body;
//   try {
//     await pool.query(
//       'INSERT INTO found_items (itemName, description, location, image, reporterName, reporterEmail) VALUES (?, ?, ?, ?, ?, ?)',
//       [itemName, description, location, image, reporterName, reporterEmail]
//     );
//     res.json({ message: 'Found item reported successfully' });
//   } catch (err) {
//     console.error('Error reporting found item:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// // GET all found items
// app.get('/found-items', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM found_items');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching found items:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// // PUT endpoint to update status of a lost item
// app.put('/found-items/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const [result] = await pool.query(
//       'UPDATE found_items SET status = ? WHERE id = ?',
//       [status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     res.json({ message: 'Status updated successfully' });
//   } catch (err) {
//     console.error('Error updating item status:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// // POST /lost-items
// app.post('/lost-items', async (req, res) => {
//   const { itemName, description, location, image, reporterName, reporterEmail } = req.body;

//   try {
//     await pool.query(
//       'INSERT INTO lost_items (itemName, description, location, image, reporterName, reporterEmail, status) VALUES (?, ?, ?, ?, ?, ?, "unclaimed")',
//       [itemName, description, location, image, reporterName, reporterEmail]
//     );
//     res.json({ message: 'Lost item reported successfully' });
//   } catch (err) {
//     console.error('Error reporting lost item:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// // GET all lost items
// app.get('/lost-items', async (req, res) => {
//   try {
//     const [rows] = await pool.query('SELECT * FROM lost_items');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error fetching lost items:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// // PUT endpoint to update status of a lost item
// app.put('/lost-items/:id', async (req, res) => {
//   const { id } = req.params;
//   const { status } = req.body;

//   try {
//     const [result] = await pool.query(
//       'UPDATE lost_items SET status = ? WHERE id = ?',
//       [status, id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     res.json({ message: 'Status updated successfully' });
//   } catch (err) {
//     console.error('Error updating item status:', err);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// const nodemailer = require("nodemailer");

// // Configure your email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail", // or use SMTP if you prefer
//   auth: {
//     user: "sir.brakatata@gmail.com",  // sender email
//     pass: "qvdq udko ilzs jbru",    // app password (NOT your normal Gmail password!)
//   },
// });

// // POST /send-claim-email-lost
// app.post("/send-claim-email-lost", async (req, res) => {
//   const { reporterEmail, reporterName, itemName, claimerEmail } = req.body;

//   if (!reporterEmail || !claimerEmail || !itemName) {
//     return res.status(400).json({ message: "Missing email data" });
//   }

//   try {
//   const mailOptions = {
//   from: "Kasu Item Recovery System",
//   to: reporterEmail,
//   subject: `Claim Request for "${itemName}"`,
//   html: `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <h2>KASU Item Recovery System</h2>
//       <p>Hello <strong>${reporterName || "User"}</strong>,</p>
//       <p>Someone has found your lost item:</p>
//       <p><strong>${itemName}</strong></p>
//       <p><strong>Claimer’s Email:</strong> ${claimerEmail}</p>
      
//       <p>Please review and contact the founder to verify ownership.</p>
      
//       <a href="mailto:${claimerEmail}?subject=Response%20to%20Your%20Claim%20for%20${encodeURIComponent(itemName)}&body=${encodeURIComponent(
//         `Hello,

// I received a message you found the lost item "${itemName}", which I reported on the KASU Item Recovery System.

// Could you please provide the following details to help me verify ownership?
// 1. A brief description of the item (e.g., color, brand, any unique marks).
// 2. Where and when you lost it.
// 3. Any proof of ownership (e.g., purchase receipt or matching phone case).

// Once verified, we can arrange a safe way to hand it over — preferably within the school premises.

// Thank you,
// ${reporterName}
// KASU Item Recovery System`
//       )}"
//       style="display:inline-block; padding:10px 20px; background:#006400; color:#fff; text-decoration:none; border-radius:5px;">
//         📩 Contact Claimer
//       </a>

//       <p style="margin-top:20px; font-size:12px; color:#777;">
//         — KASU Item Recovery System (Automated message, please do not reply directly)
//       </p>
//     </div>
//   `,
// };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Failed to send email" });
//   }
// });

// // POST /send-claim-email-found
// app.post("/send-claim-email-found", async (req, res) => {
//   const { reporterEmail, reporterName, itemName, claimerEmail } = req.body;

//   if (!reporterEmail || !claimerEmail || !itemName) {
//     return res.status(400).json({ message: "Missing email data" });
//   }

//   try {
//   const mailOptions = {
//   from: "Kasu Item Recovery System",
//   to: reporterEmail,
//   subject: `Claim Request for "${itemName}"`,
//   html: `
//     <div style="font-family: Arial, sans-serif; color: #333;">
//       <h2>KASU Item Recovery System</h2>
//       <p>Hello <strong>${reporterName || "User"}</strong>,</p>
//       <p>Someone has submitted a claim request for your found item:</p>
//       <p><strong>${itemName}</strong></p>
//       <p><strong>Claimer’s Email:</strong> ${claimerEmail}</p>
      
//       <p>Please review the claim and contact the claimer to verify ownership.</p>
      
//       <a href="mailto:${claimerEmail}?subject=Response%20to%20Your%20Claim%20for%20${encodeURIComponent(itemName)}&body=${encodeURIComponent(
//         `Hello,

//   I received your claim for the found item "${itemName}", which I reported on the KASU Item Recovery System.

//   Could you please provide the following details to help me verify ownership?
//   1. A brief description of the item (e.g., color, brand, any unique marks).
//   2. Where and when you lost it.
//   3. Any proof of ownership (e.g., purchase receipt or matching phone case).

//   Once verified, we can arrange a safe way to hand it over — preferably within the school premises.

//   Thank you,
//   ${reporterName}
//   KASU Item Recovery System`
//       )}"
//       style="display:inline-block; padding:10px 20px; background:#006400; color:#fff; text-decoration:none; border-radius:5px;">
//         📩 Contact Claimer
//       </a>

//       <p style="margin-top:20px; font-size:12px; color:#777;">
//         — KASU Item Recovery System (Automated message, please do not reply directly)
//       </p>
//     </div>
//   `,
//   };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ message: "Failed to send email" });
//   }
// });

/*
Production-ready backend for KASU Item Recovery System
File: index.js

Features:
- Uses mysql2/promise connection pool with environment variables
- Uses Cloudinary for image uploads via multer-storage-cloudinary
- Uses dotenv for local development
- Supports CORS (restrictable via FRONTEND_URL env var)
- Uses bcrypt for password hashing
- Uses nodemailer (with env email credentials)
- Ready for Render deployment (uses process.env.PORT)

Dependencies (install):
npm install express cors mysql2 bcrypt multer cloudinary multer-storage-cloudinary nodemailer dotenv

.env.example (do NOT commit real secrets):

DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_PORT=3306

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

FRONTEND_URL=https://your-frontend.vercel.app
PORT= (Render provides automatically)

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password

NODE_ENV=production

---
Deployment notes:
- On Render, set Start Command: node index.js
- Add the environment variables above in the service's Environment section
- For database use Railway credentials
- For Cloudinary, use values from Cloudinary dashboard
- If running locally, create a .env file with the .env.example values

*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3306;

// Configure CORS: restrict to FRONTEND_URL if set
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Optional: customize folder and public_id
    return {
      folder: 'kasu_uploads',
      resource_type: 'image',
      format: 'jpg', // convert to jpg if needed
    };
  },
});

const upload = multer({ storage: storage });

// MySQL connection pool using env vars
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Nodemailer transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'KASU Backend running' });
});

// USERS
// GET all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, fullName, email, matricId, status FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// POST new user (register)
app.post('/users', async (req, res) => {
  const { fullName, email, matricId, password } = req.body;
  if (!fullName || !email || !matricId || !password) return res.status(400).json({ message: 'Missing data' });
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ? OR matricId = ?', [email, matricId]);
    if (existing.length > 0) {
      const user = existing[0];
      if (user.status === 'rejected') {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET fullName = ?, email = ?, password = ?, status = ? WHERE id = ?', [fullName, email, hashedPassword, 'pending', user.id]);
        const [updatedUser] = await pool.query('SELECT id, fullName, email, matricId, status FROM users WHERE id = ?', [user.id]);
        return res.status(200).json(updatedUser[0]);
      } else {
        return res.status(400).json({ message: 'Email or Matric ID already registered' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (fullName, email, matricId, password, status) VALUES (?, ?, ?, ?, ?)', [fullName, email, matricId, hashedPassword, 'pending']);
    const [newUser] = await pool.query('SELECT id, fullName, email, matricId, status FROM users WHERE id = ?', [result.insertId]);
    res.status(201).json(newUser[0]);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST login
app.post('/login', async (req, res) => {
  const { matricId, password } = req.body;
  if (!matricId || !password) return res.status(400).json({ message: 'Missing credentials' });
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE matricId = ?', [matricId]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.status === 'pending') return res.status(403).json({ message: 'Your account is still pending verification.' });
    if (user.status === 'rejected') return res.status(403).json({ message: 'Your registration was rejected.' });
    res.json({ message: 'Login successful', fullName: user.fullName, matricId: user.matricId, email: user.email, status: user.status });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN LOGIN - assume admins table has hashed password? For now compare directly (you should hash)
app.post('/admin-login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Missing credentials' });
  try {
    const [rows] = await pool.query('SELECT * FROM admins LIMIT 1');
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'No admin configured' });
    const admin = rows[0];
    // If admin password is hashed, use bcrypt.compare
    if (admin.password && admin.password.startsWith('$2b$')) {
      const match = await bcrypt.compare(password, admin.password);
      if (match) return res.status(200).json({ success: true, message: 'Login successful' });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    // fallback plain-text check (not recommended)
    if (password === admin.password) return res.status(200).json({ success: true, message: 'Login successful' });
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// VERIFICATIONS
app.get('/verifications', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM verifications');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching verifications:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Upload identity docs to Cloudinary
app.post('/verifyidentity', upload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'livePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { matricId } = req.body;
    const idCardFile = req.files['idCard']?.[0];
    const livePhotoFile = req.files['livePhoto']?.[0];
    if (!matricId || !idCardFile || !livePhotoFile) return res.status(400).json({ message: 'Missing data or files.' });
    // Multer + Cloudinary storage returns file.path as URL
    const idCardUrl = idCardFile.path || idCardFile.secure_url || idCardFile.location || idCardFile.url;
    const livePhotoUrl = livePhotoFile.path || livePhotoFile.secure_url || livePhotoFile.location || livePhotoFile.url;
    await pool.query('INSERT INTO verifications (matricId, idCardPath, livePhotoPath) VALUES (?, ?, ?)', [matricId, idCardUrl, livePhotoUrl]);
    res.json({ message: 'Verification documents uploaded successfully.' });
  } catch (err) {
    console.error('Verification upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// FOUND / LOST ITEMS
app.post('/found-items', async (req, res) => {
  const { itemName, description, location, image, reporterName, reporterEmail } = req.body;
  try {
    await pool.query('INSERT INTO found_items (itemName, description, location, image, reporterName, reporterEmail) VALUES (?, ?, ?, ?, ?, ?)', [itemName, description, location, image, reporterName, reporterEmail]);
    res.json({ message: 'Found item reported successfully' });
  } catch (err) {
    console.error('Error reporting found item:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.get('/found-items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM found_items');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching found items:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.put('/found-items/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query('UPDATE found_items SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Error updating item status:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.post('/lost-items', async (req, res) => {
  const { itemName, description, location, image, reporterName, reporterEmail } = req.body;
  try {
    await pool.query('INSERT INTO lost_items (itemName, description, location, image, reporterName, reporterEmail, status) VALUES (?, ?, ?, ?, ?, ?, "unclaimed")', [itemName, description, location, image, reporterName, reporterEmail]);
    res.json({ message: 'Lost item reported successfully' });
  } catch (err) {
    console.error('Error reporting lost item:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.get('/lost-items', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lost_items');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching lost items:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

app.put('/lost-items/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const [result] = await pool.query('UPDATE lost_items SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Error updating item status:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// EMAIL SENDING ENDPOINTS (claim notifications)
async function sendClaimEmail({ to, reporterName, itemName, claimerEmail }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `Claim Request for "${itemName}"`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>KASU Item Recovery System</h2>
        <p>Hello <strong>${reporterName || 'User'}</strong>,</p>
        <p>Someone has submitted a claim/request regarding your item:</p>
        <p><strong>${itemName}</strong></p>
        <p><strong>Claimer’s Email:</strong> ${claimerEmail}</p>
        <p>Please review and contact the claimer to verify ownership.</p>
        <p style="margin-top:20px; font-size:12px; color:#777;">— KASU Item Recovery System</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
}

app.post('/send-claim-email-lost', async (req, res) => {
  const { reporterEmail, reporterName, itemName, claimerEmail } = req.body;
  if (!reporterEmail || !claimerEmail || !itemName) return res.status(400).json({ message: 'Missing email data' });
  try {
    await sendClaimEmail({ to: reporterEmail, reporterName, itemName, claimerEmail });
    res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

app.post('/send-claim-email-found', async (req, res) => {
  const { reporterEmail, reporterName, itemName, claimerEmail } = req.body;
  if (!reporterEmail || !claimerEmail || !itemName) return res.status(400).json({ message: 'Missing email data' });
  try {
    await sendClaimEmail({ to: reporterEmail, reporterName, itemName, claimerEmail });
    res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// PATCH /users/:id to approve or reject
app.patch('/users/:id', async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `User status updated to ${status}` });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Database update failed' });
  }
});

// Start server and verify DB connection
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Database connected.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to database:', err);
    process.exit(1);
  }
})();
