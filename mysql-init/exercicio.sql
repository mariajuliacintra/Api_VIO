-- EXERCICIO 
ip: 10.89.240.85
--functions

delimiter $$
create function total_ingressos_vendidos(id_evento int)
returns int
not deterministic
reads sql data
begin
    declare quantidade int;

    select sum(ic.quantidade) into quantidade
    from ingresso_compra ic
    join ingresso i on i.id_ingresso = ic.fk_id_ingresso
    join evento e on e.id_evento = i.fk_id_evento
    where  e.id_evento = id_evento;
    return quantidade;
end; $$

delimiter ;


delimiter $$
create function renda_total_evento(id_evento int)
returns decimal(10,2)
not deterministic
reads sql data
begin
    declare total_preco decimal(10,2);

    select sum(ic.quantidade * i.preco) into total_preco
    from ingresso i
    join evento e on i.fk_id_evento = e.id_evento
    join ingresso_compra ic on ic.fk_id_ingresso = i.id_ingresso
    where e.id_evento = id_evento;

    return total_preco;
end; $$

delimiter ;

--procedure
delimiter //
create procedure resumo_evento(id_evento int)
begin
    declare nome varchar(100);
    declare data_evento date;
    declare total_ingresso int;
    declare renda decimal(10,2);

    select e.nome, e.data_hora into nome, data_evento
    from evento e
    where e.id_evento = id_evento;

    set total_ingresso = total_ingressos_vendidos(id_evento);
    set renda = renda_total_evento(id_evento);

    select nome as nome_evento, data_evento as data, total_ingresso as total, renda;
end ; //

delimiter ;