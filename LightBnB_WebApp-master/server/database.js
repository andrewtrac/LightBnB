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

module.exports = {

 getUserWithEmail: function(email) {

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
},

 getUserWithId: function(id) {

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
},

 addUser:  function(user) {
  
  const addUserQuery = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `
  const values = [user.name, user.email, user.password]

  return pool.query(addUserQuery, values).then((res) => {
    return res.rows[0]})
},

 getAllReservations: function(guest_id, limit = 10) {

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
},

  getAllProperties: function(options, limit = 10) {


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

    },
    
    
    addProperty: function(property) {

  const addPropertyQuery = `
  INSERT INTO properties (title, description,  number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, 
  thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `

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

}