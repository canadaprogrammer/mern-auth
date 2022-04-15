# MERN Auth - Signup & Login with Email (JWT)

## Setup Express & MongoDB

- ```bash
  npm init --yes
  npm i express mongoose dotenv nodemon cors
  ```

- On package.json, add `"start": "nodemon index.js"` inside `"scripts"`

- Create `index.js`

  - ```js
    require('dotenv').config();
    const express = required('express');
    const app = express();
    const cors = require('cors');
    const connection = require('./db');

    // database connection
    connection();

    // middleware
    app.use(express.json());
    app.use(cors());

    const port = process.env.PORT || 8080;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
    ```

- Create `db.js`

  - ```js
    const mongoose = require('mongoose');

    module.exports = () => {
      const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };
      try {
        mongoose.connect(process.env.DB, connectionParams);
        console.log('Connected to database successfully!');
      } catch (error) {
        console.log(error);
        console.log('Failed to connect to database!');
      }
    };
    ```

- Create `.env` and put `DB = your database url`
