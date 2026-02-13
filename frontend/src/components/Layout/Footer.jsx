import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Twitter, CheckCircleIcon } from "lucide-react";
import { useCategories } from "../../Context/CategoriesProvider";
import { useState } from "react";
import { subscribeToNewsletter } from "../../APIs/newsletterAPIs";
import Loading from "./LoadingLayout";

export default function Footer() {
  const {categories} = useCategories();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsLetterLanguage, setNewsletterLanguage] = useState('en');
  const [newsletterError, setNewsletterError] = useState(null);
  const[validEmail , setValidEmail] = useState(false);
  const [validSubscribe, setValidSubscribe] = useState(false);
  const [loading, setloading] = useState(false);
  const validatenewsletterEmail = (email) => {
    setNewsletterEmail(email);

    if (!email) {
      // setNewsletterError("Email is required");
     return setValidEmail(false);}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      // setNewsletterError("Invalid email format email should contain latters And  @ And . ");      
      return setValidEmail(false);
    }

    return setValidEmail(emailRegex.test(email));
  }
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      setNewsletterError("Email is required");
      return;
    }
    if (!newsLetterLanguage) {
      setNewsletterError("Language is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(newsletterEmail)){
      setNewsletterError("Invalid email format email should contain latters And  @ And . ");      
      return;
    }
    try {
      setloading(true);
      const response = await subscribeToNewsletter(newsletterEmail, newsLetterLanguage);
      // console.log("Success:", response.data);
      setNewsletterError(null);
      setValidSubscribe(true);
    } catch (err) {
      console.error("Error:", err);
      const message = err.response?.data?.error || "Something went wrong";
      setNewsletterError(message);
    }finally{
      setloading(false);
    }
  };

  return (
    <footer className="bg-[#B84DD6] text-white pt-14 pb-8  px-6 mt-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">

        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">Company Info</h3>
          <ul className="space-y-2 text-white/90">
            <li><Link to="" className="hover:text-white">About Us</Link></li>
            <li><Link to="" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="" className="hover:text-white">Careers</Link></li>
            <li><Link to="" className="hover:text-white">FAQs</Link></li>
            <li><Link to="" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">Help</h3>
          <ul className="space-y-2 text-white/90">
            <li><Link to="" className="hover:text-white">Account Support</Link></li>
            <li><Link to="" className="hover:text-white">Listing Events</Link></li>
            <li><Link to="" className="hover:text-white">Event Ticketing</Link></li>
            <li><Link to="" className="hover:text-white">Ticket Purchase Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">Categories</h3>
          <ul className="space-y-2 text-white/90">
            {categories.length <5 ? categories.map((category) => (
              <li key={category.name}><Link to={`/events?category=${category.name}`} className="hover:text-white">{category.name}</Link></li>
            )):
              <li><Link to="/categories" className="hover:text-white font-semibold text-xl ">All Categories</Link></li>
            }
            {/* <li><Link to="" className="hover:text-white">Arts & Culture</Link></li>
            <li><Link to="" className="hover:text-white">Business & Professional</Link></li>
            <li><Link to="" className="hover:text-white">Student & University</Link></li>
            {/* <li><Link to="" className="hover:text-white">Workshops & Training Programs</Link></li>
            <li><Link to="" className="hover:text-white">Exhibitions & Trade Shows</Link></li>
            <li><Link to="" className="hover:text-white">Religious & Cultural Gatherings</Link></li>
            <li><Link to="" className="hover:text-white">Fitness & Lifestyle</Link></li>
            <li><Link to="" className="hover:text-white">Community & Charity Events</Link></li>
            <li><Link to="" className="hover:text-white">Book & Culture Fairs</Link></li> */}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">Follow Us</h3>
          <div className="flex flex-col space-y-3 text-white/90">
            <a href="https://facebook.com" target="_blank" className="flex items-center gap-2 hover:text-white">
              <Facebook size={18} /> Facebook
            </a>
            <a href="https://instagram.com" target="_blank" className="flex items-center gap-2 hover:text-white">
              <Instagram size={18} /> Instagram
            </a>
            <a href="https://twitter.com" target="_blank" className="flex items-center gap-2 hover:text-white">
              <Twitter size={18} /> X (Twitter)
            </a>
            <a href="https://youtube.com" target="_blank" className="flex items-center gap-2 hover:text-white">
              <Youtube size={18} /> Youtube
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-lg mb-4 underline underline-offset-8">Newsletter</h3>
          <p className="text-white/90 mb-4">
            Stay updated with the latest events
          </p>

          <div className="flex flex-col items-center   gap-2">
            
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e)=>validatenewsletterEmail(e.target.value)}
              className="  bg-white rounded-lg mb-6 p-10 w-full h-12 text-black placeholder-gray-400 placeholder:overflow-hidden outline-none px-3 py-2 mr-2"
            />
            {/* language ratio */}
            {validEmail && <div className=" text-lg mb-4 w-full flex items-center justify-between">
              language: <br />
              <input type="radio" id="en" name="language" value="en" className="ml-4 mr-1" onChange={(e)=>setNewsletterLanguage(e.target.value)}  />
              <label htmlFor="en" className="mr-4">English</label>
              <input type="radio" id="ar" name="language" value="ar" className="ml-4 mr-1" onChange={(e)=>setNewsletterLanguage(e.target.value)} />
              <label htmlFor="ar">Arabic</label>
            </div>}
            {newsletterError && <p className="text-red-500">{newsletterError}</p>}
            <button type="submit" className={` h-fit w-40 text-white font-semibold px-4 py-3 rounded-md flex justify-center items-center gap-2 ${validSubscribe? 'bg-green-600 cursor-not-allowed':'bg-secandry hover:cursor-pointer'}`} disabled={validSubscribe} onClick={handleSubscribe}>
             {validSubscribe? 'Email Sent  ' : 'Subscribe'} {validSubscribe && <CheckCircleIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-6  border-t border-white/20 text-center text-white/80">
        © {new Date().getFullYear()} Fa3liat. All rights reserved.
      </div>
      {loading && <Loading />}
    </footer>
  );
}
