'use strict';

import jwt from 'express-jwt';
import express from 'express';

import settings from '../utilities/settings';
import setUsersRoutes from './users';
import setAuthRoutes from './auth';

export default function (app, passport) {

  const router = express.Router();
  const env = settings();

  // Initialize express JWT
  // It should receive the secretToken (the same one used to generate JWT token in User model)
  let authCheck = jwt({
    secret: env.jwtSecret,
    getToken: function (req) {
      // Get Token is a function to tell JWT where our token is stored in users' requests
      // In our app, this token is stored in the authorization header
      var bearerHeader = req.headers["authorization"];
      var token;
      if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        token = bearer[1];
      }
      return token;
    }
  });

  setUsersRoutes(router, authCheck);
  setAuthRoutes(router, passport);

  return router;
}