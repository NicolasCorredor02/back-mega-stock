export function isAuth (req, res, next) {
  if (req.user) {
    return next()
  }
  return res.redirect('/api/clients/user')
}

export function isNotAuth (req, res, next) {
  if (!req.user) {
    return next()
  }

  res.redirect('/api/clients/user/profile')
}
