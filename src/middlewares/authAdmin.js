export function isAuthAdmin (req, res, next) {
  if (req.user && req.user.isAdmin) {
    return next()
  }
  return res.redirect('/api/admin')
}

export function isNotAuthAdmin (req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return next()
  }

  res.redirect('/api/admin/settings')
}
