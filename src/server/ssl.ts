// to force HEROKU to redirect to HTTPS
import { Request, Response, NextFunction } from 'express'

export const sslRedirect = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-forwarded-proto'] && 
    req.headers['x-forwarded-proto'] !== 'https' &&
    req.hostname !== 'localhost') {

    return res.redirect(['https://', req.hostname, req.url].join(''))
  }

  return next()
}