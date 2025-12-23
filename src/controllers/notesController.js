import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res, next) => {
  const { page, perPage, tag, search } = req.query;
  const skip = (page - 1) * perPage;
  const noteQuery = Note.find();
  if (tag) {
    noteQuery.where('tag').equals(tag);
  }
  if (search) {
    noteQuery.where({ $text: { $search: search } });
  }

  try {
    const totalQuery = await noteQuery.clone().countDocuments();
    const notes = await noteQuery.skip(skip).limit(perPage);
    const totalPage = Math.ceil(totalQuery / perPage);
    res.status(200).json({ notes, page, perPage, totalQuery, totalPage });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const deletedNote = await Note.findByIdAndDelete(noteId);
  if (!deletedNote) {
    next(createHttpError(404, 'Note not found.'));
    return;
  }
  res.status(200).json(deletedNote);
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
    new: true,
  });
  if (!updatedNote) {
    next(createHttpError(404, 'Note not found.'));
    return;
  }
  res.status(200).json(updatedNote);
};
