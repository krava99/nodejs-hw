import { Item } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Item.find();
  res.status(200).json(notes);
};

export const getNotesById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Item.findById(noteId);
  if (!note) {
    next(createHttpError(404, 'Note not found.'));
    return;
  }
  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Item.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deleteNote = await Item.findByIdAndDelete(noteId);
  res.status(200).json(deleteNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updatedNote = await Item.findByIdAndUpdate(noteId, req.body, {
    new: true,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found.'));
    return;
  }
  res.status(200).json(updatedNote);
};
