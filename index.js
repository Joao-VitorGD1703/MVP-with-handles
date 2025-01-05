const express = require('express');
const {
    engine
} = require('express-handlebars'); // Usando a nova API do express-handlebars
const pool = require('./db/conn')
const app = express();

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())


// Configuração do Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views'); // Diretório onde estão os templates

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.render('home');
});

app.post('/books/insertbook', (req, res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`
    const data = ['title', 'pageqty', title, pageqty]

    pool.query(sql, data, (err) => {
        if (err) {
            console.error(err.message)
            process.exit(1);
        }

        res.redirect('/')

    });
});


app.get('/books', (req, res) => {
    const sql = `SELECT * FROM books`

    pool.query(sql, (err, data) => {
        if (err) {
            console.error(err.message)
            process.exit(1);
        }

        const books = data
        res.render('books', {
            books
        })

    });

})


app.get('/books/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, (err, data) => {
        if (err) {
            console.error(err.message)
            return
        }
        const book = data[0]

        res.render('book', {book })

    })
})

app.get('/books/edit/:id', (req, res)=>{

    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data =['id', id]

    pool.query(sql, data, (err, data) => {
        if (err) {
            console.error(err.message)
            return
        }
        const book = data[0]

        res.render('editbook', {book })

    })

})

app.post('/books/updatebook', (req, res)=>{

    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pageqty, 'id', id ]

    pool.query(sql, data, (err) => {
        if (err) {
            console.error(err.message)
            return
        }

        res.redirect('/books')

    })

})


app.post('/books/remove/:id', (req, res)=>{

    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]


    pool.query(sql, data, (err) => {
        if (err) {
            console.error(err.message)
            return
        }

        res.redirect('/books')

    })

})

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});