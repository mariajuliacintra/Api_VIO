const connect = require("../db/connect");

module.exports = class organizadorController {
  static async createOrganizador(req, res) {
    const { name, email, senha, telefone } = req.body;

    if (!telefone || !email || !senha || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
        error:
          "Telelfone inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo email
    const query = `INSERT INTO organizador (telefone, senha, email, nome) VALUES(
      '${telefone}',
      '${senha}',
      '${email}',
      '${name}')`;

    //executando a query criada
    try {
      connect.query(query, function (err) {
        if (err) {
          console.log(err);
          console.log(err.code);
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "O email já está vinculado a outro usuário" });
          } else {
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        } else {
          return res
            .status(201)
            .json({ message: "Organizador criado com sucesso" });
        }
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllOrganizadores(req, res) {
    const query = `SELECT * FROM organizador`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de organizadores", orgs: results });
      });
    } catch (error) {
      console.error("Erroa o executar consulta", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateOrg(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { nome, email, senha, telefone, id } = req.body;
    //Verificar se todos os campos foram preenchidos
    if (!id || !telefone || !email || !senha || !nome) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE organizador SET nome=?, email=?, senha=?, telefone=? WHERE id_organizador = ?`;
    const values = [nome, email, senha, telefone, id];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro organizador" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows == 0) {
          return res.status(404).json({ error: "Organizador não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Organizador foi atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async deleteOrg(req, res) {
    const organizadorId = req.params.id;
    const query =`DELETE FROM organizador WHERE id_organizador=?`;
    const values = [organizadorId];

    try{
      connect.query(query, values, function(err, results){
        if(err){
          console.error(err);
          return res.status(500).json({error: "Erro interno do servidor"});
        }
        if(results.affectedRows === 0){
          return res.status(404).json({error: "Organizador não encontrado"})
        }
        return res.status(200).json({message: "Organizador excluido com sucesso!"})
      })
    }
    catch(error){
      console.error(error);
      return res.status(500).json({error: "Erro interno no servidor"});
    }
  }
};
