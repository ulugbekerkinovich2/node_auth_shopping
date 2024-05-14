const {v4: uuid} = require("uuid");

class Brand {
    constructor(name, photo) {
        this.id = uuid();
        this.name = name;
        this.photo = photo;
    }
}

module.exports = Brand;