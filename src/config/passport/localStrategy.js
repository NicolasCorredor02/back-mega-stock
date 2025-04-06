import passport from 'passport'
import { Strategy } from 'passport-local'
import { userService } from 'root/services/userService'

const strategyConfig = {
  usernameField: 'email', // Correspondiente al campo de la DB que se asociara
  passwordField: 'password', // Correspondiente al campo de la DB que se asociara
  passReqToCallback: true // Recibir req desde el cliente, siempre va en true
}

export const localStrategy = () => {
  const register = async (req, email, password, done) => {
    try {
      const body = req.body
      const uploadFile = req.file ? req.file.path : null
      const userData = {
        body,
        uploadFile
      }
      const newUser = await userService.register(userData)
      return done(null, newUser)
    } catch (error) {
      return done(error, false, { message: error.message })
    }
  }

  const login = async (req, email, password, done) => {
    try {
      const user = await userService.login(email, password)
      if (!user) return done(null, false, { message: 'Incorrect credentials' })
      return done(null, user)
    } catch (error) {
      return done(error, false, { message: error.message })
    }
  }

  // const loginAdmin = async (req, email, password, done) => {
  //   try {
  //     const userAdmin = await userService.loginAdmin(email, password)
  //     if (!userAdmin) return done(null, false, { message: 'Unauthorized credentials' })
  //     return done(null, userAdmin)
  //   } catch (error) {
  //     return done(error, false, { message: error.message })
  //   }
  // }

  const registerStrategy = new Strategy(strategyConfig, register) // Se crean las instancias de Strategy tanto para register como para login
  const loginStrategy = new Strategy(strategyConfig, login)
  // const loginAdminStrategy = new Strategy(strategyConfig, loginAdmin)

  passport.use('register', registerStrategy) // Se inicializan las strategys para que cuando el usuario se autentique o registre correctamente, passport retornara en la session la info del user
  passport.use('login', loginStrategy)
  // passport.use('loginAdmin', loginAdminStrategy)

  /**
   * FLUJO
   * 1. express-session --> req --> session (req.session)
   * 2. passport --> req --> req-session.passport
   * 3. serialize --> req.session.passport.user = user._id
   */

  passport.serializeUser((user, done) => {
    try {
      done(null, user._id) // --> req.session.passport.user = user._id
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
