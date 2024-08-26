/* eslint-disable linebreak-style */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable no-trailing-spaces */
/* eslint-disable indent */
/* eslint-disable eol-last */

const { 
  addBookHandler, 
  getAllBookHandler, 
  getBookByIdHandler, 
  updateBookByIdHandler,
  deleteBookByIdHandler
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];
   
module.exports = routes;