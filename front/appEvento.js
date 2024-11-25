document
  .getElementById("form-selecao-data")
  .addEventListener("submit", testeCalendario);
function testeCalendario(event) {
  //preveine o comportamento padrão do formulário, ou seja , impede que ele seja enviadi e recarregue a pg
  event.preventDefault();
  const data_recebida = document.getElementById("data").value;

  if (data_recebida) {
    // console.log("data recebida:", data_recebida);
    alert("A data selecionada é: " + data_recebida);
  }
  else{
    alert("Por favor, selecione uma data!")
  }
}
