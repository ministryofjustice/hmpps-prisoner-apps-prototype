module.exports = function (router, content) {


  router.post('/staff-latest/applications/log/select-dept', function (req, res) {
    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_1003") {
      res.redirect('/staff-latest/applications/log/new-social-pin-contact/application-details')
    }
    else if (appType == "app_1002") {
      res.redirect('/staff-latest/applications/log/new-official-pin-contact/application-details')
    }
    else if (appType == "app_1001") {
      res.redirect('/staff-latest/applications/log/emergency-pin-credit/application-details')
    }
    else if (appType == "app_1004") {
      res.redirect('/staff-latest/applications/log/remove-pin-phone-contact/application-details')
    }
    else{
      res.redirect('/staff-latest/applications/log/application-details')
    }

  })
  

  router.get('/staff-latest/applications/log/clear-and-go-to-prisoner-details', function(req, res) {
      req.session.destroy();
      res.redirect('/staff-latest/applications/log/prisoner-details')
  })


router.get('/staff-latest/applications/new/confirmation', function (req, res) {
  const newApplication = {
    app_id: 'app-' + Date.now(),
    app_type: req.session.data.app_type || 'New application',
    current_dept: req.session.data.current_dept || 'Unassigned',
    prisoner_name: req.session.data.prisoner_name || '',
    prisoner_number: req.session.data.prisoner_number || '',
    messages: 0,
    date_received: 0,
    status: 'pending',
    decision: '',
    priority: req.session.data.priority === 'first-night' ? 'fnc' : ''
  }

  addApplicationToSession(req, newApplication)

  res.render('staff-latest/applications/new/confirmation')
})

router.post('/staff-latest/applications/view/app/messages', function (req, res) {
  const newComment = req.body.newComment

  if (!req.session.data.staffComments) {
    req.session.data.staffComments = []
  }

  if (newComment && newComment.trim() !== '') {
    const now = new Date()

    const formattedDate = now.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ' at')

    req.session.data.staffComments.push({
      from: 'J. Smith',
      text: newComment.trim(),
      date: formattedDate
    })
  }

  res.redirect('/staff-latest/applications/view/app/messages?url_id=' + req.query.url_id)
})


}
