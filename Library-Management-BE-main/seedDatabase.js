import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const seedData = async () => {
  await mongoose.connect(process.env.DB_URL)
  console.log('📦 Connected to MongoDB')

  // Models
  const Category = mongoose.model('Category', new mongoose.Schema({ name: String }))
  const Author = mongoose.model('Author', new mongoose.Schema({
    firstName: String,
    lastName: String,
    books: [mongoose.Schema.Types.ObjectId],
    image: String
  }))
  const Book = mongoose.model('Book', new mongoose.Schema({
    ISBN: String,
    title: String,
    edition: String,
    category: mongoose.Schema.Types.ObjectId,
    description: String,
    publisher: String,
    img: String,
    author: [mongoose.Schema.Types.ObjectId]
  }))
  const CopiesBook = mongoose.model('CopiesBook', new mongoose.Schema({
    book_id: mongoose.Schema.Types.ObjectId,
    is_Available: Boolean
  }))

  // 1. Thêm Categories
  console.log('📚 Adding categories...')
  const categories = await Category.insertMany([
    { name: "Fiction" },
    { name: "Non-Fiction" },
    { name: "Science" },
    { name: "Technology" },
    { name: "History" }
  ])
  console.log(`✅ Added ${categories.length} categories`)

  // 2. Thêm Authors
  console.log('✍️ Adding authors...')
  const authors = await Author.insertMany([
    { firstName: "George", lastName: "Orwell", books: [], image: "https://placehold.co/400" },
    { firstName: "J.K.", lastName: "Rowling", books: [], image: "https://placehold.co/400" },
    { firstName: "Stephen", lastName: "King", books: [], image: "https://placehold.co/400" },
    { firstName: "Agatha", lastName: "Christie", books: [], image: "https://placehold.co/400" }
  ])
  console.log(`✅ Added ${authors.length} authors`)

  // 3. Thêm Books
  console.log('📖 Adding books...')
  const books = await Book.insertMany([
    {
      ISBN: "9780451524935",
      title: "1984",
      edition: "1st",
      category: categories[0]._id, // Fiction
      description: "A dystopian novel",
      publisher: "Secker & Warburg",
      img: "https://placehold.co/600x400",
      author: [authors[0]._id] // George Orwell
    },
    {
      ISBN: "9780140328721",
      title: "Animal Farm",
      edition: "1st",
      category: categories[0]._id,
      description: "A satirical allegorical novella",
      publisher: "Secker & Warburg",
      img: "https://placehold.co/600x400",
      author: [authors[0]._id]
    },
    {
      ISBN: "9780439708180",
      title: "Harry Potter and the Sorcerer's Stone",
      edition: "1st",
      category: categories[0]._id,
      description: "A young wizard's journey",
      publisher: "Scholastic",
      img: "https://placehold.co/600x400",
      author: [authors[1]._id] // J.K. Rowling
    }
  ])
  console.log(`✅ Added ${books.length} books`)

  // 4. Thêm Book Copies (mỗi sách 3 copies)
  console.log('📋 Adding book copies...')
  const copies = []
  for (const book of books) {
    for (let i = 0; i < 3; i++) {
      copies.push({
        book_id: book._id,
        is_Available: true
      })
    }
  }
  await CopiesBook.insertMany(copies)
  console.log(`✅ Added ${copies.length} book copies`)

  console.log('🎉 Database seeded successfully!')
  await mongoose.disconnect()
}

seedData().catch(console.error)