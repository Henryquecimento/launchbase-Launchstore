const { hash } = require('bcryptjs');

const faker = require('faker');

const User = require('./src/app/models/User');

let usersIds = [];

async function createUsers() {
  let users = [];

  const password = await hash('2222', 8);

  while (users.length < 3) {

    users.push({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      password,
      cpf_cnpj: faker.datatype.number(11111111111),
      cep: faker.datatype.number(22222222),
      address: faker.address.streetName(),
    });
  }

  const usersPromises = users.map(user => User.create(user));

  usersIds = await Promise.all(usersPromises);

}

createUsers();