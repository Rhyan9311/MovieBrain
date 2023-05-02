const mongoose = require('mongoose');
const Sequelize = require('sequelize')
const db = require('../db')

const movieSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    genres: [{
      type: String
    }],
    cast: [{
      type: String
    }]
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  likedMovies: [mongoose.Types.ObjectId], // references to movie documents
});

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = Movie;