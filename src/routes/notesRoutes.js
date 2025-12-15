import { Router } from 'express';

import {
  createNote,
  deleteNote,
  getAllNotes,
  getNotesById,
} from '../controllers/notesController.js';

const router = Router();

router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNotesById);

router.post('/notes', createNote);

router.delete('/notes/:noteId', deleteNote);

export default router;
