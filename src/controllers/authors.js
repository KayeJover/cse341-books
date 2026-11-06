
import {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    authorHasBooks
} from '../models/authors.js';

export const getAuthorsHandler = async (req, res) => {
    try {
        const authors = await getAllAuthors();
        return res.status(200).json(authors);
    } catch (error) {
        console.error('Failed to retrieve authors:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve authors.'
        });
    }
};

export const getAuthorByIdHandler = async (req, res) => {
    try {
        const author = await getAuthorById(req.params.id);

        if (!author) {
            return res.status(404).json({
                message: 'Author not found'
            });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Failed to retrieve author:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve author.'
        });
    }
};

export const createAuthorHandler = async (req, res) => {
    try {
        const { id, name, birthYear } = req.body;

        if (
            typeof id !== 'string' || !id.trim() ||
            typeof name !== 'string' || !name.trim() ||
            !Number.isInteger(birthYear) ||
            birthYear < 1000 ||
            birthYear > new Date().getFullYear()
        ) {
            return res.status(400).json({
                message: 'Valid id, name, and birthYear are required.'
            });
        }

        const existingAuthor = await getAuthorById(id);

        if (existingAuthor) {
            return res.status(400).json({
                message: 'Author ID already exists.'
            });
        }

        const author = await createAuthor({
            id: id.trim(),
            name: name.trim(),
            birthYear
        });

        return res.status(201).json(author);
    } catch (error) {
        console.error('Failed to create author:', error.message);

        return res.status(500).json({
            message: 'Failed to create author.'
        });
    }
};

export const updateAuthorHandler = async (req, res) => {
    try {
        const { name, birthYear } = req.body;
        const id = req.params.id;

        if (
            typeof name !== 'string' || !name.trim() ||
            !Number.isInteger(birthYear) ||
            birthYear < 1000 ||
            birthYear > new Date().getFullYear() ||
            Object.keys(req.body).some(
                key => {return !['name', 'birthYear'].includes(key)}
            )
        ) {
            return res.status(400).json({
                message: 'Valid name and birthYear are required.'
            });
        }

        const author = await updateAuthor(id, {
            name: name.trim(),
            birthYear
        });

        if (!author) {
            return res.status(404).json({
                message: 'Author not found'
            });
        }

        return res.status(200).json(author);
    } catch (error) {
        console.error('Failed to update author:', error.message);

        return res.status(500).json({
            message: 'Failed to update author.'
        });
    }
};

export const deleteAuthorHandler = async (req, res) => {
    try {
        const id = req.params.id;
        const author = await getAuthorById(id);

        if (!author) {
            return res.status(404).json({
                message: 'Author not found'
            });
        }

        if (await authorHasBooks(id)) {
            return res.status(409).json({
                message: 'Cannot delete author because books are associated with this author.'
            });
        }

        await deleteAuthor(id);

        return res.status(204).send();
    } catch (error) {
        console.error('Failed to delete author:', error.message);

        return res.status(500).json({
            message: 'Failed to delete author.'
        });
    }
};
