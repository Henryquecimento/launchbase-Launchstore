const User = require('../models/User');
const { compare } = require('bcryptjs');

async function login(req, res, next) {

  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email }
  });

  if (!user) res.render('session/login', {
    user: req.body,
    error: 'Usuário não encontrado!'
  });

  const passed = await compare(password, user.password);

  if (!passed) return res.render('session/login', {
    user: req.body,
    error: "Senha incorreta! Favor, tente novamente."
  });

  req.user = user;

  next();
}

module.exports = {
  login
}