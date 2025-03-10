const connect = require("../db/connect")

module.exports = async function validateCpf(cpf, userId){
    const query = 'SELECT id_usuario from usuario where cpf=?'
    const values = [cpf];

    connect.query(query, values, (err, results)=>{
        if(err){
            //fazer algo   
        }
        else if (results.length > 0){
            const IdDoCpfCdastrado = results[0].id_usuario;

            if(userId && IdDoCpfCdastrado !== userId){
                return {error: 'CPF já cadastrado para outro usuario'};
            }else if(!userId){
                return {error: 'CPF já cadastrado'}
            }
        }
        else{
         return null;       
        }
    })
}