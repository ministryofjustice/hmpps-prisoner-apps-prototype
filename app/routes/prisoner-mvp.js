module.exports = function (router, content) {


  router.post('/prisoner-mvp/applications/new/', function (req, res) {
    var appGroup = req.body.appGroup

    if (!appGroup) {
      res.redirect('/prisoner-mvp/applications/new/index-error')
    } else {
      res.redirect('/prisoner-mvp/applications/new/type')
    }
  })


  router.post('/prisoner-mvp/applications/new/type', function (req, res) {

    var appType = req.body.appType

    if (!appType) {
      res.redirect('/prisoner-mvp/applications/new/type-error')
    }
    else if (appType == "app_1003") {
      res.redirect('/prisoner-mvp/applications/new/new-social-pin-contact/application-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/prisoner-mvp/applications/new/new-official-pin-contact/application-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/prisoner-mvp/applications/new/emergency-pin-credit/application-details')
    }
    else if (appType == "app_1004") {
      res.redirect('/prisoner-mvp/applications/new/remove-pin-phone-contact/application-details')
    }
    else{
      res.redirect('/prisoner-mvp/applications/new/details')
    }

  })

  router.post('/prisoner-mvp/applications/new/details/', function (req, res) {
    var appDetail = req.body.app_detail

    if (!appDetail || appDetail.trim() === '') {
      res.redirect('/prisoner-mvp/applications/new/details-error')
    } else {
      res.redirect('/prisoner-mvp/applications/new/check-details')
    }
  })

  router.post('/prisoner-mvp/applications/new/index-error', function (req, res) {
    var appGroup = req.body.appGroup

    if (!appGroup) {
      res.redirect('/prisoner-mvp/applications/new/index-error')
    } else {
      res.redirect('/prisoner-mvp/applications/new/type')
    }
  })


  router.post('/prisoner-mvp/applications/new/type-error', function (req, res) {
    var appType = req.body.appType

    if (!appType) {
      res.redirect('/prisoner-mvp/applications/new/type-error')
    }
    else if (appType == "app_1003") {
      res.redirect('/prisoner-mvp/applications/new/new-social-pin-contact/application-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/prisoner-mvp/applications/new/new-official-pin-contact/application-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/prisoner-mvp/applications/new/emergency-pin-credit/application-details')
    }
    else if (appType == "app_1004") {
      res.redirect('/prisoner-mvp/applications/new/remove-pin-phone-contact/application-details')
    }
    else{
      res.redirect('/prisoner-mvp/applications/new/details')
    }
  })


  router.post('/prisoner-mvp/applications/new/details-error', function (req, res) {
    var appDetail = req.body.app_detail

    if (!appDetail || appDetail.trim() === '') {
      res.redirect('/prisoner-mvp/applications/new/details-error')
    } else {
      res.redirect('/prisoner-mvp/applications/new/check-details')
    }
  })


  router.get('/prisoner-mvp/applications/new/clear-and-send-new-app', function(req, res) {
      req.session.destroy();
      res.redirect('/prisoner-mvp/applications/new/')
  })


}
