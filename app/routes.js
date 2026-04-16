//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const path = require('path')
const fs = require('fs')

// Add your routes here



// API routes with error handling
router.get('/api/applications', function (req, res) {
  try {
    const dataPath = path.join(__dirname, 'data','prisoner-apps-db.json')
    console.log('Loading applications from:', dataPath)
    console.log('File exists:', fs.existsSync(dataPath))
    
    if (!fs.existsSync(dataPath)) {
      console.error('Applications data file not found at:', dataPath)
      return res.status(404).json({ 
        error: 'Applications data file not found',
        path: dataPath 
      })
    }
    
    // Read the raw file content first
    const rawData = fs.readFileSync(dataPath, 'utf8')
    console.log('Raw file size:', rawData.length)
    console.log('First 100 characters:', rawData.substring(0, 100))
    
    // Try to parse the JSON
    const data = JSON.parse(rawData)
    console.log('Parsed successfully, array length:', data.length)
    
    res.json(data)
  } catch (error) {
    console.error('Detailed error loading applications:', error)
    res.status(500).json({ 
      error: 'Failed to load applications data', 
      details: error.message,
      stack: error.stack 
    })
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

router.get('/api/application-types', function (req, res) {
  try {
    const dataPath = path.join(__dirname, 'data', 'general_apps_types.json')
    console.log('Loading application types from:', dataPath)
    
    if (!fs.existsSync(dataPath)) {
      console.error('Application types data file not found, returning empty array')
      return res.json([])
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
    res.json(data)
  } catch (error) {
    console.error('Error loading application types:', error)
    res.status(500).json({ 
      error: 'Failed to load application types data', 
      details: error.message 
    })
  }
})

router.get('/staff-latest/applications/new/confirmation', function (req, res) {
  // Session data should already be set from form submission
  req.session.data.pageName = 'submitted' // Ensure it's marked as submitted
  
  console.log('Confirmation page accessed, session data:', req.session.data)
  
  res.render('staff-latest/applications/new/confirmation')
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