const User = require('../models/User');
const { compare } = require('bcryptjs');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) return res.render('session/login', {
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

  } catch (err) {
    console.error(err);
  }
}

async function forgot(req, res, next) {
  const { email } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) return res.render('session/forgot-password', {
      user: req.body,
      error: 'E-mail não cadastrado!'
    });

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

async function reset(req, res, next) {
  const { email, password, passwordRepeat, token } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) return res.render('session/password-reset', {
      user: req.body,
      token,
      error: 'E-mail não cadastrado!'
    });

    if (password != passwordRepeat) {
      return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Password Mismatch!'
      });
    }

    if (token != user.reset_token) {
      return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Invalid Token!  Please, ask a new password recovery!'
      });
    }

    let now = new Date();
    now = now.setHours(now.getHours());

    if (now > user.reset_token_expires) {
      return res.render('session/password-reset', {
        user: req.body,
        token,
        error: 'Token expired! Please, ask a new password recovery!'
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  login,
  forgot,
  reset
}