
module.exports = {
  registerFrom(req, res) {

    return res.render('user/register');
  },
  async post(req, res) {

    return res.send('Passed!')
  }
}
