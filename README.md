## Northcoders News API

This project creates a mongoose database filled with articles and data surrounding said articles. We can then access this information via the appropriate handle. It has all been uploaded to this [heroku](https://tg-northcoders-news.herokuapp.com) app.

### Getting Started

Fork the repository and then clone a copy onto your local device.

#### Prerequisites

You will need to install the following node modules:

dependencies

```http
body-parser
cors
ejs
express
mongoose
```

devDependencies

```http
chai
mocha
supertest
nodemon
```

At command line, run the following:

```
$ mongod
```

#### Installing

This repository is missing a config file. You will need to set one up outside of any folders. It should look like this:

```js
const config = {
  dev: { DB_URL: /* input the URL for your database */ },
  test: { DB_URL: /* input the URL for your test database */ },
  production: {DB_URL: '' /* we will add this later */}
};

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

module.exports = config[process.env.NODE_ENV];
```

When running a test, the first thing we do is set the NODE_ENV to 'test'. Config is set up in this way so that the default is to run the dev database and this changes when running a test.

### Run your seed

Run the command 'npm run seed:dev' to initiate your database for the first time.

### Running the tests

Run the command 'npm test' into command line and the tests will run.

The spec file in the spec folder tests that all end-points work as they should so that anybody using our app is met with the correct response or a useful error message. It will seed the database before each test in order to ensure further tests are not run on manipulated data.

### Deployment

In order to use your app online you will first need to host the database on [MLAB](https://mlab.com/home). To do this:

- click the above link and create an account.
- create your database and add yourself as a user.
- take the link from the <i><b>'To connect using a driver via the standard MongoDB URI' </i></b> heading and add it to your config file where we left space for it during setup. Replace the <b>dbuser</b> and <b> password</b> fields with your username and password.
- input the following into your terminal to seed your database to MLAB:

```
$ NODE_ENV=production node seed/seed.dev.js
```

Now that your database is online, you will need to host the app via [Heroku](www.heroku.com). To do this:

- click on the above link and create an account.
- create a new app.
- you will need to install the heroku client. Do this by running the following at command line:

```
*UBUNTU*
$ sudo snap install heroku --classic
*MAC*
$ brew install heroku/brew/heroku
```

- enter the following at command line to set up your new heroku project:

```js
$ heroku login /*(followed by your login details when prompted)*/
$ git remote -v
$ heroku create '<project-name>' /* input your project name */
$ heroku config:set DB_URL = '<the DB_URL from the "production" key on your config file>'
```
