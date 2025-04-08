export function isAuth (req, res, next) {
  console.log(req.session)
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/api/user')
}

export function isNotAuth (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }

  res.redirect(`/api/user/profile/${req.user._id}`)
}
