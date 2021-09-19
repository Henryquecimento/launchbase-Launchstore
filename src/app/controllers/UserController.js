const { unlinkSync } = require('fs')
const { hash } = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');

const { formatCpfCnpj, formatCep } = require('../../lib/utils');

module.exports = {
  registerForm(req, res) {

    return res.render('user/register');
  },
  async show(req, res) {

    const { user } = req;

    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj);
    user.cep = formatCep(user.cep);

    return res.render('user/index', { user });
  },
  async post(req, res) {

    let { name, email, password, cpf_cnpj, cep, address } = req.body;

    const password = await hash(password, 8);

    cpf_cnpj = cpf_cnpj.replace(/\D/g, ""),
      cep = cep.replace(/\D/g, "")

    const userId = await User.create({
      name,
      email,
      password,
      cpf_cnpj,
      cep,
      address
    });

    req.session.userId = userId;

    return res.redirect('/users')
  },
  async update(req, res) {
    try {
      const { user } = req;

      let { name, email, cpf_cnpj, cep, address } = req.body;

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "");
      cep = cep.replace(/\D/g, "");

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      });

      return res.render('user/index', {
        user: req.body,
        success: "Usuário atualizado com sucesso!"
      })

    } catch (err) {
      console.error(err);

      return res.render('user/index', {
        user: req.body,
        error: "Aconteceu algum erro!"
      })
    }


  },
  async delete(req, res) {
    try {

      let products = await Product.findAll({ where: { user_id: req.body.id } });

      const allFilesPromise = products.map(product =>
        Product.files(product.id));

      let promiseResults = await Promise.all(allFilesPromise);

      await User.delete(req.body.id);
      req.session.destroy();

      promiseResults.map(results =>
        results.rows.map(file => {
          try {
            unlinkSync(file.path);

          } catch (err) {
            console.error(err);
          }
        })
      );

      return res.render("session/login", {
        success: "Conta deletada com sucesso!"
      });

    } catch (err) {
      console.error(err);

      return res.render("user/index", {
        user: req.body,
        error: "Erro ao deletar sua conta!"
      });
    }
  }
}