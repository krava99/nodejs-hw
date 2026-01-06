import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  const { page, perPage, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const noteQuery = Note.find({ userId: req.user._id });
  if (tag) {
    noteQuery.where('tag').equals(tag);
  }
  if (search) {
    noteQuery.where({ $text: { $search: search } });
  }

  try {
    const [totalNotes, notes] = await Promise.all([
      noteQuery.clone().countDocuments(),
      noteQuery.skip(skip).limit(perPage),
    ]);
    const totalPages = Math.ceil(totalNotes / perPage);
    res.status(200).json({ notes, page, perPage, totalNotes, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });
  if (!deletedNote) {
    next(createHttpError(404, 'Note not found.'));
    return;
  }
  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    {
      new: true,
    },
  );
  if (!updatedNote) {
    next(createHttpError(404, 'Note not found.'));
    return;
  }
  res.status(200).json(updatedNote);
};
