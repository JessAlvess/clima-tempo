create table ceps (
	id serial primary key,
  cep varchar(255) not null unique,
  cidade text,
  bairro text,
  estado text,
  latitude text,
  longitude text
);

create table clima (
  id serial primary key,
  cep_id int references ceps(id),
  temperatura text,
  descricao text,
  data_hora timestamp default now()
);

create table noticas (
  id serial primary key,
  cep_id int references ceps(id),
  titulo text,
  descricao text,
  url text,
  data_hora text,
  foto_de_capa text
);