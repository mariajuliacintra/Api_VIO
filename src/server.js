//Importa a instância do Express configurada em index.js
const app = require("./index");
const cors = require('cors');

//Configuração do CORS com origens permitidas
const corsOptions = {
    origin: '*',//Substitua pela origem permitida
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', //Métodos http oermitidos 
    Credentials: true, //Permite o uso de cookies e credenciais 
    optionsSuccessStatus: 204, //Define o status de resposta para o método options
};

//Aplicando o método CORS no app
app.use(cors(corsOptions));
//Inicia o servidor na porta 5000, tornando a API acessível em http://localhost:5000
app.listen(5000);
