export function isAuthAdmin (req, res, next) {
  console.log(req.session)
  if (req.session && req.session.isAdmin) {
    return next()
  }
  return res.redirect('/api/admin')
}

export function isNotAuthAdmin (req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return next()
  }

  res.redirect('/api/admin/settings')
}
