async function post(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Please, You must fill all the fields!");
    }
  }

  if (!req.files || req.files.length == 0) {
    return res.send('Please, send at least one image');
  }

  next();

}

async function put(req, res, next) {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "" && key != 'removed_files') {
      return res.send("Please, You must fill all the fields up!");
    }
  }

  next();
}

module.exports = {
  post,
  put
}