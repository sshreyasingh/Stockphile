
const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabaseAdmin  = require('./supabase'); // path to your supabase client
const jwt = require('jsonwebtoken');



// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Handle file upload
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).send("Unauthorized");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const file = req.file;
        if (!file) return res.status(400).send("No file uploaded");

        const path = `${userId}/${Date.now()}-${file.originalname}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase
            .storage
            .from('drive')
            .upload(path, file.buffer, {
                contentType: file.mimetype
            });

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('drive')
            .getPublicUrl(path);

        // Save metadata in Supabase DB
        const { error: dbError } = await supabaseAdmin
            .from('files')
            .insert([
                {
                    name: file.originalname,
                    url: publicUrl,
                    user_id: userId
                }
            ]);

        if (dbError) throw dbError;

        res.send("File uploaded successfully");

    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
