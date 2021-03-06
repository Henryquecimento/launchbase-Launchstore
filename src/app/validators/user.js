const User = require('../models/User');
const { compare } = require('bcryptjs');

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "" && key) {
      return {
        user: body,
        error: 'Please, You must fill all the fields!'
      };
    }
  }
}

async function show(req, res, next) {

  const { userId: id } = req.session

  const user = await User.findOne({
    where: { id }
  });

  if (!user) res.render('user/register', {
    error: 'Usuário não encontrado!'
  });

  req.user = user;

  next();
}
async function post(req, res, next) {

  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.render('user/resgister', fillAllFields);

  let { email, cpf_cnpj, password, passwordRepeat } = req.body;

  cpf_cnpj = cpf_cnpj.replace(/\D/g, "");

  const user = await User.findOne({
    where: { email },
    or: { cpf_cnpj }
  });

  if (user) return res.render('user/register', {
    user: req.body,
    error: 'User Already Exists!'
  });

  if (password != passwordRepeat) {
    return res.render('user/register', {
      user: req.body,
      error: 'Password Mismatch!'
    });
  }

  next();
}
async function update(req, res, next) {
  const fillAllFields = checkAllFields(req.body);

  if (fillAllFields) return res.render('user/index', fillAllFields);

  const { id, password } = req.body;

  if (!password) return res.render('user/index', {
    user: req.body,
    error: "Coloque sua senha para atualizar o cadastro"
  });

  const user = await User.findOne({ where: { id } });

  const passed = await compare(password, user.password);

  if (!passed) return res.render('user/index', {
    user: req.body,
    error: "Senha incorreta! Favor, tente novamente."
  });

  req.user = user;

  next();
}

module.exports = {
  post,
  show,
  update
}