import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import User from '@src/models/user';
import Mongoose from 'mongoose';
import { BaseController } from '.';

@Controller('users')
export class UserController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new User(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreatedUpdatedErrorResponse(res, error);
    }
  }
}
