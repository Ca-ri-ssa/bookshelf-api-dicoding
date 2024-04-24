/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable keyword-spacing */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable radix */
/* eslint-disable arrow-parens */
/* eslint-disable no-extra-semi */
/* eslint-disable no-else-return */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */

const { nanoid } = require('nanoid');
const bookshelf = require('./bookshelf');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    const newBook = {
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        finished, 
        reading, 
        insertedAt, 
        updatedAt
    };

    bookshelf.push(newBook);

    const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
    }
    const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
    });
    response.code(400);
    return response;
};

const getAllBookHandler = (request, h) => {
    const {
        name, reading, finished
    } = request.query;
    
    if(!name && !reading && !finished) {
        const response = h.response({
            status: 'success',
            data: {
                books: bookshelf.map((book) => ({
                    id: book.id, 
                    name: book.name, 
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    
    let bookFilter = bookshelf;

    if (name) {
        bookFilter = bookFilter.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        const isReading = reading === '1';
        bookFilter = bookFilter.filter(book => book.reading === isReading);
    }

    if (finished !== undefined) {
        const isFinished = finished === '1';
        bookFilter = bookFilter.filter(book => book.finished === isFinished);
    }
    
    const response = h.response({
        status: 'success',
        data: {
            books: bookFilter.map((book) => ({
                id: book.id, name: book.name, publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = bookshelf.filter((n) => n.id === bookId)[0];
    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }
     
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
 
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;
    const index = bookshelf.findIndex((book) => book.id === bookId);

    if (index === -1) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
    }

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    }

    bookshelf[index] = {
        ...bookshelf[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString()
    };

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
};

const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
 
    const index = bookshelf.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        bookshelf.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
     
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = { 
    addBookHandler, 
    getAllBookHandler, 
    getBookByIdHandler, 
    updateBookByIdHandler,
    deleteBookByIdHandler
};