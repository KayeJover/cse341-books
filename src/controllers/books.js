
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    authorExists
} from '../models/books.js';

const isValidDate = (date) => {
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    return !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;
};

const isNonEmptyString = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};

const hasOnlyFields = (body, allowedFields) => {
    return Object.keys(body).every((field) => {return allowedFields.includes(field)});
};

export const getBooksHandler = async (req, res) => {
    try {
        const books = await getAllBooks();
        return res.status(200).json(books);
    } catch (error) {
        console.error('Failed to retrieve books:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve books.'
        });
    }
};

export const getBookByIdHandler = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Failed to retrieve book:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve book.'
        });
    }
};

export const createBookHandler = async (req, res) => {
    try {
        const { id, authorId, title, publicationDate } = req.body ?? {};

        if (
            !hasOnlyFields(req.body ?? {}, ['id', 'authorId', 'title', 'publicationDate']) ||
            !isNonEmptyString(id) ||
            !isNonEmptyString(authorId) ||
            !isNonEmptyString(title) ||
            !isValidDate(publicationDate)
        ) {
            return res.status(400).json({
                message: 'Valid id, authorId, title, and publicationDate are required.'
            });
        }

        const existingBook = await getBookById(id);

        if (existingBook) {
            return res.status(400).json({
                message: 'Book ID already exists.'
            });
        }

        if (!(await authorExists(authorId))) {
            return res.status(400).json({
                message: 'Referenced author does not exist.'
            });
        }

        const book = await createBook({
            id: id.trim(),
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate
        });

        return res.status(201).json(book);
    } catch (error) {
        console.error('Failed to create book:', error.message);

        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Book ID already exists.'
            });
        }

        return res.status(500).json({
            message: 'Failed to create book.'
        });
    }
};

export const updateBookHandler = async (req, res) => {
    try {
        const { authorId, title, publicationDate } = req.body ?? {};

        if (
            !hasOnlyFields(req.body ?? {}, ['authorId', 'title', 'publicationDate']) ||
            !isNonEmptyString(authorId) ||
            !isNonEmptyString(title) ||
            !isValidDate(publicationDate)
        ) {
            return res.status(400).json({
                message: 'Valid authorId, title, and publicationDate are required.'
            });
        }

        const existingBook = await getBookById(req.params.id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        if (!(await authorExists(authorId))) {
            return res.status(400).json({
                message: 'Referenced author does not exist.'
            });
        }

        const book = await updateBook(req.params.id, {
            authorId: authorId.trim(),
            title: title.trim(),
            publicationDate
        });

        return res.status(200).json(book);
    } catch (error) {
        console.error('Failed to update book:', error.message);

        return res.status(500).json({
            message: 'Failed to update book.'
        });
    }
};

export const deleteBookHandler = async (req, res) => {
    try {
        const existingBook = await getBookById(req.params.id);

        if (!existingBook) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        await deleteBook(req.params.id);

        return res.status(204).send();
    } catch (error) {
        console.error('Failed to delete book:', error.message);

        return res.status(500).json({
            message: 'Failed to delete book.'
        });
    }
};
