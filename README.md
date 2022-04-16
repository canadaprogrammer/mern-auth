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

## Create User Model

- `npm i jsonwebtoken joi joi-password-complexity`

- Create `/models/user.js`

  - ```js
    const mongoose = require('mongoose');
    const jwt = required('jsonwebtoken');
    const Joi = require('joi');
    const passwordComplexity = require('joi-password-complexity');

    const userSchema = new mongoose.Schema({
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
    });

    userSchema.methods.generateAuthToken = function () {
      const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: '7d',
      });
      return token;
    };

    const User = mongoose.model('user', userSchema);

    const validate = (data) => {
      const schema = Joi.object({
        firstName: Joi.string().required().label('First Name'),
        lastName: Joi.string().required().label('Last Name'),
        email: Joi.string().email().required().label('Email'),
        password: passwordComplexity().required().label('Password'),
      });
      return schema.validate(data);
    };

    module.exports = { User, validate };
    ```

- On `.env`, put `JWTPRIVATEKEY = your private key`

## Register Route

- `npm i bcrypt`

- Create `/routes/users.js`

  - ```js
    const router = require('express').Router();
    const { User, validate } = require('../modules/user');
    const bcrypt = require('bcrypt');

    router.post('/', async (req, res) => {
      try {
        const { error } = validate(req.body);
        if (error) {
          return res.status(400).send({ message: error.details[0].message});
        }
        const user = await User.findOne({ email req.body.email });
        if (user) {
          return res.status(409).send({ message: 'User withe given email already exist!' });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({...req.body, password: hashPassword }).save();
        res.status(201).send({ message: 'User created successfully!' });
      } catch (error) {
        res.status(500).send({ message: 'Internal Server Error!' });
      }
    });
    ```
