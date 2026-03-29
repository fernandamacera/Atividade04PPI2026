import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0'; 
const porta = 3000; 

const app = express();
var listaProdutos = [];

// Configuração da Sessão
app.use(session({
    secret: 'M1nh4Ch4v3S3cr3t4',
    resave: true, 
    saveUninitialized: true, 
    cookie: {
        secure: false, 
        httpOnly: true, 
        maxAge: 1000 * 60 * 15 // 15 minutos
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// Middleware de Autenticação
function estaAutenticado(requisicao, resposta, proximo) {
    if (requisicao.session?.logado){
        proximo();
    } else {
        // Redireciona com um parâmetro indicando que faltou autenticação
        resposta.redirect("/login?erro=autenticacao");
    }
}

// Rota Raiz (redireciona para o menu)
app.get('/', (req, res) => {
    res.redirect('/menu');
});

// Rota Menu do Sistema
app.get('/menu', estaAutenticado, (req, res) => {
    res.write(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Menu do Sistema</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/menu">Menu</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/produto">Produto</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="/listaProdutos">Listar Produtos</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="/logout">Logout</a>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
            <div class="container mt-5">
                <h2>Bem-vindo ao Sistema de Cadastro de Produtos</h2>
                <p>Utilize o menu superior para navegar.</p>
            </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
        </html>
    `);
    res.end();
});

// Formulário de Cadastro de Produto (GET)
app.get("/produto", estaAutenticado, (requisicao, resposta) => {
    resposta.write(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Produto</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">
                    <form method="POST" action="/produto" class="row gy-2 gx-3 align-items-center border p-3">
                        <legend><h3>Cadastro de Produtos</h3></legend>

                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="codigoBarras">Código de Barras</label>
                            <input type="text" class="form-control" id="codigoBarras" name="codigoBarras">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label" for="descricao">Descrição do Produto</label>
                            <input type="text" class="form-control" id="descricao" name="descricao">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="precoCusto">Preço de Custo (R$)</label>
                            <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="precoVenda">Preço de Venda (R$)</label>
                            <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="validade">Data de Validade</label>
                            <input type="date" class="form-control" id="validade" name="validade">
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label" for="estoque">Qtd em Estoque</label>
                            <input type="number" class="form-control" id="estoque" name="estoque">
                        </div>
                        <div class="col-md-12 mb-3">
                            <label class="form-label" for="fabricante">Nome do Fabricante</label>
                            <input type="text" class="form-control" id="fabricante" name="fabricante">
                        </div>
                        
                        <div class="col-12 mt-3">
                            <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                            <a href="/menu" class="btn btn-secondary">Voltar ao Menu</a>
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
        </html>
    `);
    resposta.end();
});

// Processar Cadastro de Produto (POST)
app.post("/produto", estaAutenticado, (requisicao, resposta) => {
    const { codigoBarras, descricao, precoCusto, precoVenda, validade, estoque, fabricante } = requisicao.body;

    if (!codigoBarras || !descricao || !precoCusto || !precoVenda || !validade || !estoque || !fabricante) {
        let html = `
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Cadastro de Produto</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">
                    <form method="POST" action="/produto" class="row gy-2 gx-3 align-items-center border p-3">
                        <legend><h3>Cadastro de Produtos</h3></legend>
                        <div class="alert alert-warning" role="alert">
                            Por favor, preencha todos os campos obrigatórios abaixo!
                        </div>

                        <div class="col-md-6 mb-3">
                            <label class="form-label">Código de Barras</label>
                            <input type="text" class="form-control" name="codigoBarras" value="${codigoBarras || ''}">
                            ${!codigoBarras ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Descrição</label>
                            <input type="text" class="form-control" name="descricao" value="${descricao || ''}">
                            ${!descricao ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Preço de Custo</label>
                            <input type="number" step="0.01" class="form-control" name="precoCusto" value="${precoCusto || ''}">
                            ${!precoCusto ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Preço de Venda</label>
                            <input type="number" step="0.01" class="form-control" name="precoVenda" value="${precoVenda || ''}">
                            ${!precoVenda ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Validade</label>
                            <input type="date" class="form-control" name="validade" value="${validade || ''}">
                            ${!validade ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        <div class="col-md-3 mb-3">
                            <label class="form-label">Estoque</label>
                            <input type="number" class="form-control" name="estoque" value="${estoque || ''}">
                            ${!estoque ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        <div class="col-md-12 mb-3">
                            <label class="form-label">Fabricante</label>
                            <input type="text" class="form-control" name="fabricante" value="${fabricante || ''}">
                            ${!fabricante ? '<span class="text-danger">Campo obrigatório</span>' : ''}
                        </div>
                        
                        <div class="col-12 mt-3">
                            <button type="submit" class="btn btn-primary">Cadastrar Produto</button>
                            <a href="/menu" class="btn btn-secondary">Voltar ao Menu</a>
                        </div>
                    </form>
                </div>
            </body>
        </html>`;
        resposta.write(html);
        resposta.end();
    } else {
        listaProdutos.push({ codigoBarras, descricao, precoCusto, precoVenda, validade, estoque, fabricante });
        resposta.redirect("/listaProdutos");
    }
});

// Tabela de Produtos (Exibe Cookie de Último Acesso)
app.get("/listaProdutos", estaAutenticado, (requisicao, resposta) => {
    const ultimoAcesso = requisicao.cookies?.ultimoAcesso || "Primeiro acesso";

    resposta.write(`
        <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <title>Tabela de Produtos</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-5">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2>Produtos Cadastrados</h2>
                        <span class="badge text-bg-info fs-6">Último acesso: ${ultimoAcesso}</span>
                    </div>
                    
                    <table class="table table-striped table-hover border">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Cód. Barras</th>
                                <th scope="col">Descrição</th>
                                <th scope="col">Custo</th>
                                <th scope="col">Venda</th>
                                <th scope="col">Validade</th>
                                <th scope="col">Estoque</th>
                                <th scope="col">Fabricante</th>
                            </tr>
                        </thead>
                        <tbody>
    `);
    
    for(let i = 0; i < listaProdutos.length; i++) {
        const p = listaProdutos[i];
        resposta.write(`
            <tr>
                <td>${i+1}</td>
                <td>${p.codigoBarras}</td>
                <td>${p.descricao}</td>
                <td>R$ ${p.precoCusto}</td>
                <td>R$ ${p.precoVenda}</td>
                <td>${p.validade}</td>
                <td>${p.estoque}</td>
                <td>${p.fabricante}</td>
            </tr>
        `);
    }
    
    resposta.write(`
                        </tbody>
                    </table>
                    <a href="/produto" class="btn btn-primary">Cadastrar Novo Produto</a>
                    <a href="/menu" class="btn btn-secondary">Voltar ao Menu</a>
                </div>
            </body>
        </html>
    `);
    resposta.end();
});

// Tela de Login
app.get("/login", (requisicao, resposta) => {
    
    // Captura o erro da URL (se existir)
    const erro = requisicao.query.erro;
    let alertaHtml = "";

    // Define qual mensagem exibir dependendo do erro
    if (erro === "autenticacao") {
        alertaHtml = `<div class="alert alert-warning text-center" role="alert">Você precisa realizar o login para acessar o sistema!</div>`;
    } else if (erro === "invalido") {
        alertaHtml = `<div class="alert alert-danger text-center" role="alert">Email ou senha inválidos! Tente novamente.</div>`;
    }

    resposta.write(`
        <!DOCTYPE html>
        <html lang="pt-br" data-bs-theme="auto"> 
            <head>
                <meta charset="utf-8">
                <title>Página de Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
            </head> 
            <body class="d-flex align-items-center py-4 bg-body-tertiary" style="height: 100vh;">
                <div class="container w-25 border p-4 bg-white rounded shadow-sm">
                    <main class="form-signin w-100 m-auto"> 
                        <form action="/login" method="POST"> 
                            <h1 class="h4 mb-4 fw-normal text-center">Login no Sistema</h1> 
                            
                            ${alertaHtml}
                            
                            <div class="form-floating mb-3"> 
                                <input type="email" class="form-control" id="email" name="email" placeholder="nome@example.com" required> 
                                <label for="email">Email</label> 
                            </div> 
                            <div class="form-floating mb-3"> 
                                <input type="password" class="form-control" id="senha" name="senha" placeholder="Password" required> 
                                <label for="senha">Senha</label> 
                            </div> 
                            
                            <button class="btn btn-primary w-100 py-2" type="submit">Entrar</button> 
                        </form> 
                    </main>   
                </div>
            </body> 
        </html>
    `);
    resposta.end();
});

// Processar Login
app.post("/login",(requisicao, resposta) =>{
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;

    if (email == "admin@teste.com.br" && senha == "admin") {
        requisicao.session.logado = true;
        
        const dataUltimoAcesso = new Date();
        resposta.cookie("ultimoAcesso", dataUltimoAcesso.toLocaleString('pt-BR'), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        
        resposta.redirect("/menu");
    } else {
        // Redireciona de volta para o login passando o erro na URL
        resposta.redirect("/login?erro=invalido");
    }
});

// Logout
app.get("/logout", (requisicao, resposta) => {
    requisicao.session.destroy();
    resposta.clearCookie('ultimoAcesso'); // Limpa o cookie opcionalmente ao sair
    resposta.redirect("/login");    
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});