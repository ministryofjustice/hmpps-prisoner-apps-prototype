module.exports = function (router, content) {

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase()
  }

  function getAppTypeIdByName(sessionData, appTypeName) {
    var targetName = normalizeText(appTypeName)
    var appGroupsTypes = sessionData.appGroupsTypes || {}

    for (var group in appGroupsTypes) {
      var details = appGroupsTypes[group]
      if (!details || !details.apps) {
        continue
      }

      var matchedApp = details.apps.find(function (app) {
        return normalizeText(app.app_type) === targetName
      })

      if (matchedApp) {
        return matchedApp.app_id
      }
    }

    return null
  }

  function getAppTypeName(sessionData, appTypeId) {
    var appGroupsTypes = sessionData.appGroupsTypes || {}

    for (var group in appGroupsTypes) {
      var details = appGroupsTypes[group]
      if (!details || !details.apps) {
        continue
      }

      var matchedApp = details.apps.find(function (app) {
        return app.app_id === appTypeId
      })

      if (matchedApp) {
        return matchedApp.app_type
      }
    }

    return null
  }

  function hasOpenAppAlreadySubmitted(sessionData, appTypeId) {
    var submittedAppTypeIds = sessionData.submittedAppTypeIds || []
    if (submittedAppTypeIds.indexOf(appTypeId) !== -1) {
      return true
    }

    var prisonerApps = sessionData.prisonerAppsDB || []
    var existingDbApp = prisonerApps.find(function (app) {
      return app.app_type_id === appTypeId && app.status !== 'Closed'
    })

    if (existingDbApp) {
      return true
    }

    var formSubmissionFlagsByType = {
      app_0101: 'pin_02_submitted',
      app_0102: 'pin_01_submitted',
      app_0103: 'pin_03_submitted',
      app_0104: 'pin_04_submitted',
      app_0105: 'pin_06_submitted',
      app_0106: 'pin_05_submitted'
    }

    var submittedFlagForType = formSubmissionFlagsByType[appTypeId]
    if (submittedFlagForType && sessionData[submittedFlagForType] === 'submitted') {
      return true
    }

    if (sessionData.general_app === 'submitted') {
      var selectedAppName = getAppTypeName(sessionData, appTypeId)
      if (selectedAppName && normalizeText(sessionData.checkappType) === normalizeText(selectedAppName)) {
        return true
      }
    }

    return false
  }

  function inferSubmittedAppTypeId(sessionData, sourceData) {
    if (sourceData.appType) {
      return sourceData.appType
    }

    var appTypeBySubmittedFlag = {
      pin_01_submitted: 'app_0102',
      pin_02_submitted: 'app_0101',
      pin_03_submitted: 'app_0103',
      pin_04_submitted: 'app_0104',
      pin_05_submitted: 'app_0106',
      pin_06_submitted: 'app_0105'
    }

    for (var submittedFlag in appTypeBySubmittedFlag) {
      if (sourceData[submittedFlag] === 'submitted') {
        return appTypeBySubmittedFlag[submittedFlag]
      }
    }

    if (sourceData.general_app === 'submitted' && sourceData.checkappType) {
      return getAppTypeIdByName(sessionData, sourceData.checkappType)
    }

    return null
  }

  function persistSubmissionData(req, sourceData) {
    var data = sourceData || {}
    var sessionData = req.session.data

    Object.keys(data).forEach(function (key) {
      sessionData[key] = data[key]
    })

    var appTypeId = inferSubmittedAppTypeId(sessionData, data)
    if (!appTypeId) {
      return
    }

    sessionData.submittedAppTypeIds = sessionData.submittedAppTypeIds || []

    if (sessionData.submittedAppTypeIds.indexOf(appTypeId) === -1) {
      sessionData.submittedAppTypeIds.push(appTypeId)
    }
  }


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
      return
    }

    // Check if this app type already exists and is not closed, including form submissions.
    if (hasOpenAppAlreadySubmitted(req.session.data, appType)) {
      res.redirect('/prisoner-latest/applications/new/restricted')
      return
    }

    if (appType == "app_0101") {
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
      return
    }

    // Check if this app type already exists and is not closed, including form submissions.
    if (hasOpenAppAlreadySubmitted(req.session.data, appType)) {
      res.redirect('/prisoner-latest/applications/new/restricted')
      return
    }

    if (appType == "app_0101") {
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


  router.post('/prisoner-latest/applications/new/confirmation', function (req, res) {
    persistSubmissionData(req, req.body)

    res.redirect('/prisoner-latest/applications/new/confirmation')
  })


  router.get('/prisoner-latest/applications/new/confirmation', function (req, res) {
    persistSubmissionData(req, req.query)
    res.render('prisoner-latest/applications/new/confirmation')
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
      delete req.session.data.appGroup
      delete req.session.data.appType
      delete req.session.data.app_detail
      delete req.session.data.checkAppGroup
      delete req.session.data.checkappType
      res.redirect('/prisoner-latest/applications/new/')
  })

  router.use('/prisoner-latest/applications/view/app', function (req, res, next) {
    if (req.method === 'GET' && req.query.url_id) {
      var appId = String(req.query.url_id)
      var apps = req.session.data.prisonerAppsDB || []
      var viewedApp = apps.find(function (app) {
        return String(app.app_id) === appId
      })

      if (viewedApp && Array.isArray(viewedApp.messages) && viewedApp.messages.length) {
        var lastMessage = viewedApp.messages[viewedApp.messages.length - 1]
        var viewToken = [
          viewedApp.messages.length,
          lastMessage.sender || '',
          lastMessage.text || '',
          lastMessage.date || '',
          lastMessage.time || ''
        ].join('|')

        req.session.data.viewedMessageState = req.session.data.viewedMessageState || {}
        req.session.data.viewedMessageState[appId] = viewToken
      }
    }

    next()
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

      const messageTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      req.session.data.appMessages[appId].push({
        from: 'You',
        text: newMessage.trim(),
        date_offset: 0,
        time: messageTime
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

      const messageTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      req.session.data.appMessages[appId].push({
        from: 'You',
        text: newMessage.trim(),
        date_offset: 0,
        time: messageTime
      })
    }

    res.redirect('/prisoner-latest/applications/view/new#messages')
  })

}
