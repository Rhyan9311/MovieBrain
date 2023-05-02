// This is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const Movie = require('./models/Movie');

// Associations could go here!
User.hasMany(Movie);
Movie.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Movie,
  },
};
