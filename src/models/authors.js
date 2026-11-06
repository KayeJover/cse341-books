
import { getDb } from '../db/connect.js';

export const getAllAuthors = async () => {
    const authors = await getDb()
        .collection('authors')
        .find({})
        .toArray();

    return authors;
};

export const getAuthorById = async (id) => {
    const author = await getDb()
        .collection('authors')
        .findOne({ id });

    return author;
};

export const createAuthor = async (author) => {
    await getDb()
        .collection('authors')
        .insertOne(author);

    return getAuthorById(author.id);
};

export const updateAuthor = async (id, author) => {
    const result = await getDb()
        .collection('authors')
        .updateOne(
            { id },
            {
                $set: {
                    name: author.name,
                    birthYear: author.birthYear
                }
            }
        );

    if (result.matchedCount === 0) {
        return null;
    }

    return getAuthorById(id);
};

export const deleteAuthor = async (id) => {
    const result = await getDb()
        .collection('authors')
        .deleteOne({ id });

    return result.deletedCount > 0;
};

export const authorHasBooks = async (id) => {
    const book = await getDb()
        .collection('books')
        .findOne({ authorId: id });

    return Boolean(book);
};
