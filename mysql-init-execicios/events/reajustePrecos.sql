create event if not exists reajuste_precos_eventos_proximos
    on schedule every 1 day
    starts current_timestamp + interval 1 minute
    on completion preserve
    enable
do
    update ingresso set preco = preco * 1.10
    where fk_id_evento in(
        select id_evento from evento 
        where data_hora between now() and now() + interval 7 day
    );


insert into evento (id_evento, nome, descricao, data_hora, local, fk_id_organizador) values
    (3001, 'show de TESTE', 'teste teste', now()+ interval 3 day, 'franca-sp', 1);

    insert into ingresso (id_ingresso, preco, tipo, fk_id_evento) values
        (4001, 100.00, 'pista', 3001);