
import { getDb } from '../db/connect.js';

export const getAllBooks = async () => {
    return await getDb()
        .collection('books')
        .find({})
        .toArray();
};

export const getBookById = async (id) => {
    return await getDb()
        .collection('books')
        .findOne({ id });
};

export const authorExists = async (authorId) => {
    const author = await getDb()
        .collection('authors')
        .findOne({ id: authorId });

    return Boolean(author);
};

export const createBook = async (book) => {
    await getDb()
        .collection('books')
        .insertOne(book);

    return await getBookById(book.id);
};

export const updateBook = async (id, book) => {
    await getDb()
        .collection('books')
        .updateOne(
            { id },
            {
                $set: {
                    authorId: book.authorId,
                    title: book.title,
                    publicationDate: book.publicationDate
                }
            }
        );

    return await getBookById(id);
};

export const deleteBook = async (id) => {
    return await getDb()
        .collection('books')
        .deleteOne({ id });
};
