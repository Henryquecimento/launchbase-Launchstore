const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const User = require('../models/User');

module.exports = {
  loginForm(req, res) {
    return res.render('session/login');
  },
  login(req, res) {
    req.session.userId = req.user.id;

    return res.redirect('/users');
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect('/');
  },
  forgotForm(req, res) {
    return res.render('session/forgot-password');
  },
  async forgot(req, res) {
    const { user } = req;

    try {

      // criar token
      const token = crypto.randomBytes(20).toString('hex');

      // criar expiração token
      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      })
      // enviar email com link para recuperar senha
      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@launchstore.com',
        subject: "Password Recovery",
        html: `<h2>Esqueceu a Senha? Perdeu a chave?</>
      <p>Não se preocupe, clique no link abaixo para resetar a senha<p>
      <p>
        <a href="http://localhost:5500/users/password-reset?token=${token}" target="_blank">
          RECUPERAR SENHA
        </a>
      <p>`
      });

      // avisar user que enviamos email
      return res.render('session/forgot-password', {
        token,
        success: 'Verifique seu email para resetar sua senha'
      })

    } catch (err) {
      console.error(err);

      return res.render('session/forgot-password', {
        token,
        error: 'Erro inesperado! Tente novamente'
      })
    }


  },
}