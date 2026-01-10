export default function OrganizerAttendeeInsightsPage() {
  // Mock data (بعد كده هتيجي من API)
  const attendees = [
    {
      id: 1,
      username: "Ahmed Ali",
      gender: "Male",
      age: 26,
      location: "Cairo",
      eventName: "Tech Summit 2026",
    },
    {
      id: 2,
      username: "Sara Mohamed",
      gender: "Female",
      age: 23,
      location: "Alexandria",
      eventName: "Marketing Meetup",
    },
    {
      id: 3,
      username: "Omar Hassan",
      gender: "Male",
      age: 31,
      location: "Giza",
      eventName: "Startup Bootcamp",
    },
    {
      id: 4,
      username: "Omar Hassanss",
      gender: "Male",
      age: 31,
      location: "Giza",
      eventName: "Startup Bootcamp",
    },
    {
      id: 5,
      username: "Omar Hassan",
      gender: "Male",
      age: 31,
      location: "Giza",
      eventName: "Startup Bootcamp",
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Attendees</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100  text-center">
              <th className="p-4">Username</th>
              <th className="p-4">Gender</th>
              <th className="p-4">Age</th>
              <th className="p-4">Location</th>
              <th className="p-4">Event</th>
            </tr>
          </thead>

          <tbody>
            {attendees.map((attendee) => (
              <tr
                key={attendee.id}
                className={`border-t ${attendee.id % 2 === 0 ? "bg-blue-50" : ""} hover:bg-gray-100 text-center`}
              >
                <td className="p-4 font-medium">
                  {attendee.username}
                </td>
                <td className="p-4">{attendee.gender}</td>
                <td className="p-4">{attendee.age}</td>
                <td className="p-4">{attendee.location}</td>
                <td className="p-4">{attendee.eventName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
