// Task 2: Basic Quries
// a) Find all books in the "Fiction" genre
db.books.find({ genre: "Fiction" });

// b) Find books published after the year 2015
db.books.find({ published_year: { $gt: 2015 } });

// c) Find books by the author "Paulo Coelho"
db.books.find({ author: "Paulo Coelho" });

// d) Update the price of "The Alchemist" to 12.99
db.books.updateOne({ title: "The Alchemist" }, { $set: { price: 12.99 } });

// e) Delete the book titled "Moby Dick"
db.books.deleteOne({ title: "Moby Dick" });

// Task 3: Advanced Queries
// a) Find books that are in stock and were published after the year 1954
db.books.find({
  in_stock: true,
  published_year: { $gt: 1954 },
});

// b) Use projection to return only the title, author, and price fields for all books
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });

// c) Sort books by price in ascending order
db.books.find().sort({ price: 1 });

// d) Sort books by price in descending order
db.books.find().sort({ price: -1 });

// e) Pagination - 5 books per page

// Page 1
db.books.find().skip(0).limit(5);

// Page 2
db.books.find().skip(5).limit(5);

// Task 4 - Aggregation Query 1:
// Calculate the average price of books grouped by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      average_price: { $avg: "$price" },
    },
  },
]);

// Aggregation Query 2:
// Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      book_count: { $sum: 1 },
    },
  },
  { $sort: { book_count: -1 } },
  { $limit: 1 },
]);

// Aggregation Query 3:
// Group books by publication decade and count how many books are in each decade
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          {
            $toString: {
              $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10],
            },
          },
          "s",
        ],
      },
      count: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);

// Task 5 - Indexing:
// a) Create an index on the title field for faster text-based searches
db.books.createIndex({ title: 1 });

// b) Create a compound index on author (ascending) and published_year (descending)
db.books.createIndex({ author: 1, published_year: -1 });

// c) Use explain() to analyze query performance after indexing on author and published_year
db.books
  .find({ author: "George Orwell", published_year: 1945 })
  .explain("executionStats");
