-- FUNCTIONS
delimiter $$
create function calcula_idade(datanascimento date)
returns int
deterministic
contains SQL
begin 
    declare idade int;
    set idade = timestampdiff(year, datanascimento, curdate());
    return idade;
end; $$

delimiter ;

-- verifica se a function foi criada
show create function calcula_idade;

-- Utilizando a function
select name, calcula_idade(data_nascimento) as idade from usuario;

delimiter $$
create function status_sistema()
returns varchar(50)
no SQL
begin
    return "Sistema operando normalmente";
end; $$

delimiter ;

select status_sistema();

delimiter $$
create function total_compras_usuario(id_usuario int)
returns int 
reads sql data
begin 
    declare total int;

    select count(*) into total
    from compra
    where id_usuario = compra.fk_id_usuario;

    return total;
end; $$

delimiter ;

select total_compras_usuario(2) as "Total de Compras" ;

-- Tabela para testar a clausula
create table log_evento(
    id_log int AUTO_INCREMENT PRIMARY KEY,
    mensage varchar(255),
    data_log datetime DEFAULT current_timestamp
);

delimiter $$
create function registrar_log_evento(texto varchar(255))
returns varchar(50)
not deterministic
modifies sql data 
begin   
    INSERT into log_evento(mensage)
    values(texto);

    return 'Log inserido com sucesso';
end; $$

delimiter ;

show create function registrar_log_evento;

show variables like 'log_bin_trust_function_creators';

set global log_bin_trust_function_creators = 1;

select registrar_log_evento("teste com function");

delimiter $$
create function mensagem_boas_vindas(nome_usuario varchar(100))
returns varchar(255)
deterministic
contains SQL
begin
    declare msg varchar(255);
    set msg = concat('Olá ', nome_usuario, '! Seja bem-vindo(a) ao sistema VIO.');
    return msg;
end; $$

delimiter ;

select mensagem_boas_vindas("maju");

-- Conferir as tabelas criadas
select routine_name from 
information_schema.routines 
where routine_type = 'FUNCTION' 
and routine_schema = 'vio_maju';

-- Maior de idade
delimiter $$

create function is_maior_idade(data_nascimento date)
returns boolean
not deterministic
contains sql
begin
    declare idade int; 

    -- utilizando a função já criada
    set idade = calcula_idade(data_nascimento);
    return idade >= 18;
end; $$

delimiter ;

-- Categorizar usuarios por faixa etária

delimiter $$
create function faixa_etaria(data_nascimento date)
returns varchar(20)
not deterministic
contains sql
begin
    declare idade int;

    -- calculo com a função existente
    set idade = calcula_idade(data_nascimento);

    if idade < 18 then
        return "Menor de idade";
    elseif idade < 60 then
        return "Adulto";
    else
        return "Idoso";
    end if;
end; $$

delimiter ;

-- Agrupar usuarios por faixa etária

select faixa_etaria(data_nascimento) as faixa, 
count(*) as quantidade from usuario 
group by faixa;

-- identificar uma faixa etária especifica 
select name from usuario 
    where faixa_etaria(data_nascimento) = "Adulto";

-- Calculo da média de idade de usuarios
delimiter $$
create function media_idade()
returns decimal(5,2)
not deterministic
reads sql data
begin
    declare media decimal(5,2);

    -- Calculo da Média das idades
    select avg(timestampdiff(year, data_nascimento, curdate())) into media from usuario;
    return ifnull(media, 0);
end; $$

delimiter ;

select "A Média de idade dos clientes é maior que 30" as resultado where media_idade() > 30;

-- exercicio direcionado
-- calculo do total gasto por um usuario
delimiter $$
create function calcula_total_gasto(pid_usuario int)
returns decimal(10,2)
not deterministic
reads sql data
begin
    declare total decimal(10,2);

    select sum(i.preco * ic.quantidade) into total
    from compra c 
    join  ingresso_compra ic on c.id_compra = ic.fk_id_compra
    join ingresso i on i.id_ingresso = ic.fk_id_ingresso
    where c.fk_id_usuario = pid_usuario;

    return ifnull(total, 0);
end; $$

delimiter ;

-- Buscar a faixa etária de um usuario
delimiter $$
create function buscar_faixa_etaria_usuario(pid int)
returns varchar(20)
not deterministic
reads sql data
begin
    declare nascimento date;
    declare faixa varchar(20);

    select data_nascimento into nascimento 
    from usuario 
    where id_usuario = pid;

    set faixa = faixa_etaria(nascimento);
    return faixa;
end;$$

delimiter ;

