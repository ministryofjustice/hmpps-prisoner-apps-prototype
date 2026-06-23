//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const path = require('path')
const fs = require('fs')

// Add your routes here

// Clear session data and redirect to home
router.get('/manage-prototype/clear-data', function (req, res) {
  req.session.data = {}
  res.redirect('/')
})

// API routes with error handling
router.get('/api/applications', function (req, res) {
  try {
    if (req.session.data && req.session.data.prisonerAppsDB) {
      return res.json(req.session.data.prisonerAppsDB)
    }

    const dataPath = path.join(__dirname, 'data', 'prisoner-apps-db.json')
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Applications data file not found' })
    }

    const rawData = fs.readFileSync(dataPath, 'utf8')
    const data = JSON.parse(rawData)
    res.json(data)
  } catch (error) {
    console.error('Error loading applications:', error)
    res.status(500).json({ error: 'Failed to load applications data' })
  }
})

router.get('/api/staff-applications', function (req, res) {
  try {
    if (req.session.data && req.session.data.staffAppsDB) {
      return res.json(req.session.data.staffAppsDB)
    }

    const dataPath = path.join(__dirname, 'data', 'staff-apps-db.json')
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'Staff applications data file not found' })
    }

    const rawData = fs.readFileSync(dataPath, 'utf8')
    const data = JSON.parse(rawData)
    res.json(data)
  } catch (error) {
    console.error('Error loading staff applications:', error)
    res.status(500).json({ error: 'Failed to load staff applications data' })
  }
})

router.get('/api/departments', function (req, res) {
  try {
    const dataPath = path.join(__dirname, 'data','departments.json')
    console.log('Loading departments from:', dataPath)
    
    if (!fs.existsSync(dataPath)) {
      console.error('Departments data file not found, using fallback')
      // Provide fallback departments based on your application data
      const fallbackDepartments = [
        {department_id: 'activities', department_name: 'Activities'},
        {department_id: 'business-hub', department_name: 'Business Hub'},
        {department_id: 'governor', department_name: 'Governor'},
        {department_id: 'chaplaincy', department_name: 'Chaplaincy'},
        {department_id: 'education', department_name: 'Education'},
        {department_id: 'healthcare', department_name: 'Healthcare'},
        {department_id: 'omu', department_name: 'OMU'},
        {department_id: 'reception', department_name: 'Reception'},
        {department_id: 'visits', department_name: 'Visits'},
        {department_id: 'gym', department_name: 'Gym'},
        {department_id: 'safer-custody', department_name: 'Safer Custody'}
      ]
      return res.json(fallbackDepartments)
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    res.json(data)
  } catch (error) {
    console.error('Error loading departments:', error)
    res.status(500).json({ 
      error: 'Failed to load departments data', 
      details: error.message 
    })
  }
})

// Add your routes here


require('./routes/prisoner-latest.js')(router);
require('./routes/prisoner-mvp.js')(router);
require('./routes/staff-latest.js')(router);

function addApplicationToSession(req, application) {
  if (!req.session.data.sessionApplications) {
    req.session.data.sessionApplications = []
  }

  req.session.data.sessionApplications.unshift(application)
}

router.get('/staff-latest/applications/view', function (req, res) {
  res.render('staff-latest/applications/view/index', {
    sessionApplications: req.session.data.sessionApplications || []
  })
})

module.exports = router