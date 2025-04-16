import passport from 'passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import 'dotenv/config'

const userCookieExtractor = (req) => {
  let token = null

  if (req && req.cookies.tokenUser) {
    token = req.cookies.tokenUser
  }

  if (req && req.cookies.tokenAdmin) {
    token = req.cookies.tokenAdmin
  }

  return token
}

const strategyConfig = {
  jwtFromRequest: ExtractJwt.fromExtractors([userCookieExtractor]),
  secretOrKey: process.env.JWT_SECRET
}

const verifyToken = async (jwtPayload, done) => {
  // Internamente passport -> req.user = jwtPayload
  if (!jwtPayload) return done(null, false, { message: 'Invalid token' })
  return done(null, jwtPayload)
}

passport.use('jwt-cookies', new Strategy(strategyConfig, verifyToken))
