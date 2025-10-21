# Sprint Goal
## Features:

1. Complete Authentication (sign in/ sign up).
2. User Onboarding.
   Duration: 4 days at least, 7 days at most.
   Goal: Enable new users (attendees) to sign up using Gmail or verified non-temporary email, choose preferences & city of living and store this data correctly.


# 1. Gmail / Social Sign-Up Integration
## Responsible: Ali Magdy
### Tasks:
   - Implement Google OAuth for sign in/sign up.
   - Configure Google Cloud credentials (Client ID and Secret).
   - On successful authentication, create or find the user in PostgreSQL via Prisma.
   - Return a signed JWT for session management.
   - (Optional) Add a refresh token mechanism if time permits.
   - Add rate limit.
### Deliverables:
   - /api/v1/auth/google endpoint implemented.
   - User model includes a new googleId field.
   - Functionality tested locally using Postman.
   - Document the API all possible requests/ responses for the front-end.
### Deadline: 4 days

# 2. Email + Verification Code sign up/ sign in
## Responsible: Mohammed Ashraf
### Tasks:
   - Build the /api/auth/signup endpoint.
   - Generate and send a 1 time 6-digit verification code for limited time.
   - Add rate limit.
   - Implement /api/auth/verify endpoint to confirm verification codes.
   - Upon successful verification, mark the email as verified and issue a JWT token.
### Deliverables:
   - Implement /api/v1/auth/verify endpoint to confirm verification codes.
   - Build the /api/v1/auth/signup endpoint.
   - Build the /api/v1/auth/signin endpoint.
   - Document the API all possible requests/ responses for the front-end.
### Deadline: 4 days

# 3. User Preferences & Living City
## Responsible: Mohamed Hesham
### Tasks:
   - Create the following tables:
   - Preferences (id, name)
   - UserPreferences (userId, preferenceId)
   - Cities (id, name, nearbyCities)
   - Build endpoints:
   - /api/v1/user/preferences (POST)
   - /api/v1/user/city (POST)
   - Search and seed data for Egyptian cities: Cairo, Giza, Alexandria, Mansoura, Tanta, Assiut, Luxor, Aswan, etc and their locations.
   - Implement basic logic to find nearest cities according to a given city (city the attendee lives in). use this code:
   ```
   if (distance <= 50) cityStatus = "very near";
   else if (distance <= 150) cityStatus = "near";
   else if (distance <= 300) cityStatus = "moderately far";
   else cityStatus = "far";
   ```
   note distance is in KM, we only want very near, and near cities. Also may be a city doesn’t have any near city.
### Deliverables:
   - Database seeded with initial data.
   - APIs tested successfully using Postman.
   - Nearest events logic stub ready.
   - (optional) if you found more time try to add forget my password functionality to task 2.
### Deadline: 4 days

# 4. Frontend: Sign-Up & Preferences Flow
## Responsible: Amr Khalid
### Tasks:
   - Develop Sign-Up Page:
   - **Continue with Gmail** button (Google OAuth)
   - **Continue with Email** form (email input → verification → code entry)
   - Build Preference & City Selection Page (displayed after sign-up):
   - Multi-select for user preferences.
   - City dropdown (auto-fill by region).
   - Integrate with backend APIs using Axios or Fetch.
   - Ensure smooth transitions between all sign-up steps (try to make them on the same screen, and provide back in steps button).
### Deliverables:
   - Fully functional sign-up and preferences UI flow.
   - Proper integration with backend endpoints.
   - Tested for smooth user experience.
### Deadline: Day 6

## Additional Notes:

1. the user can’t create an account until he completes the sign up and the onboarding (completing the preference, location).

2. Any questions should be in a meeting.
