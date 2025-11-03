const Note = require("../models/noteModel");

// @desc Get all notes for logged-in user
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
};

// @desc Create a note
const createNote = async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({
    title,
    content,
    user: req.user.id,
  });
  res.status(201).json(note);
};

// @desc Update a note
const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedNote);
};

// @desc Delete a note
const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });

  if (note.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Not authorized" });

  await note.deleteOne();
  res.json({ message: "Note deleted" });
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
