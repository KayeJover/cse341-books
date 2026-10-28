
import express from 'express';
import { getDb } from './src/db/connect.js';

const app = express();
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Server is running'
    });
});

// GET /books - Retrieve all books
app.get('/books', async (req, res) => {
    console.log('GET /books handler reached');

    try {
        const books = await getDb()
            .collection('books')
            .find({})
            .toArray();

        return res.status(200).json(books);
    } catch (error) {
        console.error('Failed to retrieve books:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

// GET /books/:id - Retrieve one book by custom id
app.get('/books/:id', async (req, res) => {
    try {
        const book = await getDb()
            .collection('books')
            .findOne({ id: req.params.id });

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        console.error('Failed to retrieve book:', error.message);

        return res.status(500).json({
            message: 'Internal server error'
        });
    }
});

console.log(
    'Registered routes:',
    app.router.stack
        .filter((layer) => layer.route)
        .map((layer) => layer.route.path)
);

export default app;
