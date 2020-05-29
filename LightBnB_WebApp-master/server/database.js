const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
  port: 5432
});

pool.connect()

/* Dummy data:
user id = 6
name: Iva Harrison
email: allisonjackson@mail.com 
password: password
*/

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const emailQuery = `
  SELECT * FROM users
  WHERE users.email = $1;`

  return pool.query(emailQuery,[email]).then( (res) => {

    if (!res.rows) {
      return null
    } else {
      return res.rows[0]
    }
  })

  
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const idQuery = `
  SELECT * FROM users
  WHERE users.id = $1;`

  return pool.query(idQuery,[id]).then( (res) => {

    if (!res.rows) {
      return null
    } else {
      return res.rows[0]
    }
  })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  
  const addUserQuery = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `
  const values = [user.name, user.email, user.password]

  return pool.query(addUserQuery, values).then((res) => {
    return res.rows[0]})
}
exports.addUser = addUser;

/// Reservations
/*
  juliansantos@aol.com   
*/
/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const allResQuery = `
 SELECT properties.*, reservations.*, avg(rating) as average_rating
 FROM reservations
 JOIN properties ON reservations.property_id = properties.id
 JOIN property_reviews ON properties.id = property_reviews.property_id 
 WHERE reservations.guest_id = $1
 GROUP BY properties.id, reservations.id
 ORDER BY reservations.start_date
 LIMIT $2;
  `
  const values = [guest_id, limit]

  return pool.query(allResQuery, values).then((res) => {
   
    return res.rows
  })
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

  const getAllProperties = function(options, limit = 10) {


    const optionsArray = Object.keys(options)

    const queryParams = [];

    let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id 
    `;
    if (!optionsArray) {
      return null
    } else {

      queryString += 'WHERE '

      for (let element of optionsArray) {
      if (element === 'city' && options[element]) {
        queryParams.push(`%${options[element]}%`);
        queryString += `city LIKE $${queryParams.length} AND `;

      } else if (element === 'minimum_price_per_night' && options[element]) {
        queryParams.push(Number(options[element]) * 100);
        queryString += `cost_per_night >= $${queryParams.length} AND `;

      } else if (element === 'maximum_price_per_night' && options[element]) {
        queryParams.push(Number(options[element]) * 100);
        queryString += `cost_per_night <= $${queryParams.length} AND `;

      } else if (element === 'minimum_rating' && options[element]) {
        queryParams.push(options[element] * 100);
        queryString += `rating >= $${queryParams.length} AND `;

      } else if (element === 'owner_id' && options[element]) {
        queryParams.push(options[element]);
        queryString += `owner_id = $${queryParams.length} AND `;

      } else if (!options[element] || element === '%%') {
        queryParams;
        queryString;
      }

    }
  
    queryString = queryString.slice(0, -4)

    }
  
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
    
    console.log(queryString, queryParams)

    return pool.query(queryString, queryParams).then(res => {
      console.log(res.rows)
      return res.rows})

    }
  


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const addPropertyQuery = `
  INSERT INTO properties (title, description,  number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, 
  thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `
 /*
  title: 'New Dev Guy in Training',
  description: 'asdfasdfasdfa',
  number_of_bedrooms: '42',
  number_of_bathrooms: '2',
  parking_spaces: '1',
  cost_per_night: '1000',
  thumbnail_photo_url: 'none',
  cover_photo_url: 'none',
  street: '54 walby drive',
  country: 'US',
  city: 'New York',
  province: 'Stuff',
  post_code: 'Stuff',
  owner_id: 103 } */

  const propertyKeys = Object.keys(property)
  const propertyValues = []

  propertyKeys.map((element) => {

    if (element === 'cost_per_night') {
    propertyValues.push(Number(property[element]) * 100)
    } else {
    propertyValues.push(property[element])
    }
    })

  return pool.query(addPropertyQuery, propertyValues).then((res) => {
    console.log(res.rows)
   return res.rows[0]})


}
exports.addProperty = addProperty;

/*

josephvelasquez@gmx.com */