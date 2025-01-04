const express = require('express');
const {
    engine
} = require('express-handlebars'); // Usando a nova API do express-handlebars
const mysql = require('mysql2');

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

    const sql = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`

    conn.query(sql, (err) => {
        if (err) {
            console.error(err.message)
            process.exit(1);
        }

        res.redirect('/')

    });
});


app.get('/books', (req, res) => {
    const sql = `SELECT * FROM books`

    conn.query(sql, (err, data) => {
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

    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql, (err, data) => {
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

    const sql = `SELECT * FROM books WHERE id = ${id}`

    conn.query(sql, (err, data) => {
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

    const sql = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

    conn.query(sql, (err) => {
        if (err) {
            console.error(err.message)
            return
        }

        res.redirect('/books')

    })

})


app.post('/books/remove/:id', (req, res)=>{

    const id = req.params.id

    const sql = `DELETE FROM books WHERE id = ${id}`


    conn.query(sql, (err) => {
        if (err) {
            console.error(err.message)
            return
        }

        res.redirect('/books')

    })

})

// Configuração do banco de dados MySQL
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'nodemysql2',
});

// Conexão com o banco de dados
conn.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        process.exit(1); // Finaliza a aplicação em caso de erro
    }

    console.log('Conectado ao MySQL com sucesso!');

    // Inicia o servidor após a conexão bem-sucedida
    app.listen(3000, () => {
        console.log('Servidor rodando em http://localhost:3000');
    });
});