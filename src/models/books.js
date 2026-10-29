
import { getDb } from '../db/connect.js';

export const getAllBooks = async () => {
    const books = await getDb()
        .collection('books')
        .find({})
        .toArray();

    return books;
};

export const getBookById = async (id) => {
    const book = await getDb()
        .collection('books')
        .findOne({ id });

    return book;
};
