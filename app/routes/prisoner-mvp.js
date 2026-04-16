module.exports = function (router, content) {


  router.post('/prisoner-mvp/applications/new/type', function (req, res) {

    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_1003") {
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


  router.get('/prisoner-mvp/applications/new/clear-and-send-new-app', function(req, res) {
      req.session.destroy();
      res.redirect('/prisoner-mvp/applications/new/')
  })


}
