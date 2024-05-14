const {env} = process;

const config = {
  port: +process.env.PORT || 3131,
  jwt_key: process.env.JWT_KEY,
  jwt_expires_in: process.env.JWT_EXPIRES_IN
};

module.exports = config;
