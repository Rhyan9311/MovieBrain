'use strict'
const fetch = require('node-fetch');
const {db, models: {User, Movies} } = require('../server/db')

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }) // clears db and matches models to tables
  console.log('db synced!')


  // seed Movies
  async function seedMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=1cf50e6248dc270629e802686245c2c8`);
    const data = await response.json();
    const movies = data.results.map(result => ({
      title: result.title,
      rating: result.vote_average / 10,
      genres: result.genre_ids,
      cast: [], // we'll fetch this data later
    }));
    await Movies.insertMany(movies);
  }
  

  const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;
  
  const movies = [
    {
      title: 'The Godfather',
      tmdbId: 238,
    },
    {
      title: 'The Shawshank Redemption',
      tmdbId: 278,
    },
    {
      title: 'The Dark Knight',
      tmdbId: 155,
    },
    // ... add more movies here
  ];
  
  async function seedMovies() {
    await Movie.deleteMany({});
    
    for (const movie of movies) {
      const { title, tmdbId } = movie;
  
      const url = `${BASE_URL}/movie/${tmdbId}?${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
  
      const posterUrl = `${IMG_URL}${data.poster_path}`;
  
      const genres = data.genres.map((genre) => genre.name);
      const cast = data.credits.cast.map((castMember) => castMember.name);
  
      const newMovie = new Movie({
        title,
        rating: 0,
        genres,
        cast,
        posterUrl,
        overview: data.overview,
        releaseDate: new Date(data.release_date),
      });
  
      await newMovie.save();
    }
  }


  
  // Creating Users
  const users = await Promise.all([
    User.create({
      username: "admin",
      password: "123",
      email: "admin@fullstack.com",
      isAdmin: true,
    }),
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ])

  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
  return {
    users: {
      cody: users[0],
      murphy: users[1]
    }
  }
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed()
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed
