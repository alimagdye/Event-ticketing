
const EventErrors = Object.freeze({
    EVENT_NOT_FOUND: 'The specified event was not found.',
    EVENT_ALREADY_EXISTS: 'An event with the given identifier already exists.',
    INVALID_EVENT_DATE: 'The event date provided is invalid.',
    EVENT_CREATION_FAILED: 'Failed to create the event. Please try again.',
    EVENT_UPDATE_FAILED: 'Failed to update the event. Please try again.',
    EVENT_DELETION_FAILED: 'Failed to delete the event. Please try again.',
    EVENT_REGISTRATION_CLOSED: 'Registration for this event is closed.',
    EVENT_CAPACITY_FULL: 'The event has reached its maximum capacity.',
    UNAUTHORIZED_EVENT_ACCESS: 'You are not authorized to access this event.',
    INVALID_EVENT_STATUS: 'The event status provided is invalid.',
});


export default EventErrors;