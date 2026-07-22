module.exports = function (router, content) {

  function getLoggedAppViewUrl(appType) {
    if (appType === 'app_0102') {
      return '/staff-latest/applications/view/new-social-pin-contact/application.html'
    }

    if (appType === 'app_0101') {
      return '/staff-latest/applications/view/new-official-pin-contact/application.html'
    }

    if (appType === 'app_0103') {
      return '/staff-latest/applications/view/emergency-pin-credit/application.html'
    }

    if (appType === 'app_0104') {
      return '/staff-latest/applications/view/remove-pin-phone-contact/application.html'
    }

    if (appType === 'app_0105') {
      return '/staff-latest/applications/view/supply-pin-contacts/application.html'
    }

    if (appType === 'app_0106') {
      return '/staff-latest/applications/view/swap-vos-pin-credit/application.html'
    }

    return '/staff-latest/applications/view/new/application.html'
  }

  function resolveAppTypeAndGroup(sessionData) {
    const fallbackType = sessionData.checkappType
    const fallbackGroup = sessionData.checkAppGroup || sessionData.appGroup
    const selectedAppTypeId = sessionData.appType

    if (!selectedAppTypeId || !sessionData.appGroupsTypes) {
      return {
        appTypeName: fallbackType || 'Application',
        appGroupName: fallbackGroup || 'Application group'
      }
    }

    const groups = Object.values(sessionData.appGroupsTypes)

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i]
      if (!group || !Array.isArray(group.apps)) {
        continue
      }

      for (let j = 0; j < group.apps.length; j++) {
        const app = group.apps[j]
        if (app && app.app_id === selectedAppTypeId) {
          return {
            appTypeName: app.app_type || fallbackType || 'Application',
            appGroupName: group.name || fallbackGroup || 'Application group'
          }
        }
      }
    }

    return {
      appTypeName: fallbackType || 'Application',
      appGroupName: fallbackGroup || 'Application group'
    }
  }

  function addLoggedApplicationToSession(req) {
    const sessionData = req.session.data

    if (sessionData.currentLogApplicationId) {
      return
    }

    const newId = 'log-' + Date.now()
    sessionData.currentLogApplicationId = newId

    const resolvedNames = resolveAppTypeAndGroup(sessionData)
    const appTypeName = resolvedNames.appTypeName
    const appGroupName = resolvedNames.appGroupName

    // Keep detail pages in sync with resolved names.
    sessionData.checkappType = appTypeName
    sessionData.checkAppGroup = appGroupName

    if (!Array.isArray(sessionData.sessionApplications)) {
      sessionData.sessionApplications = []
    }

    sessionData.sessionApplications.unshift({
      app_id: newId,
      app_type: appTypeName,
      app_group: appGroupName,
      owner: sessionData.appDept || 'Business Hub',
      prisoner_name: sessionData.prisonerName || 'Patel, Taj',
      prisoner_number: sessionData.prisonNumber || 'A1234BC',
      date_received: 0,
      status: 'New',
      decision: null,
      app_url: getLoggedAppViewUrl(sessionData.appType)
    })
  }

  function resolveDepartmentName(sessionData, departmentValue) {
    if (!departmentValue) {
      return ''
    }

    const departments = sessionData.departments
    if (Array.isArray(departments)) {
      for (let i = 0; i < departments.length; i++) {
        const department = departments[i]
        if (!department) {
          continue
        }

        if (department.department_id === departmentValue || department.department_name === departmentValue) {
          return department.department_name || departmentValue
        }
      }
    }

    return departmentValue
  }

  function getFormattedNow() {
    const now = new Date()
    return now.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', ' at')
  }


  router.post('/staff-latest/applications/log/select-dept', function (req, res) {
    delete req.session.data.currentLogApplicationId

    // Make a variable and give it the value from 'how-many-balls'
    var appType = req.session.data['appType']

    if (appType == "app_0102") {
      res.redirect('/staff-latest/applications/log/new-social-pin-contact/application-details')
    }
    else if (appType == "app_0101") {
      res.redirect('/staff-latest/applications/log/new-official-pin-contact/application-details')
    }
    else if (appType == "app_0103") {
      res.redirect('/staff-latest/applications/log/emergency-pin-credit/application-details')
    }
    else if (appType == "app_0104") {
      res.redirect('/staff-latest/applications/log/remove-pin-phone-contact/application-details')
    }
    else if (appType == "app_0105") {
      res.redirect('/staff-latest/applications/log/supply-pin-contacts/application-details')
    }
    else if (appType == "app_0106") {
      res.redirect('/staff-latest/applications/log/swap-vos-pin-credit/application-details')
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
  if (!Array.isArray(req.session.data.sessionApplications)) {
    req.session.data.sessionApplications = []
  }

  const newApplication = {
    app_id: 'app-' + Date.now(),
    app_type: req.session.data.app_type || 'New application',
    owner: req.session.data.current_dept || 'Unassigned',
    prisoner_name: req.session.data.prisoner_name || '',
    prisoner_number: req.session.data.prisoner_number || '',
    messages: [],
    date_received: 0,
    status: 'New',
    decision: '',
    priority: req.session.data.priority === 'first-night' ? 'fnc' : ''
  }

  req.session.data.sessionApplications.unshift(newApplication)

  res.render('staff-latest/applications/new/confirmation')
})

router.get('/staff-latest/applications/log/confirmation', function (req, res) {
  addLoggedApplicationToSession(req)
  res.render('staff-latest/applications/log/confirmation')
})

router.post('/staff-latest/applications/view/app/messages', function (req, res) {
  const newMessage = req.body.newMessage
  const appId = req.query.url_id

  if (!req.session.data.staffMessages) {
    req.session.data.staffMessages = {}
  }

  if (!req.session.data.staffMessages[appId]) {
    req.session.data.staffMessages[appId] = []
  }

  if (newMessage && newMessage.trim() !== '') {
    const formattedDate = getFormattedNow()

    req.session.data.staffMessages[appId].push({
      from: 'J. Smith',
      text: newMessage.trim(),
      date: formattedDate
    })
  }

  res.redirect('/staff-latest/applications/view/app/messages?url_id=' + appId)
})

router.get('/staff-latest/applications/view/app/mark-in-progress', function (req, res) {
  const appId = req.query.url_id

  if (req.session.data.staffAppsDB) {
    for (var i = 0; i < req.session.data.staffAppsDB.length; i++) {
      if (String(req.session.data.staffAppsDB[i].app_id) === appId) {
        req.session.data.staffAppsDB[i].status = 'In progress'
        break
      }
    }
  }

  res.redirect('/staff-latest/applications/view/app/application?url_id=' + appId)
})

router.get('/staff-latest/applications/view/new/mark-in-progress', function (req, res) {
  req.session.data.newAppStatus = 'In progress'
  res.redirect('/staff-latest/applications/view/new/application')
})

router.post('/staff-latest/applications/view/new/messages', function (req, res) {
  const newMessage = req.body.newMessage

  if (!req.session.data.newFlowMessages) {
    req.session.data.newFlowMessages = []
  }

  if (newMessage && newMessage.trim() !== '') {
    const formattedDate = getFormattedNow()

    req.session.data.newFlowMessages.push({
      from: 'J. Smith',
      text: newMessage.trim(),
      date: formattedDate
    })
  }

  res.redirect('/staff-latest/applications/view/new/messages')
})

router.post('/staff-latest/applications/view/new/comments', function (req, res) {
  const newComment = req.body.newComment

  if (!req.session.data.newFlowComments) {
    req.session.data.newFlowComments = []
  }

  if (newComment && newComment.trim() !== '') {
    const formattedDate = getFormattedNow()

    req.session.data.newFlowComments.push({
      from: 'J. Smith',
      text: newComment.trim(),
      date: formattedDate
    })
  }

  res.redirect('/staff-latest/applications/view/new/comments')
})

router.post('/staff-latest/applications/view/new/forward', function (req, res) {
  const selectedDepartment = req.body.departmentFilter || req.body.appDept
  const forwardReasons = req.body.forwardReasons
  const departmentName = resolveDepartmentName(req.session.data, selectedDepartment)

  if (departmentName) {
    req.session.data.appDept = departmentName
  }

  const currentLogId = req.session.data.currentLogApplicationId
  if (currentLogId && Array.isArray(req.session.data.sessionApplications) && departmentName) {
    for (let i = 0; i < req.session.data.sessionApplications.length; i++) {
      const app = req.session.data.sessionApplications[i]
      if (String(app.app_id) === String(currentLogId)) {
        req.session.data.sessionApplications[i].owner = departmentName
        break
      }
    }
  }

  if (forwardReasons && forwardReasons.trim() !== '') {
    req.session.data.forwardReasons = forwardReasons.trim()

    if (!req.session.data.newFlowComments) {
      req.session.data.newFlowComments = []
    }

    req.session.data.newFlowComments.push({
      from: 'J. Smith',
      text: 'Forwarded to ' + (departmentName || selectedDepartment) + ': ' + forwardReasons.trim(),
      date: getFormattedNow()
    })
  }

  res.redirect('/staff-latest/applications/view/new/application')
})

router.post('/staff-latest/applications/view/app/forward', function (req, res) {
  const appId = req.query.url_id
  const newDept = req.body.appDept
  const forwardReasons = req.body.forwardReasons

  if (req.session.data.staffAppsDB && newDept) {
    for (var i = 0; i < req.session.data.staffAppsDB.length; i++) {
      if (String(req.session.data.staffAppsDB[i].app_id) === appId) {
        req.session.data.staffAppsDB[i].owner = newDept
        break
      }
    }
  }

  // Add forwarding reason as a staff comment.
  if (forwardReasons && forwardReasons.trim() !== '') {
    if (!req.session.data.staffComments) {
      req.session.data.staffComments = {}
    }
    if (!req.session.data.staffComments[appId]) {
      req.session.data.staffComments[appId] = []
    }

    req.session.data.staffComments[appId].push({
      from: 'J. Smith',
      text: 'Forwarded to ' + newDept + ': ' + forwardReasons.trim(),
      date: getFormattedNow()
    })
  }

  res.redirect('/staff-latest/applications/view/app/application?url_id=' + appId)
})

router.post('/staff-latest/applications/view/app/comments', function (req, res) {
  const appId = req.query.url_id
  const newComment = req.body.newComment

  if (!req.session.data.staffComments) {
    req.session.data.staffComments = {}
  }

  if (!req.session.data.staffComments[appId]) {
    req.session.data.staffComments[appId] = []
  }

  if (newComment && newComment.trim() !== '') {
    req.session.data.staffComments[appId].push({
      from: 'J. Smith',
      text: newComment.trim(),
      date: getFormattedNow()
    })
  }

  res.redirect('/staff-latest/applications/view/app/comments?url_id=' + appId)
})

router.post('/staff-latest/applications/view/app/action', function (req, res) {
  const appId = req.body.url_id
  const decision = req.body.actionRespond
  const reason = req.body.decisionReason

  if (req.session.data.staffAppsDB && decision) {
    for (var i = 0; i < req.session.data.staffAppsDB.length; i++) {
      if (String(req.session.data.staffAppsDB[i].app_id) === appId) {
        req.session.data.staffAppsDB[i].status = 'Closed'
        req.session.data.staffAppsDB[i].decision = decision
        req.session.data.staffAppsDB[i].decision_reason = reason || ''
        break
      }
    }
  }

res.redirect('/staff-latest/applications/view/app/application?url_id=' + appId)
})

}
