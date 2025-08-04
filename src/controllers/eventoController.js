const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de um evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;
    const imagem = req.file?.buffer || null;

    //validação genérica de todos atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = ` INSERT INTO evento(nome, descricao, data_hora, local, fk_id_organizador, imagem) VALUES(?,?,?,?,?,?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador, imagem];

    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar evento" });
        }
        return res.status(201).json({ message: "Evento criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      res.status(500).json({ error: "Erro imterno no servidor!" });
    }
  } //Fim do createEvento
  //visualizar todos os eventos
  static async getAllEventos(req, res) {
    const query = `SELECT * FROM evento`;
    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        return res
          .status(200)
          .json({ message: "Eventos listados com sucesso", events: results });
      });
    } catch (error) {
      console.log("Erro ao executar a query", error);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  //Update de um evento
  static async updateEvento(req, res) {
    const { id_evento, nome, descricao, data_hora, local, fk_id_organizador } =
      req.body;

    //validação genérica de todos atributos
    if (
      !id_evento ||
      !nome ||
      !descricao ||
      !data_hora ||
      !local ||
      !fk_id_organizador
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }

    const query = ` UPDATE evento SET nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? where id_evento=?`;
    const values = [
      nome,
      descricao,
      data_hora,
      local,
      fk_id_organizador,
      id_evento,
    ];

    try {
      connect.query(query, values, (err, results) => {
        // console.log("resultados: ", results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o evento" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "evento não encontrado!" });
        }
        return res
          .status(200)
          .json({ message: "Evento atualizado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      res.status(500).json({ error: "Erro imterno no servidor!" });
    }
  } //fim do update

  static async deleteEvento(req, res) {
    const idEvento = req.params.id;

    const query = `DELETE from evento where id_evento = ?`;

    try {
      connect.query(query, idEvento, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir o evento" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Evento excluído com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta!", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }

  static async getEventosPorData(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        //evento posição 1
        const dataEventop1 = new Date(results[0].data_hora);
        const diap1 = dataEventop1.getDate();
        const mesp1 = dataEventop1.getMonth()+1;//tipo um array de meses acrecentando mais um para ficar "certo"
        const anop1 = dataEventop1.getFullYear();
        console.log(diap1 + "/" + mesp1 + "/" + anop1);

        //evento posição 2
        const dataEventop2 = new Date(results[1].data_hora);
        const diap2 = dataEventop2.getDate();
        const mesp2 = dataEventop2.getMonth()+1;//tipo um array de meses acrecentando mais um para ficar "certo"
        const anop2 = dataEventop2.getFullYear();
        console.log(diap2 + "/" + mesp2 + "/" + anop2);

        // evento posição 3
        const dataEventop3 = new Date(results[2].data_hora);
        const diap3 = dataEventop3.getDate();
        const mesp3 = dataEventop3.getMonth()+1;//tipo um array de meses acrecentando mais um para ficar "certo"
        const anop3 = dataEventop3.getFullYear();
        console.log(diap3 + "/" + mesp3 + "/" + anop3);

        const now = new Date();
        const eventosPassados = results.filter(
          (evento) => new Date(evento.data_hora) < now
        );
        const eventosFuturos = results.filter(
          (evento) => new Date(evento.data_hora) >= now
        );

        const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs/(1000*60*60*24));//transformando para dias
        const horas = Math.floor(diferencaMs%(1000*60*60*24)/(1000*60*60))// e o resto para horas
        const minutos = Math.floor(diferencaMs%(1000*60*60*24)%(1000*60*60)/(1000*60))
        const segundos = Math.floor(diferencaMs%(1000*60*60*24)%(1000*60*60)%(1000*60)/1000)
        console.log(diferencaMs,"falta: ", dias, "dias,", horas, "horas,", minutos, "minutos,", segundos, "segundos");

        //comparando datas
        const dataFiltro = new Date('2024-12-15').toISOString().split("T");
        const eventoDia = results.filter(evento => new Date(evento.data_hora).toISOString().split("T")[0] === dataFiltro[0]);


        console.log("eventos dia: ", eventoDia)
        return res
          .status(200)
          .json({ message: "ok", eventosFuturos, eventosPassados });
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar eventos" });
    } 
  }

  static async getEventosSeteDias (req, res){
    const query = `SELECT * FROM evento`;
    const dataEvento = req.params.data;

    try{
        connect.query(query, (err, results)=>{
            const dataFiltro = new Date(dataEvento).toISOString().split("T");
            const diasFuturos = [];
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Erro ao buscar eventos" });
            }
            for(let i = 1; i <= 7; i++){
                const novaData = dataFiltro.getDate() + i;
                diasFuturos.push(novaData.toISOString().split('T')[0]);
            }
            res.status(200).json({message: "Os proximos eventos nos proximos 7 dias são:" + diasFuturos})
        })
    } 
    catch(error){

    }
  }

  static async getImagemEvento(req, res){
    const id = req.param.id;

    const query = "SELECT imagem FROM evento WHERE id_evento;"
    connect.query(query,[id], (err, results)=> {
      if(err || results.length === 0 || !results[0].imagem){
        return res.status(404).send("Imagem não foi encontrada")
      }
      res.set("Content-Type", "image/png");
      return res.send(results[0].imagem);
    })
  }
};
