module.exports = function validateUser({
  cpf,
  email,
  password,
  name,
  data_nascimento,
}) {
    const nascimentodate = new Date(data_nascimento);
  //Lógica
  if (!cpf || !email || !password || !name || !data_nascimento) {
    return { 
        error: "Todos os campos devem ser preenchidos" };
  }
  if (isNaN(cpf) || cpf.length !== 11) {
    return {
      error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos"};
  }
  if (!email.includes("@")) {
    return { error: "Email inválido. Deve conter @" };
  } 
  return null; //Ou seja se estiver tudo certo retorna nulo para ignorar o if da controller
};
