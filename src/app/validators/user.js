const User = require('../models/User');

async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "" && key != 'removed_files') {
      return res.render('user/register', {
        error: 'Please, You must fill all the fields up!'
      });
    }
  }

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
      error: 'Password Mismatch!'
    });
  }

  next();
}

module.exports = {
  post
}