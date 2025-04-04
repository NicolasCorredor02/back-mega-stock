export function isAuthAdminLogin (req, res, next) {
  console.log(req.session)
  if (req.session && req.session.loggedAdminIn) {
    return next()
  }
  return res.redirect('/api/admin')
}

export function isNotAuthAdminLogin (req, res, next) {
  if (!req.session || !req.session.loggedAdminIn) {
    return next()
  }

  res.redirect('/api/admin/settings')
}
