const { v4: uuid } = require("uuid");

class User {
  constructor(fullname, username, password, photo) {
    this.id = uuid();
    this.fullname = fullname;
    this.username = username;
    this.password = password;
    this.photo = photo;
  }
}

module.exports = User;
