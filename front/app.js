//Chamada da função createUser para associação do evento de envio do formulário
document
  .getElementById("formulario-registro")
  .addEventListener("submit", createUser);

document.addEventListener("DOMContentLoaded", getAllUsers);

function createUser(event) {
  //Previne o comportamento padrão do formulário, ou seja, impede que ele seja enviado e recarregue a pagina
  event.preventDefault();

  //Captura os valores dos campos do formulário
  const name = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  //Requisição HTTP para o endpoint de cadastro de usuário
  fetch("http://10.89.240.105:5000/api/v1/user", {
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
      alert(data.message);
      console.log(data.message);

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
}

function getAllUsers(){
  fetch("http://10.89.240.105:5000/api/v1/user", {
    method: "GET",
    headers:{
      "Contente-Type": "application/json",
    },
  })
    .then((response) => {
      if(response.ok){
        return response.json();
      }
      return response.json().then((err) => {
        throw new Error(err.error);
      });
    })
      //DATA = DADOS DEVOLDIDA PELA API
      .then((data) => {
        const userList = document.getElementById("user-list");
        userList.innerHTML = "";//limpa a lista existente
        
        data.users.forEach((user) => {
          const listItem = document.createElement("li");
          listItem.textContent = `Nome: ${user.name}, CPF: ${user.cpf}, Email: ${user.email}`
          userList.appendChild(listItem);
        });
      })
      .catch((error) => {
        alert("Erro ao obter usuários" + error.message);
        console.error("Erro:", error.message);
      });
  
}
