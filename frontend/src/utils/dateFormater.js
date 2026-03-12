

/**
 * Extract date and time from an ISO 8601 datetime string.
 * 
 * @param {string} input - an ISO 8601 datetime string.
 * @returns {object} - an object with two properties, date and time, both in the format of "YYYY-MM-DD" and "HH:mm" respectively.
 * @example
 * const input = "2022-01-01T12:30:00.000Z";
 * const result = extractDateTime(input);
 * console.log(result.date); // "2022-01-01"
 * console.log(result.time); // "12:30"
 */
export const extractDateTime = (input) => {
  
  // Remove the 'Z' at the end of the input string to avoid timezone issues
  const realDate = input.replace("Z", "");
  
  const date = new Date(realDate);
  


  const formatter = new Intl.DateTimeFormat("en-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
   
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  // short cut for getting the value of a specific part type
  const get = (type) => parts.find(p => p.type === type)?.value;

  const extractedDate = `${get("year")}-${get("month")}-${get("day")}`;
  const extractedTime = `${get("hour")}:${get("minute")}`;

  return {
    date: extractedDate,
    time: extractedTime,
  };
};


/**
 * Extract day, month and year from a date input.
 * 
 * @param {string|Date} dateInput - a date string or a Date object.
 * @returns {object} - an object with three properties, day, month and year.
 * @example
 * const input = "2022-01-01";
 * const result = extractDateParts(input);
 * console.log(result.day); // 1
 * console.log(result.month); // "Jan"
 * console.log(result.year); // 2022
 */
export  const extractDateParts=(dateInput)=> {
  const dateObj = new Date(dateInput);

  const day = dateObj.getDate();             // رقم اليوم
  const year = dateObj.getFullYear();        // السنة

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = monthNames[dateObj.getMonth()]; // الشهر بالاسم المختصر

  return { day, month, year };
}

/**
 * Format the event session date for display.
 * If the event sessions array is empty, it returns null.
 * If the event sessions array has at least one session, it returns an object with three properties, dateText, startTime and endTime.
 * dateText is a string representing the date of the event session in the format of "Month Day-End Day" if the event session spans multiple days, or "Month Day" if it spans one day.
 * startTime is a string representing the start time of the event session in the format of "HH:mm".
 * endTime is a string representing the end time of the event session in the format of "HH:mm".
 * @param {array} eventSessions - an array of event sessions.
 * @returns {object|null} - an object with three properties, dateText, startTime and endTime, or null if the event sessions array is empty.
 */
export const formatEventSessionDate = (eventSessions = []) => {
  if (!eventSessions.length) return null;

  const session = eventSessions[0];

  if (!session) return null;

  const start = new Date(session.startDate);
  const end = new Date(session.endDate);

  const startParts = extractDateParts(start);
  const endParts = extractDateParts(end);

  const startTime = extractDateTime(session.startDate).time; // HH:mm
  const endTime = extractDateTime(session.endDate).time;     // HH:mm



  // const startTime = start.toTimeString().slice(0, 5); // HH:mm
  // const endTime = end.toTimeString().slice(0, 5);     // HH:mm
  // console.log("startTime", startTime);
  // console.log("endTime", endTime);
  let dateText;

  if (
    startParts.day === endParts.day &&
    startParts.month === endParts.month
  ) {
    // Same day
    dateText = `${startParts.month} ${startParts.day}`;
  } else {
    // Different days
    dateText = `${startParts.month} ${startParts.day}-${endParts.day}`;
  }

  return {
    dateText,
    startTime,
    endTime,
  };
};
