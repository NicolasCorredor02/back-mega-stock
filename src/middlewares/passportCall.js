import passport from 'passport'

export const passportCall = (strategy, options = {}) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { ...options, session: false }, (error, user, info) => {
      if (error) return next(error)
      // if (!user) {
      //   return res.status(401).send({
      //     status: 'error',
      //     message: info && info.message ? info.message : info.toString()
      //   })
      // }
      req.user = user
      next()
    })(req, res, next)
  }
}
