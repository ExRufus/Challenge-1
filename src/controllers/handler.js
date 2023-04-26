const { nanoid } = require('nanoid');
const books = require('../data/books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const finished = "false";
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  };

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

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
};

const getAllBooksHandler = (request, h) => {
  const name = request.query.name;
  const reading = request.query.reading;
  const finished = request.query.finished

  let getBooks = books;

  if (name) {
    getBooks = getBooks.filter((book) => {
      const bookName = book.name.toLowerCase();
      return bookName.includes(name.toLowerCase());
    });
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    getBooks = getBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    getBooks = getBooks.filter((book) => book.finished === isFinished);
  }

  if (getBooks.length > 0) {
    const response = {
      status: 'success',
      data: {
        books: getBooks,
      },
    };
    return h.response(response).code(200);
  } else {
    const response = h.response({
      status: 'success',
      message: 'Belum terdapat buku yang dimasukkan',
      data: {
        books: [],
      },
    });
    return h.response(response).code(200);
  }
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((data) => data.id === bookId);

  if (book) {
    return {
      status: 'success',
      data: [{
        book,
      }],
    };
  }
  console.log(book)

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. mohon isi nama buku'
    });
    response.code(400);
    return response;
  };

  if ( readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  };

  const index = books.findIndex((data) => data.id === bookId );
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
    response.code(200);
    return response;
  }


  const response = h.response({
    status: 'fail',
    message: "Gagal memperbarui buku. Id tidak ditemukan"
  })
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      "message": "Buku berhasil diperbarui"
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    "message": "Buku gagal dihapus. Id tidak ditemukan"
  });
  response.code(404);
  return response;
};

module.exports =  { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };