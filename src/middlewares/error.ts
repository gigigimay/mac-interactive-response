/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'

import { IS_DEVELOPMENT_MODE } from 'config/env'
import { getLogger } from 'utilities/logger'

const logger = getLogger('middlewares/error.ts')

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (err.name) {
    default:
      logger.error(err)
      return res.status(500).send({
        errors: [
          {
            msg: IS_DEVELOPMENT_MODE
              ? err.message
              : 'An unexpected error has occured.',
            code: 'unknown',
          },
        ],
      })
  }
}
