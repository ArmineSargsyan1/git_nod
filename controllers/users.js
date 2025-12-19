import moment from 'moment';

import utils, {comparePassword} from '../services/utils.js';
import * as usersModel from '../models/users.js';
import {v4 as uuidv4} from "uuid"

const {AUTH_SECRET} = process.env;

export default {


  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const user = await usersModel.findUserByEmail(email);
      if (!user) {
        return res.status(422).json({
          status: 'error',
          message: 'Email or password are invalid',
        });
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(422).json({
          status: 'error',
          message: 'Email or password are invalid',
        });
      }

      const payload = JSON.stringify({
        userId: user.id,
        expiresIn: moment().add(1200, 'minutes').toISOString(),
      });
      const token = utils.encrypt(payload, AUTH_SECRET);

      res.json({
        status: 'ok',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (e) {
      next(e);
    }
  },


  async registration(req, res, next) {
    try {
      const {username, password, email} = req.body;

      if (!username || !password || !email) {
        res.status(422).json({
          status: 'error',
          message: 'Username or password is required'
        });
        return;
      }

      const id = uuidv4()
      await usersModel.createUser({id, username, email, password});

      res.json({
        status: 'ok',
        statusCode: 201,
        message: 'User registered successfully',
        userId: id
      })
    } catch (e) {
      next(e)
    }
  },


  async profile(req, res, next) {
    try {
      const user = await usersModel.findUserByID(req.userId);

      delete user?.password;

      res.json({
        status: "ok",
        user,
      })
    } catch (e) {
      next(e)
    }
  }
}
