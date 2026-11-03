import express from 'express';
import {
    getBooksHandler,
    getBookByIdHandler
} from './controllers/books.js';

const router = express.Router();

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of all books.
 *     responses:
 *       200:
 *         description: Successfully retrieved all books.
 *       500:
 *         description: Server error.
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     description: Retrieve a single book using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the book.
 *     responses:
 *       200:
 *         description: Successfully retrieved the book.
 *       404:
 *         description: Book not found.
 *       500:
 *         description: Server error.
 */
router.get('/books/:id', getBookByIdHandler);

export default router;