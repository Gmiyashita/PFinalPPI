import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();

app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'pages/public')));

const porta = 3000;
const host = '0.0.0.0'; 

var listaUsuarios = []; 
var msg = {};

function cadastroUsuView(req, resp) {
    resp.send(`
        <html>
            <head>
                <title>Cadastro de Usuários</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container text-center">
                    <h1 class="mb-5">Cadastro de Usuários</h1>
                    <form method="POST" action="/cadastrarUsuario" class="border p-3 row g-3" novalidate>
                        <div class="col-md-4">
                            <label for="nome" class="form-label">Nome</label>
                            <input type="text" class="form-control" id="nome" name="nome" required>
                        </div>
                        <div class="col-md-4">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="col-md-4">
                            <label for="nickname" class="form-label">Nickname</label>
                            <input type="text" class="form-control" id="nickname" name="nickname" required>
                        </div>
                        <div class="col-12">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                        </div>
                    </form>
                </div>
            </body>
        </html>
    `);
}

function menuView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'] || '';

    resp.send(`
        <html>
            <head>
                <title>Menu</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="#">MENU</a>
                        <div class="collapse navbar-collapse">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item"><a class="nav-link" href="/cadastrarUsuario">Cadastrar Usuário</a></li>
                                <li class="nav-item"><a class="nav-link" href="/listaUsuario"> Lista de Usuários</a></li>
                                <li class="nav-item"><a class="nav-link" href="/batePapo">Bate Papo</a></li>
                                <li class="nav-item"><a class="nav-link" href="/logout">Sair</a></li>
                            </ul>
                            <span class="navbar-text">Último acesso: ${dataHoraUltimoLogin}</span>
                        </div>
                    </div>
                </nav>
            </body>
        </html>
    `);
}

function cadastrarUsuario(req, resp) {
    const { nome, email, nickname } = req.body;

    if (nome && email && nickname) {
        const usuario = { nome, email, nickname };
        listaUsuarios.push(usuario);

        resp.send(`
            <html>
                <head>
                    <title>Lista de Usuários</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h1>Lista de Usuários</h1>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Nickname</th>
                                    <th>Bate-Papo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${listaUsuarios.map(usu => `
                                    <tr>
                                        <td>${usu.nome}</td>
                                        <td>${usu.email}</td>
                                        <td>${usu.nickname}</td>
                                        <td><a href="/batePapo?nome=${usu.nome}" class="btn btn-primary">Bate-Papo</a></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <a href="/" class="btn btn-primary"> Voltar ao Menu</a>
                        <a href="/cadastrarUsuario" class="btn btn-secondary">Cadastrar Novo Usuário</a>
                        
                    </div>
                </body>
            </html>
        `);
    } else{resp.write(`
        <html>
                <head>
                    <title>Cadastro de Usuarios</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container text-center">
                        <h1 class="mb-5">Cadastro de Usuarios</h1>
                        <form method="POST" action="/cadastrarUsuario" class="border p-3 row g-3" novalidate>
                            <div class="col-md-4">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome">`);
        if(!nome){
            resp.write(`
                            <div>
                            <p class="text-danger">Insira um nome.<p>
                            </div>`);}
        resp.write(`
                             </div>
                             <div class="col-md-4">
                                <label for="email" class="form-label">E-mail</label>
                                <input type="text" class="form-control" id="email" name="email">`);
    
        if(!email){
            resp.write(`    
                            <div>
                                <p class="text-danger">Insira o Email.<p>
                            </div>`);}
        resp.write(`     </div>
                            <div class="col-md-4">
                                <label for="nickname" class="form-label">Nickname</label>
                                <input type="text" class="form-control" id="nickname" name="nickname">
                                `);
        if(!nickname){
            resp.write(`        <div><p class="text-danger">Insira um Nickname.<p></div>
                                </div>
                                </div>`);}
        resp.write(`                    
                             <div class="col-12">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
                            </div>
                            </form>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
        `);
    }
    resp.end();
}

function listaUsuario(req,resp){
        resp.send(`
            <html>
                <head>
                    <title>Lista de Usuários</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h1>Lista de Usuários</h1>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>E-mail</th>
                                    <th>Nickname</th>
                                    <th>Bate-Papo</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${listaUsuarios.map(usu => `
                                    <tr>
                                        <td>${usu.nome}</td>
                                        <td>${usu.email}</td>
                                        <td>${usu.nickname}</td>
                                        <td><a href="/batePapo?nome=${usu.nome}" class="btn btn-primary">Bate-Papo</a></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <a href="/" class="btn btn-secondary">Voltar ao Menu</a>
                    </div>
                </body>
            </html>
        `);
    

}

function batePapo(req, resp) {
    const nome = req.query.nome;
    const usuario = listaUsuarios.find(usu => usu.nome === nome);

    if (!usuario) {
        return resp.send(`
            <html>
            <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
                <body>
                    <h1 class="mb-5">Usuário não encontrado!</h1>
                    <a href="/" class="btn btn-secondary mt-3">Voltar ao Menu</a>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
        `);
    }

    const mensagens = msg[nome] || [];
    resp.send(`
        <html>
            <head>
                <title>Bate Papo - ${nome}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <h1>Bate-Papo com ${nome}</h1>
                    <ul class="list-group">
                        ${mensagens.map(m => `<li class="list-group-item">${m}</li>`).join('')}
                    </ul>
                    <form method="POST" action="/batePapo">
                        <input type="hidden" name="nome" value="${nome}">
                        <div class="mb-3">
                            <input type="text" class="form-control" name="corpomsg" placeholder="Digite sua mensagem" required>
                        </div>
                        <button class="btn btn-primary" type="submit">Enviar</button>
                    </form>
                    <a href="/" class="btn btn-secondary mt-3">Voltar ao Menu</a>
                </div>
            </body>
        </html>
    `);
}

function batePapoPost(req, resp) {
    const { nome, corpomsg } = req.body;

    if (!msg[nome]) {
        msg[nome] = [];
    }

    msg[nome].push(corpomsg);
    resp.redirect(`/batePapo?nome=${nome}`);
}

function autenticarUsuario(req, resp) {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });
        resp.redirect('/');
    } else {
        resp.status(401).send('Usuário ou senha inválidos!');
    }
}

function verificarAutenticacao(req, resp, next) {
    if (req.session.usuarioLogado) {
        next();
    } else {
        resp.redirect('/login');
    }
}

app.get('/login', (req, resp) => resp.redirect('/login.html'));
app.post('/login', autenticarUsuario);
app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});
app.get('/', verificarAutenticacao, menuView);
app.get('/cadastrarUsuario', verificarAutenticacao, cadastroUsuView);
app.post('/cadastrarUsuario', verificarAutenticacao, cadastrarUsuario);
app.get('/listaUsuario', verificarAutenticacao, listaUsuario);
app.get('/batePapo', verificarAutenticacao, batePapo);
app.post('/batePapo', verificarAutenticacao, batePapoPost);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado em http://${host}:${porta}`);
});
