// const express=require('express');

// const router=express.Router();
// const uploading=require('../config/multer')
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js'); // path to your supabase client
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.get('/home', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
let decoded;
try {
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  return res.redirect('/login');
}

  res.render('home', { userId: decoded.userId });
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

const { verifyToken } = require('../auth');



router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.userId;
    const filePath = `uploads/${userId}/${Date.now()}-${file.originalname}`;

    const { data, error } = await supabase.storage
      .from("drive")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;
    console.log(userId);

    // res.json({ message: "File uploaded successfully", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
 res.redirect('/files');
  
});

// Download a file
router.get("/download/:filename", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const filename = req.params.filename;
    const filePath = `uploads/${userId}/${filename}`;

    const { data, error } = await supabase.storage
      .from("drive")
      .download(filePath);

    if (error) throw error;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", data.type);

    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a file
router.post("/delete/:filename", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const filename = req.params.filename;
    const filePath = `uploads/${userId}/${filename}`;

    const { error } = await supabase.storage
      .from("drive")
      .remove([filePath]);

    if (error) throw error;

    res.redirect("/files"); // reload files page after delete
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});




router.get("/files", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT
    if (!userId) return res.status(400).json({ error: "User ID not found" });

    // List files from this user's folder
    const { data, error } = await supabase.storage
      .from("drive") // your Supabase bucket name
      .list(`uploads/${userId}`, {
        limit: 100, // optional
        sortBy: { column: "created_at", order: "desc" }
      });

    if (error) throw error;

    // Generate public URLs for each file
    const filesWithUrls = data.map(file => {
      const { data: publicUrlData } = supabase.storage
        .from("drive")
        .getPublicUrl(`uploads/${userId}/${file.name}`);

      return {
        name: file.name,
        url: publicUrlData.publicUrl
      };
    });

    res.render("files", { files: filesWithUrls }); // EJS template
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



router.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.from('files').select('*').limit(1);

    // if (error) throw error;
    if (error) {
  console.error(error);

  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing');

  
  return res.status(500).json({ error: error.message || 'Upload failed' });
}


    res.send({
      message: "Supabase connected successfully!",
      sampleData: data
    });
 } catch (err) {
    res.status(500).send({
      message: "Failed to connect to Supabase.",
      error: err.message
    });
}
});

module.exports=router;