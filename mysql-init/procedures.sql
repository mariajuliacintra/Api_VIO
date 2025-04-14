delimiter //
create procedure register_compra(
    in p_id_usuario int,
    in p_id_ingresso int,
    in p_quantidade int
)
begin
    declare v_id_compra int;
    -- Criar registro na tebela 'compra'
    INSERT INTO compra (data_compra, fk_id_usuario)
    values (now(), p_id_usuario);

    --Obter o ID da compra recém-criada
    set v_id_compra = last_insert_id();

    --Registrar os ingressos comprados
    INSERT INTO ingresso_compra(fk_id_compra, fk_id_ingresso, quantidade);
    values (v_id_compra, p_id_ingresso, p_quantidade);
end; //


delimiter ;

delimiter //
create procedure total_ingressos_usuario2(
    in p_id_usuario int,
    out p_total_ingressos int
)
begin
    set p_total_ingressos = 0;

    select coalesce (sum(ic.quantidade), 0)
    into p_total_ingressos
    from ingresso_compra ic
    join compra c on ic.fk_id_compra = c.id_compra
    where c.fk_id_usuario = p_id_usuario;
end; //

delimiter ;

set @total = 0;

call total_ingressos_usuario2(1, @total);

delimiter //

create procedure registrar_presenca(
    in p_id_compra int,
    in p_id_evento int
)
begin 
    INSERT into presenca (data_hora_checkin, fk_id_evento, fk_id_compra)
    values (now(), p_id_evento, p_id_compra);
end; //

delimiter ;

-- Procedure para resumi do usuario
delimiter //
create procedure resumo_usuario(in pid int)
begin
    declare nome varchar(100);
    declare email varchar(100);
    declare totalrs decimal(10,2);
    declare faixa varchar(20);

    -- Busca o nome e o email do usuario
    select u.name, u.email into nome, email
    from usuario u 
    where u.id_usuario = pid;

    -- Chamada das funções específicas já criadas 
    set totalrs = calcula_total_gasto(pid);
    set faixa = buscar_faixa_etaria_usuario(pid);
    
    -- mostra os dados formados 
    select nome as nome_usuario, email as email_usuario, totalrs as total_gasto, faixa as faixa_etaria;
end ; //

delimiter;



