const config = {
  dev: { DB_URL: "mongodb://localhost:27017/devData" },
  test: { DB_URL: "mongodb://localhost:27017/testData" },
  production: {
    DB_URL: "mongodb://tara:password@ds245661.mlab.com:45661/northcoders_news"
  }
};

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

module.exports = config[process.env.NODE_ENV];
