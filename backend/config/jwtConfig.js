const { auth } = require('express-oauth2-jwt-bearer');
require("dotenv").config();

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

console.log("Audience:", process.env.AUTH0_AUDIENCE);
console.log("Issuer:", `https://${process.env.AUTH0_DOMAIN}`);

module.exports = checkJwt;
