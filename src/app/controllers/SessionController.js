
module.exports = {
  loginForm(req, res) {
    return res.render('session/login');
  },
  logout(req, res) {
    req.session.destroy();

    return res.redirect('/');
  }
}