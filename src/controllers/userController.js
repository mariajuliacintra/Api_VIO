const connect = require("../db/connect");
const validateUser = require("../services/validateUser");
const validateCpf = require("../services/validateCpf");

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name, data_nascimento } = req.body;
    const validation = validateUser(req.body);

    if(validation){
      return res.status(400).json(validation)
    }
    const cpfValidation = await validateCpf(cpf, null)
    if (cpfValidation){
      return res.status(400).json(cpfValidation)
    }

    // Construção da  Query INSERT
    const query = `INSERT INTO usuario (cpf, password, email, name, data_nascimento) VALUES(
        '${cpf}',
        '${password}',
        '${email}',
        '${name}',
        '${data_nascimento}')`;

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
            .json({ message: "Usuário criado com sucesso" });
        }
      });
    } catch (error) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM usuario`;
    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Lista de usuários", users: results });
      });
    } catch (error) {
      console.error("Erroa o executar consulta", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { cpf, email, password, name, id } = req.body;
    const validation = validateUser(req.body); 

    if(validation){
      return res.status(400).json(validation)
    }

    const cpfValidation = await validateCpf(cpf, id)
    if (cpfValidation){
      return res.status(400).json(cpfValidation)
    }
   
    const query = `UPDATE usuario SET name=?, email=?, password=?, cpf=? WHERE id_usuario=?`;
    const values = [name, email, password, cpf, id];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuário" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows == 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário foi atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async deleteUser(req, res) {
    const usuarioId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario=?`;
    const values = [usuarioId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuario não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuario excluido com sucesso!" });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e Senha são obrigatórios" });
    }

    const query = `SELECT * FROM usuario where email= ?`;

    try {
      connect.query(query, [email], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        const user = results[0];

        if (user.password !== password) {
          return res.status(403).json({ error: "Senha incorreta" });
        }
        return res.status(200).json({ message: "Login bem sucedido", user });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do sevidor" });
    }
  }
};
