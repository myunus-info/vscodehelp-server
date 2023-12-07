# vscodehelp-server

## PROJECT SETUP

## Local Environment Setup

- [Git](https://git-scm.com/)
- [Node.js v18.7.0](https://nodejs.org/en/)
- [NPM v8.3.0](https://www.npmjs.com/)
- [MongoDB Driver](https://www.mongodb.com/)
- [Mongoose v7.5.2](https://mongoosejs.com/)
- [Visual Studio Code](https://code.visualstudio.com/)

## Environment Variables for Local Development

> Create a .env file and adjust the following environment variables. DONOT include the file in the source control.

```bash
# Application PORT
PORT=<value>

# MongoDB
DATABASE=<value>
DB_PASS=<value>

# App secrets
COOKIE_SECRET=<value>
JWT_SECRET=<value>

#Email
EMAIL_FROM=<value>
```

> Create a database in MongoDB 

## NPM Scripts

```bash
$ npm install          # install dependencies
$ npm start            # development build
```
