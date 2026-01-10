  export  const extractDateTime = (input)=> {
  const dateObj = new Date(input);

  const date = dateObj.toISOString().split("T")[0]; // yyyy-mm-dd
  const time = dateObj.toTimeString().split(" ")[0]; // hh:mm:ss

  return { date, time };
}

export  const extractDateParts=(dateInput)=> {
  const dateObj = new Date(dateInput);

  const day = dateObj.getDate();             // رقم اليوم
  const year = dateObj.getFullYear();        // السنة

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const month = monthNames[dateObj.getMonth()]; // الشهر بالاسم المختصر

  return { day, month, year };
}

export const formatEventSessionDate = (eventSessions = []) => {
  if (!eventSessions.length) return null;

  const session = eventSessions[0];

  if (!session) return null;

  let firstDay;
  let lastDay;


  for (const session of eventSessions) {
    const {startday ,startmonth , startyear}= extractDateParts(session.startDate);
    const {endday ,endmonth , endyear}= extractDateParts(session.endDate);
    firstDay = startday;
    lastDay = endday;
  }

  const start = new Date(session.startDate);
  const end = new Date(session.endDate);

  const startParts = extractDateParts(start);
  const endParts = extractDateParts(end);

  const startTime = start.toTimeString().slice(0, 5); // HH:mm
  const endTime = end.toTimeString().slice(0, 5);     // HH:mm

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
