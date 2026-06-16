let mvpGroupsTypes          = require('./mvp_groups_types.json')
let appGroupsTypes          = require('./app_groups_types.json')
let mvpsDB                  = require('./mvp-apps-db.json')
let prisonerAppsDBRaw       = require('./prisoner-apps-db.json')
let staffAppsDB             = require('./staff-apps-db.json')
let addresses               = require('./addresses.json')
let socialRelationships     = require('./social_relationships.json')
let officialRelationships   = require('./legal_relationships.json')
let departments             = require('./departments.json')

const firstName = 'Sam'
const lastName = 'Taylor'
const prisonerDisplayName = `${lastName}, ${firstName}`

let prisonerAppsDB = prisonerAppsDBRaw.map(function (app) {
	if (!Array.isArray(app.messages)) {
		return app
	}

	return {
		...app,
		messages: app.messages.map(function (message) {
			if (String(message.sender || '').toLowerCase() === 'prisoner') {
				return {
					...message,
					sender: prisonerDisplayName
				}
			}

			return message
		})
	}
})

module.exports = {

// Json data
mvpGroupsTypes,
mvpsDB,
appGroupsTypes,
prisonerAppsDB,
staffAppsDB,
addresses,
socialRelationships,
officialRelationships,
departments,

// Prisoner Data
"first-name": firstName,
"last-name": lastName,
"prison-number": "G5829VO"
}
