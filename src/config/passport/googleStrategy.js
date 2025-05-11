import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { userService } from 'root/services/userService.js'
import 'dotenv/config'

const strategyConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/user/login/auth/google/callback',
  passReqToCallback: true
}

const registerOrLogin = async (
  req,
  accessToken,
  refreshToke,
  profile,
  done
) => {
  try {
    const email = profile._json.email
    const user = await userService.getByEmail(email)
    if (user) {
      return done(null, user) // Se retorna el usuario ya que existe
    }

    const userData = {
      body: {
        email: profile._json.email,
        password: ' ',
        first_name: profile._json.given_name,
        last_name: profile._json.family_name || ' ',
        phone: ' ',
        id_number: profile._json.sub,
        platform: 'google'
      },
      uploadFile: profile._json.picture
    }
    const newUser = await userService.register(userData)
    return done(null, newUser)
  } catch (error) {
    return done(error, false, { message: error.message })
  }
}

passport.use('google', new GoogleStrategy(strategyConfig, registerOrLogin))
