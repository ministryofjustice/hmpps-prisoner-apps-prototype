module.exports = function (router) {

  router.post('/staff-admin/applications/allowlisting', function (req, res) {
    var selectedApps = [].concat(req.body.selectedApps || []).filter(Boolean)
    var active = req.body['allowlist-active']
    var department = req.body['allowlist-department']

    req.session.data.appAllowlist = req.session.data.appAllowlist || {}

    selectedApps.forEach(function (appId) {
      var existing = req.session.data.appAllowlist[appId] || {}
      req.session.data.appAllowlist[appId] = {
        active: active || existing.active || 'No',
        department: department || existing.department || 'N/A'
      }
    })

    req.session.data.allowlistSuccess = selectedApps.length > 0
    res.redirect('/staff-admin/applications/allowlisting')
  })

  // Override the auto-rendered GET so the one-off success flag can be read then cleared
  router.get('/staff-admin/applications/allowlisting', function (req, res) {
    var allowlistSuccess = !!req.session.data.allowlistSuccess
    delete req.session.data.allowlistSuccess
    res.render('staff-admin/applications/allowlisting', {
      allowlistSuccess: allowlistSuccess
    })
  })

}
