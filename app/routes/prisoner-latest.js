module.exports = function (router, content) {


  router.post('/prisoner-latest/applications/new/', function (req, res) {
    var appGroup = req.body.appGroup

    if (!appGroup) {
      res.redirect('/prisoner-latest/applications/new/index-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/type')
    }
  })


  router.post('/prisoner-latest/applications/new/index-error', function (req, res) {
    var appGroup = req.body.appGroup

    if (!appGroup) {
      res.redirect('/prisoner-latest/applications/new/index-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/type')
    }
  })


  router.post('/prisoner-latest/applications/new/type', function (req, res) {

    var appType = req.body.appType

    if (!appType) {
      res.redirect('/prisoner-latest/applications/new/type-error')
    }
    else if (appType == "app_0101") {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/application-details')
    }
    else if (appType == "app_0102") {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/application-details')
    }
    else if (appType == "app_0103") {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/application-details')
    }
    else if (appType == "app_0104") {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details')
    }
    else if (appType == "app_0105") {
      res.redirect('/prisoner-latest/applications/new/supply-pin-contacts/application-details')
    }
    else if (appType == "app_0106") {
      res.redirect('/prisoner-latest/applications/new/swap-vos-pin-credit/application-details')
    }
    else{
      res.redirect('/prisoner-latest/applications/new/details')
    }

  })


  router.post('/prisoner-latest/applications/new/type-error', function (req, res) {

    var appType = req.body.appType

    if (!appType) {
      res.redirect('/prisoner-latest/applications/new/type-error')
    }
    else if (appType == "app_0101") {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/application-details')
    }
    else if (appType == "app_0102") {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/application-details')
    }
    else if (appType == "app_0103") {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/application-details')
    }
    else if (appType == "app_0104") {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details')
    }
    else if (appType == "app_0105") {
      res.redirect('/prisoner-latest/applications/new/supply-pin-contacts/application-details')
    }
    else if (appType == "app_0106") {
      res.redirect('/prisoner-latest/applications/new/swap-vos-pin-credit/application-details')
    }
    else{
      res.redirect('/prisoner-latest/applications/new/details')
    }
  })


  router.post('/prisoner-latest/applications/new/details/', function (req, res) {
    var appDetail = req.body.app_detail

    if (!appDetail || appDetail.trim() === '') {
      res.redirect('/prisoner-latest/applications/new/details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/details-error', function (req, res) {
    var appDetail = req.body.app_detail

    if (!appDetail || appDetail.trim() === '') {
      res.redirect('/prisoner-latest/applications/new/details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/new-official-pin-contact/application-details', function (req, res) {
    var firstName = req.body.pin_02_officialFirstName
    var lastName = req.body.pin_02_officialLastName
    var companyName = req.body.pin_02_companyName
    var relationship = req.body.pin_02_contactRelationship
    var tel1 = req.body.pin_02_contactTel1

    if (!firstName || !lastName || !companyName || !relationship || !tel1) {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/new-official-pin-contact/application-details-error', function (req, res) {
    var firstName = req.body.pin_02_officialFirstName
    var lastName = req.body.pin_02_officialLastName
    var companyName = req.body.pin_02_companyName
    var relationship = req.body.pin_02_contactRelationship
    var tel1 = req.body.pin_02_contactTel1

    if (!firstName || !lastName || !companyName || !relationship || !tel1) {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/new-official-pin-contact/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/new-social-pin-contact/application-details', function (req, res) {
    var firstName = req.body.pin_01_socialContactFirstName
    var lastName = req.body.pin_01_socialContactLastName
    var ageDob = req.body.pin_01_agedob
    var dobDay = req.body['pin_01_contact-dob-day']
    var approxAge = req.body['pin_01_contact-approx-age']
    var relationship = req.body.pin_01_contactRelationship
    var tel1 = req.body.pin_01_contactTel1

    var hasError = !firstName || !lastName || !ageDob || !relationship || !tel1
    if (ageDob == 'DOB' && !dobDay) hasError = true
    if (ageDob == 'Age' && !approxAge) hasError = true

    if (hasError) {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/new-social-pin-contact/application-details-error', function (req, res) {
    var firstName = req.body.pin_01_socialContactFirstName
    var lastName = req.body.pin_01_socialContactLastName
    var ageDob = req.body.pin_01_agedob
    var dobDay = req.body['pin_01_contact-dob-day']
    var approxAge = req.body['pin_01_contact-approx-age']
    var relationship = req.body.pin_01_contactRelationship
    var tel1 = req.body.pin_01_contactTel1

    var hasError = !firstName || !lastName || !ageDob || !relationship || !tel1
    if (ageDob == 'DOB' && !dobDay) hasError = true
    if (ageDob == 'Age' && !approxAge) hasError = true

    if (hasError) {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/new-social-pin-contact/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/emergency-pin-credit/application-details', function (req, res) {
    var amount = req.body.pin_03_amount
    var reason = req.body.pin_03_reason

    if (!amount || !reason || reason.trim() === '') {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/emergency-pin-credit/application-details-error', function (req, res) {
    var amount = req.body.pin_03_amount
    var reason = req.body.pin_03_reason

    if (!amount || !reason || reason.trim() === '') {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/emergency-pin-credit/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details', function (req, res) {
    var firstName = req.body.pin_04_officialFirstName
    var lastName = req.body.pin_04_officialLastName
    var tel1 = req.body.pin_04_officialContactTel1

    if (!firstName || !lastName || !tel1) {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/check-details')
    }
  })


  router.post('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details-error', function (req, res) {
    var firstName = req.body.pin_04_officialFirstName
    var lastName = req.body.pin_04_officialLastName
    var tel1 = req.body.pin_04_officialContactTel1

    if (!firstName || !lastName || !tel1) {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/application-details-error')
    } else {
      res.redirect('/prisoner-latest/applications/new/remove-pin-phone-contact/check-details')
    }
  })


  router.get('/prisoner-latest/applications/new/clear-and-send-new-app', function(req, res) {
      req.session.destroy();
      res.redirect('/prisoner-latest/applications/new/')
  })

  router.post('/prisoner-latest/applications/view/app', function (req, res) {
    const newMessage = req.body.message
    const appId = req.query.url_id

    // Make sure the messages object and array exist
    if (!req.session.data.appMessages) {
      req.session.data.appMessages = {}
    }
    if (!req.session.data.appMessages[appId]) {
      req.session.data.appMessages[appId] = []
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

      req.session.data.appMessages[appId].push({
        from: 'You',
        text: newMessage.trim(),
        date: formattedDate
      })
    }

res.redirect('/prisoner-latest/applications/view/app?url_id=' + appId + '#messages')  })

  router.post('/prisoner-latest/applications/view/new', function (req, res) {
    const newMessage = req.body.message
    const appId = 'new'

    if (!req.session.data.appMessages) {
      req.session.data.appMessages = {}
    }
    if (!req.session.data.appMessages[appId]) {
      req.session.data.appMessages[appId] = []
    }

    if (newMessage && newMessage.trim() !== '') {
      const now = new Date()

      const formattedDate = now.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', ' at')

      req.session.data.appMessages[appId].push({
        from: 'You',
        text: newMessage.trim(),
        date: formattedDate
      })
    }

    res.redirect('/prisoner-latest/applications/view/new#messages')
  })

}
