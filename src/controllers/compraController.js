const connect = require("../db/connect");

module.exports = class compraController {
  static registrarCompraSimples(req, res) {
    const { id_usuario, id_ingresso, quantidade } = req.body;

    console.log("Body: ", id_usuario, id_ingresso, quantidade);

    if (!id_usuario || !id_ingresso || !quantidade) {
      return res
        .status(400)
        .json({ error: "dados obrigatórios não enviados!" });
    }

    //chamada da procedure diretamente com os parametros
    connect.query(
      "CALL registrar_compra(?, ?, ?);",
      [id_usuario, id_ingresso, quantidade],
      (err, results) => {
        if (err) {
          console.log("Erro ao registrar compra", err.message);
          return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({
          message: "Compra Registrada com sucesso vio PROCEDURE",
          dados: { id_usuario, id_ingresso, quantidade },
        });
      }
    ); //fim da query
  }

  static registrarCompra(req, res) {
    const { id_usuario, ingressos } = req.body;

    console.log("Body: ", id_usuario, ingressos);

    connect.query(
      "INSERT INTO compra (data_compra, fk_id_usuario) values (now(), ?);", [
        id_usuario
      ],
      (err, result) => {
        if (err) {
          //Em caso de erro na inserção da compra, retorna erro 500!
          console.log("Erro ao inserir compra: ", err);
          return res
            .status(500)
            .json({ error: "erro ao Criar a compra no sistema" });
        }
        //Recupera o id da compra recém criada
        const id_compra = result.insertId;
        console.log("Compra criada com o ID: ", id_compra);

        let index = 0; //inicializa o índex dos ingressos a serem processados

        //Função recursiva para processar cada ingresso sequencialmente
        function procerssarIngressos() {
          if (index >= ingressos.length) {
            return res.status(201).json({
              message: "Compra Realizada com SUCESSO!",
              id_compra,
              ingressos,
            });
          }

          //Obter o ingresso atual com base no índex
          const ingresso = ingressos[index];

          //Chamada da procedure para registrar as compras
          connect.query(
            "CALL registrar_compra2 (?, ?, ?);",
            [ingresso.id_ingresso, id_compra, ingresso.quantidade],
            (err) => {
              if (err) {
                return res
                  .status(500)
                  .json({
                    error: `Erro ao registrar ingresso ${index + 1}`,
                    detalhes: err.message,
                  });
              }
              index++;
              procerssarIngressos();
            }
          ); //fim da query
        } //fim da function
        procerssarIngressos();
      }
    ); //fim da query
  }
};
