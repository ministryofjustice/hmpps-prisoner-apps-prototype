const staffViewUsers = require('../data/staff-view-users.json')
const appGroupsTypes = require('../data/app_groups_types.json')

module.exports = function (router) {
  function getUser(userId) {
    return staffViewUsers.find(user => user.id === userId || user.name === userId)
  }

  function getAllowedApplicationTypes(user) {
    if (!user) {
      return []
    }

    const allowedAppIds = new Set(user.access_app_ids)

    return Object.values(appGroupsTypes)
      .flatMap(group => group.apps || [])
      .filter(app => allowedAppIds.has(app.app_id))
      .map(app => app.app_type)
  }

  router.get('/sandbox/staff-view/select-user', function (req, res) {
    res.render('sandbox/staff-view/select-user', {
      users: staffViewUsers
    })
  })

  router.post('/sandbox/staff-view/select-user', function (req, res) {
    const selectedUser = getUser(req.body.user)

    if (!selectedUser) {
      return res.status(400).render('sandbox/staff-view/select-user', {
        users: staffViewUsers,
        errorMessage: 'Select a user'
      })
    }

    res.redirect('/sandbox/staff-view/?user=' + encodeURIComponent(selectedUser.id || selectedUser.name))
  })

  router.get('/sandbox/staff-view/', function (req, res) {
    const selectedUser = getUser(req.query.user)
    const allowedApplicationTypes = getAllowedApplicationTypes(selectedUser)

    res.render('sandbox/staff-view/index', {
      sessionApplications: req.session.data.sessionApplications || [],
      selectedUser: selectedUser,
      allowedApplicationTypes: allowedApplicationTypes
    })
  })
}
