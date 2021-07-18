const User = require('../models/User');

class UserController {
  registerForm(req, res) {

    return res.render('user/register');
  }
  show(req, res) {
    return res.send('Ok, User signed up!');
  }
  async post(req, res) {

    const userId = await User.create(req.body);


    return res.redirect('/users')
  }
}


/* module.exports = {
  registerFrom(req, res) {

    return res.render('user/register');
  },
  show(req, res) {
    return res.send('Ok, User signed up!');
  },
  async post(req, res) {

    const userId = await User.create(req.body);


    return res.redirect('/users')
  }
}
 */

module.exports = new UserController();