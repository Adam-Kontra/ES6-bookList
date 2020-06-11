class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  
  // addBookToList Method
  addBookToList(book) {
    const table = document.getElementById('book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>`

    table.appendChild(row);
  }



  // showAlert Method
  showAlert(message, className) {
    
    // Create Div
    const div = document.createElement('div');
    // Add Classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get a Parent
    const container = document.querySelector('.container');
    // Get a  Form
    const form = document.querySelector('#book-form');
    // Insert div
    container.insertBefore(div, form);
    // Timeout
    setTimeout(function(){
      document.querySelector('.alert').remove();
    }, 3000);
  }

  // deleteBook Method
  deleteBook(target) {

    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();

      const ui = new UI;
      ui.showAlert('Book has been removed', 'error');

    }
  }
  
  // clearFields Method
  clearFields() {

    document.getElementById('title').value ='';
    document.getElementById('author').value ='';
    document.getElementById('ISBN').value ='';
  }
}

// Local Storage Class
class Storage {
  
  // Local Storage Methods

  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Storage.getBooks();


    books.forEach(function(book){
      const ui = new UI;

      ui.addBookToList(book);
    });
  }

  static saveBooksToLocalStorage(book) {
    const books = Storage.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Storage.getBooks();

    books.forEach(function(book, index){
      if(book.isbn === isbn) {
        books.splice(index, 1);
      }
    })

    localStorage.setItem('books', JSON.stringify(books));
  }
}

// DOM Event Listener, Load event
document.addEventListener('DOMContentLoaded', Storage.displayBooks);


// Add event listener for addBook
document.getElementById('book-form').addEventListener('submit', 
function(e){
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('ISBN').value;

  // Instantiate book
  const book = new Book(title, author, isbn);
  
  // Instantiate ui
  const ui = new UI();

  // Validate
  if(title === '' || author === '' || isbn === ''){
    ui.showAlert('Please fulfill all fields', 'error')
  } else {
    // Add Book To List
    ui.addBookToList(book);

    // Save to Local Storage
    Storage.saveBooksToLocalStorage(book);

    // Success
    ui.showAlert('Book added to the list', 'success');

    // Clear Fields
    ui.clearFields();
  }

  e.preventDefault();
})

// Add event listener for deleteBook
document.getElementById('book-list').addEventListener('click', function(e){
  
   // Instantiate ui
   const ui = new UI();

   ui.deleteBook(e.target); 
   
  // Remove from Local Storage
  Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);

  e.preventDefault();
})