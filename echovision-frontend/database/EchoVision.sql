create database EchoVision;

use EchoVision;

create table Usuario (
	id_user 	int 		primary key auto_increment,
    cpf_user	varchar(11) not null unique,
	user_name 	varchar(50) not null,
    email_user	varchar(50) not null unique,
    senha_user	varchar(90) not null
);

create table Empresa (
	id_emp		int			primary key auto_increment,
    nm_emp		varchar(50) not null,
    cnpj_emp	varchar(16)	not null unique,
    email_emp	varchar(50) not null unique,
    tel_emp		char(11)	not null,
    status_emp  enum("ativo", "inativo")	not null,
    token_emp	varchar(30) not null,
    end_emp		varchar(50) not null
);

create table Fornecedor (
	id_for		int			primary key auto_increment,
    nm_for		varchar(50) not null,	
    cnpj_for	varchar(16)	not null unique,
    setor_for	varchar(50) not null,
    andar_for	varchar(30) not null,
    email_for	varchar(50) not null unique,
    tel_for		char(11)	not null
);

create table Evento (
	id_even		int			primary key auto_increment,
    nm_even		varchar(50) not null,
    local_even	varchar(50) not null,
    tipo_even	varchar(30) not null,
    desc_even	varchar(80) not null,
    fk_id_emp 	int			not null,
    foreign key (fk_id_emp) references  Empresa(id_emp) on delete cascade
);

create table Fatura (
	id_fat		int			primary key auto_increment,
    item_fat	varchar(50) not null,
    desc_fat	varchar(80) not null,
    preco_item	decimal(7.2) not null,
    data_comp	date		not null,
    fk_id_user  int			not null,
    fk_id_for	int			not null,
    foreign key (fk_id_user) references Usuario(id_user) on delete cascade,
    foreign key (fk_id_for)	 references Fornecedor(id_for) on delete cascade
);


create table Ingresso (
	id_ing		int 		primary key auto_increment,
    valor_ing	decimal(7.2) not null,
    desc_ing	varchar(50)	not null,
    vali_ing	datetime	not null,
    data_ing	date		not null,
    tipo_ing	enum("meia", "inteira") not null,
    dig_fis		enum("digital", "fisico")	not null,
    fk_id_Even	int			not null,
    fk_id_user	int			not null,
    foreign key (fk_id_even)	references Evento(id_even) on delete cascade,
    foreign key (fk_id_user)	references Usuario(id_user) on delete cascade
);

create table RegistroPresenca (
	id_reg		int			primary key	auto_increment,
    ent_reg		datetime,
    sai_reg		datetime,
    pres_reg	boolean		not null,
    fk_id_user	int			not null,
    fk_id_even	int			not null,
    foreign key	(fk_id_user)	references Usuario(id_user) on delete cascade,
    foreign key (fk_id_even)	references Evento(id_even) on delete cascade
);	

select * from Usuario;

