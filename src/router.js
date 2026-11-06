
import express from 'express';

import {
    getBooksHandler,
    getBookByIdHandler
} from './controllers/books.js';

import {
    getAuthorsHandler,
    getAuthorByIdHandler,
    createAuthorHandler,
    updateAuthorHandler,
    deleteAuthorHandler
} from './controllers/authors.js';

const router = express.Router();

/* =========================
   BOOKS API
========================= */

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


/* =========================
   AUTHORS API
========================= */

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     description: Retrieve a list of all authors.
 *     responses:
 *       200:
 *         description: Successfully retrieved all authors.
 *       500:
 *         description: Server error.
 */
router.get('/authors', getAuthorsHandler);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get an author by ID
 *     description: Retrieve a single author using their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author.
 *     responses:
 *       200:
 *         description: Successfully retrieved the author.
 *       404:
 *         description: Author not found.
 *       500:
 *         description: Server error.
 */
router.get('/authors/:id', getAuthorByIdHandler);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create a new author
 *     description: Add a new author to the collection.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Author created successfully.
 *       400:
 *         description: Invalid input or duplicate author ID.
 *       500:
 *         description: Server error.
 */
router.post('/authors', createAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     description: Update an existing author's name and birth year.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Author updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Author not found.
 *       500:
 *         description: Server error.
 */
router.put('/authors/:id', updateAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author
 *     description: Delete an author if no books reference them.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the author.
 *     responses:
 *       204:
 *         description: Author deleted successfully.
 *       404:
 *         description: Author not found.
 *       409:
 *         description: Author has associated books.
 *       500:
 *         description: Server error.
 */
router.delete('/authors/:id', deleteAuthorHandler);

export default router;
