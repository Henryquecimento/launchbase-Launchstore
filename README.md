
<h1 align="center"><strong>LAUNCHSTORE</br><span style="font-size: 24px; color: #fd951f">Buy and Sell</span></strong></h1>


**<WHAT IS THIS PROJECT?**
<h3 style="font-size: 14px">O QUE É ESTE PROJETO?</h3>
:us:
<p align="justify">
Launchstore is an MVC application of an e-commerce. In this project there are two sessions, public and private. The first one is responsible to display the products and create an account, the second one is responsible to add, display, update and remove products, it can also buy and sell.
</p>

<p align="justify">
Launchstore é uma aplicação MVC de uma e-commerce. Neste projeto há duas sessões, uma pública e uma privada. A primeira é responsável por exibir os produtos e criar uma conta, já a segunda é responsável por adicionar, exibir, atualizar e remover pordutos, bem como comprar e vender.
</p>

<p>&nbsp;</p>

**:computer: TECHNOLOGIESs**

<h3 style="font-size: 14px">TECNOLOGIAS</h3>

### Frontend:

- [JavaScript][javascript]
- [HTML][html]
- [CSS][css]
- [Nunjucks][njk]
- [Lottie][lottie]

### Backend:

- [Node.js][nodejs]
- [Express][express]
- [PG][pg]
- [PostgreSQL][postgresql]
- [Multer][multer]
- [Faker][faker]
- [BcryptJs][bcryptjs]
- [Nodemailer][nodemailer]

  <p>&nbsp;</p>

**:rocket: HOW TO ACCESS**

<h3 style="font-size: 14px">COMO ACESSAR</h3>

> COPYING FROM GITHUB / COPIANDO DO GITHUB:

```bash
$ git clone https://github.com/Henryquecimento/foodfy_project.git
```

> INSTALLING NECESSARY DEPENDENCIES / INSTALANDO DEPENDÊNCIAS NECESSÁRIAS:

```bash
npm install
```

**:gear: DATABASE CONFIGURATION / CONFIGURAÇÃO DO BANCO DE DADOS**

First of all, you must've been installed [PostgreSQL] and [Postbird][postbird] to help you with DB management and other activities.
</br>

Primeiramente, você precisa ter instalado o [PostgreSQL] e o [Postbird][postbird] para lhe auxiliar no gerenciamento do BD e demais atividades.

- <a href="https://www.postgresql.org/download/">POSTGRES</a>
- <a href="https://www.electronjs.org/apps/postbird">POSTBIRD</a>

Disclaimer: </br>
:us:
</br>
My Postgres version is 13, pay attention to yours.
</br>

Minha versão do Postgres é a 13, atenção na versão do seu.

#### WINDOWS OS

1. Open you Powershell as Administrator and browse to the installation folder
   </br>
   Abra o Powershell como administrador e navegue até a pasta de instalação:

```bash
$ cd "C:\Program Files\PostgreSQL\13\bin\"
```

2. Initiate Postgres with the command below
   </br>
   Inicie o Postgres com o comando abaixo:

```bash
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" start
```

3. After the usage, you can shut it down with the command
   </br>
   Após o uso, você pode desligá-lo com o comando:

```bash
$ .\pg_ctl.exe -D "C:\Program Files\PostgreSQL\13\data" stop
```

#### MAC OS

1. Initiate Postgres with
   </br>
   Iniciar o Postgres com:

```shell
pg_ctl -D /usr/local/var/postgres start
```

2. Shut down Postgres with
   </br>
   Desligar o Postgresql com:

```shell
pg_ctl -D /usr/local/var/postgres stop
```

#### LINUX OS

[ Official Documentation to install and use Postgres on Linus OS / Documentação Oficial para instalar e usar Postgres no Linux OS ][postgres-linux]













































[javascript]: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript
[nodejs]: https://nodejs.org/en/
[express]: https://expressjs.com/pt-br/
[html]: https://developer.mozilla.org/pt-BR/docs/Web/HTML
[css]: https://developer.mozilla.org/pt-BR/docs/Web/CSS
[njk]: https://mozilla.github.io/nunjucks/
[postgresql]: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
[postgres-linux]: https://www.postgresql.org/download/linux/
[pg]: https://github.com/brianc/node-postgres/tree/master/packages/pg
[postbird]: https://www.electronjs.org/apps/postbird
[multer]: https://github.com/expressjs/multer
[lottie]: https://github.com/airbnb/lottie-web
[nodemailer]: https://nodemailer.com/about/
[bcryptjs]: https://www.npmjs.com/package/bcrypt
[faker]: https://github.com/marak/Faker.js/
[mailtrap]: https://mailtrap.io/