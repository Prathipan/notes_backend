const express = require("express");
const { AuthorizeUser } = require("../controllers/login");
const Notes = require("../models/NotesModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const notesRouter = express.Router();

notesRouter.use(AuthorizeUser);

notesRouter.get("/", async (req, res) => {
  let token = req.headers.authorization;
  token = jwt.verify(token, process.env.login_secret, async (err, decode) => {
    if (err) res.status(500).send("Token is not valid");
    try {
      const data = await Notes.find({ user: decode.userId });
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  });
});

notesRouter.post("/create", async (req, res) => {
  try {
    const note = await Notes(req.body);
    await note.save();
    res.status(200).send(note);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server busy");
  }
});

notesRouter.get("/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id);
    res.status(200).send(note);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server busy");
  }
});

notesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedNotes = await Notes.findByIdAndUpdate({ _id: id },{ $set : req.body},{new : true});
    res.status(200).send(updatedNotes);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

notesRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await Notes.findByIdAndDelete({ _id: id });
      res.status(200).send("Note deleted");
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  });

module.exports = notesRouter;
