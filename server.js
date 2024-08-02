const express = require('express');
const routes = require('./routes');
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

// sync sequelize models to the database, then turn on the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// if u do not set force back to false it will delete all of your tables when the file runs
// client.sync({ force: false })
//   .then(() => {
//     console.log('db connected');

//     app.listen(PORT, () => {
//       console.log('express server started on', PORT);
//     })
//   })