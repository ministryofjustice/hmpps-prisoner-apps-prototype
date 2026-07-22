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

function parseMessageTimeToMinutes (timeValue) {
	if (!timeValue) {
		return null
	}

	const timeText = String(timeValue).trim().toLowerCase()
	const match = timeText.match(/^(\d{1,2}):(\d{2})(am|pm)?$/)

	if (!match) {
		return null
	}

	let hours = parseInt(match[1], 10)
	const minutes = parseInt(match[2], 10)
	const meridian = match[3]

	if (Number.isNaN(hours) || Number.isNaN(minutes)) {
		return null
	}

	if (meridian === 'am' && hours === 12) {
		hours = 0
	}

	if (meridian === 'pm' && hours < 12) {
		hours += 12
	}

	return (hours * 60) + minutes
}

function parseMessageTimestamp (message) {
	if (!message || typeof message !== 'object') {
		return null
	}

	if (message.datetime) {
		const normalizedDateTime = String(message.datetime)
			.trim()
			.replace(/(\d{1,2})\.(\d{2})$/, '$1:$2')
		const parsedDateTime = Date.parse(normalizedDateTime)

		if (!Number.isNaN(parsedDateTime)) {
			return parsedDateTime
		}
	}

	if (message.date !== undefined && message.date !== null) {
		const relativeDay = Number(message.date)
		if (!Number.isNaN(relativeDay)) {
			const relativeDate = new Date()
			relativeDate.setHours(0, 0, 0, 0)
			relativeDate.setDate(relativeDate.getDate() + relativeDay)

			const minutesFromMidnight = parseMessageTimeToMinutes(message.time)
			if (minutesFromMidnight !== null) {
				relativeDate.setMinutes(minutesFromMidnight)
			}

			return relativeDate.getTime()
		}

		const absoluteDate = Date.parse(String(message.date).trim())
		if (!Number.isNaN(absoluteDate)) {
			const absolute = new Date(absoluteDate)
			const minutesFromMidnight = parseMessageTimeToMinutes(message.time)
			if (minutesFromMidnight !== null) {
				absolute.setHours(0, minutesFromMidnight, 0, 0)
			}

			return absolute.getTime()
		}
	}

	return null
}

function sortMessagesChronologically (messages) {
	if (!Array.isArray(messages)) {
		return messages
	}

	return messages
		.map(function (message, index) {
			return {
				message,
				index,
				timestamp: parseMessageTimestamp(message)
			}
		})
		.sort(function (a, b) {
			if (a.timestamp === null && b.timestamp === null) {
				return a.index - b.index
			}

			if (a.timestamp === null) {
				return 1
			}

			if (b.timestamp === null) {
				return -1
			}

			if (a.timestamp === b.timestamp) {
				return a.index - b.index
			}

			return a.timestamp - b.timestamp
		})
		.map(function (entry) {
			return entry.message
		})
}

let prisonerAppsDB = prisonerAppsDBRaw.map(function (app) {
	if (!Array.isArray(app.messages)) {
		return app
	}

	return {
		...app,
		messages: sortMessagesChronologically(app.messages.map(function (message) {
			if (String(message.sender || '').toLowerCase() === 'prisoner') {
				return {
					...message,
					sender: prisonerDisplayName
				}
			}

			return message
		}))
	}
})

staffAppsDB = staffAppsDB.map(function (app) {
	if (!Array.isArray(app.messages)) {
		return app
	}

	return {
		...app,
		messages: sortMessagesChronologically(app.messages)
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
