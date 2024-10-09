//Acessa o objeto "document" que representa a página html
//Seleciona o elemento com o ID indicado do formulário
document
  .getElementById("formulario-registro")

  //Adiciona o ouvinte de evento (submit) para capturar o envio do formulário
  .addEventListener("submit", function (event) {
    //Previne o comportamento padrão do formulário, ou seja, impede que ele seja enviado e recarregue a pagina
    event.preventDefault();

    //Captura os valores dos campos do formulário
    const name = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("senha").value;

    //Requisição HTTP para o endpoint de cadastro de usuário
    fetch("http://localhost:5000/api/v1/user", {
      //Realiza uma chamada HTTP para o servidor (a rota definida)
      method: "POST",
      headers: {
        //A requisição será em formato json
        "Content-type": "application/json",
      },
      //Transforma os dados do formulário em uma string JSON para serem enviados no corpo da requisição
      body: JSON.stringify({ name, cpf, email, password }),
    })
      .then((response) => {
        //Tratamento da resposta do servidor/API
        if (response.ok) {
          //Verifica se a resposta foi bem sucedida (status 2xx)
          return response.json();
        }
        //Convertendo o erro em formato json
        return response.json().then((err) => {
          //Mensagem retornada do servidor, acessada pela chave "error"
          throw new Error(err.error);
        });
      }) //fechamento da then (response)
      .then((data) => {
        //Executa a resposta de sucesso - retorna ao usuário final

        //Exibe uma alerta para o usuário final (front) com o nome do usuário que acabou de ser cadastrado
        alert("Usuário cadastrado com sucesso! " + data.user.name);

        //Exibe o log no terminal
        console.log("Usuario criado", data.user);

        //Reseta os campos do formulário após o sucesso do cadastro
        document.getElementById("formulario-registro").reset();
      }) //Fechamento da then (data)
      .catch((error) => {
        //Captura qualque erro que ocorra durante o processo de requisição/resposta

        //Exibe um alerta (front) com o erro processado
        alert("Erro no cadastro: " + error.message);

        //Exibe o error no terminal
        console.error("Erro", error.message);
      });
  });
