# Express Authentication API

Authentication API for [Express](https://expressjs.com/) using [Passport](https://passportjs.org/)

## setup

### installing dependencies
After cloning the repository run this command to install all the dependencies:
```bash
npm install
```
### adding your secrets
Add an `.env` file in the root of the project, then add your google client secret and google cliet id in there, an example is shown in the `.env.example` file.

### generating the private and the public keys for JWT
then you need to run the following command to generate the private and the public keys for JWT:
```bash
node ./lib/generateKeyPair.js
```
Make sure you have a database file in the root of the project called `database.sqlite`.

### starting the server
Now you can run the server using this command:
```bash
node index.js
```

## Changing the database setup
By default this repository is built on an sqlite database and using the sequelize ORM.

But you can change it to whatever database or ORM you want, database config is included in `lib/db.js` file.
