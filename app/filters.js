//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('govDate', (x) => {
    const date = new Date();
    date.setDate(date.getDate() + x);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
});

addFilter('getDate', (x) => {
    const date = new Date();
    date.setDate(date.getDate() + x);

    const days = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ];

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
});