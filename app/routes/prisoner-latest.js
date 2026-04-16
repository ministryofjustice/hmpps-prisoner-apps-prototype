module.exports = function (router, content) {


  router.post('/prisoner-latest/applications/new/type', function (req, res) {

    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_1003") {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/application-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/application-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/application-details')
    }
    else if (appType == "app_1004") {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details')
    }
    else{
      res.redirect('/prisoner-latest/applications/new/details')
    }

  })


  router.get('/prisoner-latest/applications/new/clear-and-send-new-app', function(req, res) {
      req.session.destroy();
      res.redirect('/prisoner-latest/applications/new/')
  })

  router.post('/prisoner-latest/applications/view/app', function (req, res) {
    const newMessage = req.body.message

    // Make sure the messages array exists
    if (!req.session.data.messages) {
      req.session.data.messages = []
    }

    // Only add non-empty messages
    if (newMessage && newMessage.trim() !== '') {
      const now = new Date()

      const formattedDate = now.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', ' at')

      req.session.data.messages.push({
        from: 'You',
        text: newMessage.trim(),
        date: formattedDate
      })
    }

res.redirect('/prisoner-latest/applications/view/app?url_id=' + req.query.url_id)  })

}
