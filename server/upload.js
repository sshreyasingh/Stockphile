const express = require("express");
const router = express.Router();

const multer = require("multer");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { createClient } =
  require("@supabase/supabase-js");

/* VERIFY TOKEN */

function verifyToken(req, res, next) {

  const token = req.cookies.token;

  if (!token)
    return res.redirect("/user/login");

  try {

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();

  }

  catch {

    return res.redirect("/user/login");

  }

}

/* MULTER */

const storage = multer.memoryStorage();

const upload =
  multer({ storage });

/* SUPABASE */

const supabase =
  createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

/* HOME */

router.get("/home",
  verifyToken,
  (req, res) => {

    res.render("home", {
      userId: req.user.userId
    });

  });

/* UPLOAD FILE */

router.post("/upload",
  verifyToken,
  upload.single("file"),
  async (req, res) => {

    try {

      const file = req.file;

      if (!file) {

        return res.status(400)
          .json({
            error: "No file uploaded"
          });

      }

      const userId =
        req.user.userId;

      const filePath =
        `uploads/${userId}/${Date.now()}-${file.originalname}`;

      const { error } =
        await supabase.storage
          .from("drive")
          .upload(
            filePath,
            file.buffer,
            {
              contentType:
                file.mimetype
            }
          );

      if (error)
        throw error;

      res.json({
        message:
          "File uploaded successfully"
      });

    }

    catch (err) {

      console.error(err);

      res.status(500)
        .json({
          error:
            err.message
        });

    }

  });

/* LIST FILES */

async function listUserFiles(userId) {

  const { data, error } =
    await supabase.storage
      .from("drive")
      .list(
        `uploads/${userId}`
      );

  if (error)
    throw error;

  return data.map(file => {

    const {
      data: urlData
    } =
      supabase.storage
        .from("drive")
        .getPublicUrl(
          `uploads/${userId}/${file.name}`
        );

    return {

      name:
        file.name,

      url:
        urlData.publicUrl

    };

  });

}

/* FILES PAGE */

router.get("/files",
  verifyToken,
  async (req, res) => {

    try {

      const userId =
        req.user.userId;

      const files =
        await listUserFiles(
          userId
        );

      res.render(
        "files",
        { files }
      );

    }

    catch (err) {

      console.error(err);

      res.status(500)
        .send(
          "Error loading files"
        );

    }

  });

/* DOWNLOAD */

router.get(
  "/download/:filename",
  verifyToken,
  async (req, res) => {

    try {

      const userId =
        req.user.userId;

      const filename =
        req.params.filename;

      const filePath =
        `uploads/${userId}/${filename}`;

      const { data, error } =
        await supabase.storage
          .from("drive")
          .download(filePath);

      if (error)
        throw error;

      const buffer =
        Buffer.from(
          await data.arrayBuffer()
        );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      res.send(buffer);

    }

    catch (err) {

      console.error(err);

      res.status(500)
        .send(
          "Download failed"
        );

    }

  });

/* DELETE */

router.post(
  "/delete/:filename",
  verifyToken,
  async (req, res) => {

    try {

      const userId =
        req.user.userId;

      const filename =
        req.params.filename;

      const filePath =
        `uploads/${userId}/${filename}`;

      await supabase.storage
        .from("drive")
        .remove([filePath]);

      res.redirect("/files");

    }

    catch (err) {

      console.error(err);

      res.status(500)
        .send(
          "Delete failed"
        );

    }

  });

module.exports = router;