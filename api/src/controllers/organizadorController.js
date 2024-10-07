let organizadores = [];
let orgIndex = 1;

module.exports = class organizadorController {
  static async createOrganizador(req, res) {
    const { nome, email, password, telefone} = req.body;

    if (!telefone || !email || !password || !nome) {
      return res.status(400).json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
          error: "Telelfone inválido. Deve conter exatamente 11 dígitos numéricos",
        });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo email
    const existingOrg = organizadores.find((org) => org.email === email);
    if (existingOrg) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Cria e adiciona novo usuário de organizador
    const newOrganizador = { id: orgIndex++, nome, email, password, telefone};
    organizadores.push(newOrganizador);
    return res
      .status(201)
      .json({ message: "Usuario de organizador criado com sucesso"
    });
  }

  static async getAllOrganizadores(req, res) {
    return res
      .status(200)
      .json({ message: "Obtendo todos os organizadores", organizadores, orgIndex});
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
