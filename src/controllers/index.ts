import { Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_VALIDATION } from '@src/models/user';

export abstract class BaseController {
  protected sendCreatedUpdatedErrorResponse(
    res: Response,
    error: mongoose.Error.ValidationError | Error
  ): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientError = this.handleClientErrors(error);
      res
        .status(clientError.code)
        .json({ code: clientError.code, error: clientError.error });
    } else {
      res.status(500).send({ code: 500, error: 'Something went wrong !' });
    }
  }

  private handleClientErrors(
    error: mongoose.Error.ValidationError
  ): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (err) => err.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length) {
      return {
        code: 409,
        error: error.message,
      };
    } else {
      return { code: 422, error: error.message };
    }
  }
}
