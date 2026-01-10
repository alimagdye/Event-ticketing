export const extractDateTime = (input) => {
  
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

  const get = (type) => parts.find(p => p.type === type)?.value;

  const extractedDate = `${get("year")}-${get("month")}-${get("day")}`;
  const extractedTime = `${get("hour")}:${get("minute")}`;

  return {
    date: extractedDate,
    time: extractedTime,
  };
};


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


  // for (const session of eventSessions) {
  //   const {startday ,startmonth , startyear}= extractDateParts(session.startDate);
  //   const {endday ,endmonth , endyear}= extractDateParts(session.endDate);
  //   firstDay = startday;
  //   lastDay = endday;
  // }

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
