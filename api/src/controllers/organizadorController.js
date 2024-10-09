const connect = require('../db/connect');
let orgIndex = 1;

module.exports = class organizadorController {
  static async createOrganizador(req, res) {
    const { name, email, password, telefone} = req.body;

    if (!telefone || !email || !password || !name) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
          error: "Telelfone inválido. Deve conter exatamente 11 dígitos numéricos",
        });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo email
    const query = `INSERT INTO organizador (telefone, password, email, nome) VALUES(
      '${telefone}',
      '${password}',
      '${email}',
      '${name}')`;

    //executando a query criada
    try{
      connect.query(query, function(err){
        if(err){
          console.log(err);
          console.log(err.code);
          if(err.code  === 'ER_DUP_ENTRY'){
            return res.status(400).json({error: 'O email já está vinculado a outro usuário'});
          }
          else{
            return res.status(500).json({error: 'Erro interno do servidor'});
          }
        }
        else{
          return res.status(201).json({message: 'Usuário criado com sucesso'});
        }
      });
    }
    catch(error){
      console.error(err);
      return res.status(500).json({error: 'Erro interno do servidor'});
    }
  }

  static async getAllOrganizadores(req, res) {
    return res.status(200).json({ message: "Obtendo todos os usuários" });
  }

  static async updateOrg(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { nome, email, password, telefone, id} = req.body;
    //Verificar se todos os campos foram preenchidos
    if (!id || !telefone || !email || !password || !nome) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    //Procurar o indice do usuario no array 'organizadores' pelo email
    const orgIndex = organizadores.findIndex((organizador) => organizador.id === id);
    //se o usuario não for encontrado userIndex equivale a -1
    if (orgIndex == -1) {
      return res.status(400).json({ error: "Usuário de organizador não encontrado" });
    }

    //Atualixa os dados do usuário no Array 'organizadores'
    organizadores[orgIndex] = {telefone, email, password, nome, id};
    return res
      .status(200)
      .json({ message: "Organizador atualizado", org: organizadores[orgIndex] });
  }

  static async deleteOrg(req, res) {
    //Obtem o parametro 'Id' da requisição, que é o cpf a ser deletado
    const id = req.params.id;

    //Procurar o indice do usuario no array 'organizadores' pelo email
    const orgIndex = organizadores.findIndex((organizador) => organizador.id == id);
    //se o usuario não for encontrado userIndex equivale a -1
    if (orgIndex == -1) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }
    //Removendo o usuário do Array 'users'
    organizadores.splice(orgIndex, 1);
    return res.status(200).json({ message: "Usuário Deletado" });
  }
};
