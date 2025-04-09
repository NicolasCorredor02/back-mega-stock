import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { userService } from 'root/services/userService.js'
import dotenv from 'dotenv'

dotenv.config()

const strategyConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/clients/user/login/auth/google'
}

export const googleStrategy = () => {
  const registerOrLogin = async (accessToken, refreshToke, profile, done) => {
    try {
      const email = profile._json.email
      const user = await userService.getByEmail(email)
      if (user) return done(null, user) // Se retorna el usuario ya que existe

      const userData = {
        body: {
          email: profile._json.email,
          password: ' ',
          first_name: profile._json.given_name,
          last_name: profile._json.family_name,
          phone: ' '
        },
        uploadFile: profile._json.picture,
        platform: 'google'
      }
      const newUser = await userService.register(userData)
      return done(null, newUser)
    } catch (error) {
      return done(error, false, { message: error.message })
    }
  }

  passport.use('google', new GoogleStrategy(strategyConfig, registerOrLogin))

  passport.serializeUser((user, done) => {
    try {
      return done(null, user._id)
    } catch (error) {
      done(error)
    }
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getById(id)
      return done(null, user)
    } catch (error) {
      done(error)
    }
  })
}
