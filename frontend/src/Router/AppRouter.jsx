import { BrowserRouter, Route, Routes } from "react-router-dom";

import CreateEventBasics from "../pages/organizer/CreateEventBasics";
import CreateEventBanner from "../pages/organizer/CreateEventBanner";
import CreateEventTickets from "../pages/organizer/CreateEventTickets";
import GoogleCallback from "../pages/Auth/GoogleAuthCallback";
import { EventFormProvider } from "../Context/EventPovider";
import CreateEventReview from "../pages/organizer/CreateEventReview";
import LoginPage from "../pages/Auth/LoginPage";
import SignUpPage from "../pages/Auth/SignUpPage";
import OTPVerificationPage from "../pages/Auth/OTPVerificationPage";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import BackToLogin from "../pages/Auth/BackToLogin";
import CompleteResister from "../pages/onboarding/CompleteRegister";
import ResetPassword from "../pages/Auth/ResetPassword";
import LocationSelection from "../pages/onboarding/LocationSelectionPage";
import PreferenceSelection from "../pages/onboarding/PreferenceSelection";
import PersonlityinfoQ from "../pages/onboarding/Personlityinfo";
import Onboarding from "../components/Layout/Onbording";
import HomePage from "../pages/HomePage";
import EventPage from "../pages/Events/EventPage";
import NavigationBar from "../components/Layout/NavigationBar";
import Footer from "../components/Layout/Footer";
import OtherEventsSlider from "../components/Layout/OtherEventsSlider";
import OrganizerDashboard from "../pages/organizer/dashboard/OrganizerDashboard";
import PayTicketsPage from "../pages/payment/PayTickets";
import PaymanetConfirmationPage from "../pages/payment/PaymentConfiermation";
import PaymentSuccessPage from "../pages/payment/PaymentSuccess";
import PaymentCancelPage from "../pages/payment/PaymentCancel";
import UnauthorizedPage from "../pages/Unauthorized";
import OrganizerOverviewPage from "../pages/organizer/dashboard/OrganizerOverview";
import OrganizerAnalyticsPage from "../pages/organizer/dashboard/OrganizerAnalytics";
import OrganizerEventsPage from "../pages/organizer/dashboard/OrganizerEvents";
import OrganizerAttendeeInsightsPage from "../pages/organizer/dashboard/OrganizerAttendeeInsights";
import UpdateEvent from "../pages/organizer/updateEvent/UpdateEvent";
import ConfermNewsletter from "../pages/newsletter/ConfermationNewsletter";
import AlreadySubscribedNewsletter from "../pages/newsletter/AlreadySubscribedNewsletter";
import FailedNewsletter from "../pages/newsletter/FailedNewsletter";
import ProtectedRoutes from "./ProtectedRoutes";
import EventsPagination from "../pages/Events/EventsPagenation";
import NotFoundPage from "../pages/NotFoundPage";

function AppRouter() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          <Route
            path="/unauthorized"
            element={
              <>
                <NavigationBar />
                  <UnauthorizedPage />
                <Footer />
              </>
            }
          />

          <Route
            path="/onboarding/location-selection"
            element={
              <Onboarding stepNo={2} pageTitle="Location Selection">
                <LocationSelection />
              </Onboarding>
            }
          />
          <Route
            path="/onboarding/preference-selection"
            element={
              <Onboarding stepNo={3} pageTitle="Preference Selection">
                <PreferenceSelection />
              </Onboarding>
            }
          />
          <Route
            path="/onboarding/personality-info"
            element={
              <Onboarding stepNo={1} pageTitle="Personality Information">
                <PersonlityinfoQ />
              </Onboarding>
            }
          />

          <Route path="/completed" element={<CompleteResister />} />
          <Route
            path="/forget-password/get-email"
            element={<ForgetPassword />}
          />
          <Route path="/forget-password/back" element={<BackToLogin />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/events/:slug"
            element={
              <>
                <NavigationBar />
                <EventPage />
                <OtherEventsSlider />
                <Footer />
              </>
            }
          />
          <Route
            path="/events-pagenation"
            element={
              <>
                <NavigationBar />
                <EventsPagination />
                <Footer />
              </>
            }
          />
          {/* <Route path="/organizer/dashboard" element={<OrganizerDashboard />} /> */}
          <Route
            path="/organizer/dashboard/overview"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <OrganizerDashboard page="overview" title="Overview">
                  <OrganizerOverviewPage />
                </OrganizerDashboard>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/dashboard/events"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <OrganizerDashboard page="events" title="Events">
                  <OrganizerEventsPage />
                </OrganizerDashboard>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/dashboard/analytics"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <OrganizerDashboard page="analytics" title="Analytics">
                  <OrganizerAnalyticsPage />
                </OrganizerDashboard>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/dashboard/attendee-insights"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <OrganizerDashboard
                  page="attendee-insights"
                  title="Attendee Insights"
                >
                  <OrganizerAttendeeInsightsPage />
                </OrganizerDashboard>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/create-event/basics"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <EventFormProvider>
                  <CreateEventBasics />
                </EventFormProvider>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/create-event/banner"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <EventFormProvider>
                  <CreateEventBanner />
                </EventFormProvider>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/create-event/ticket"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <EventFormProvider>
                  <CreateEventTickets />
                </EventFormProvider>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/create-event/review"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <EventFormProvider>
                  <CreateEventReview />
                </EventFormProvider>
              </ProtectedRoutes>
            }
          />
          <Route
            path="/organizer/update-event"
            element={
              <ProtectedRoutes Roles={["organizer"]}>
                <EventFormProvider>
                  <UpdateEvent />
                </EventFormProvider>
              </ProtectedRoutes>
            }
          />

          <Route
            path="/newsletter/confermation"
            element={<ConfermNewsletter />}
          />
          <Route
            path="/newsletter/already-subscribed"
            element={<AlreadySubscribedNewsletter />}
          />
          <Route path="/newsletter/failuer" element={<FailedNewsletter />} />

          <Route
            path="/payment/tickets"
            element={
              <ProtectedRoutes Roles={["organizer", "user"]}>
                <PayTicketsPage />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/payment/confirmation"
            element={
              <ProtectedRoutes Roles={["organizer", "user"]}>
                <PaymanetConfirmationPage />
              </ProtectedRoutes>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />

          <Route path="/google/callback" element={<GoogleCallback />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRouter;
