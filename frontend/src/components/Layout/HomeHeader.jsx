import HeroSection from "../UI/HeroSection";
import NavigationBar from "./NavigationBar";

function HomeHader() {
    return ( <div className="font-display  flex flex-col "  style={{background:`linear-gradient(rgb(187 82 224 / 42%) 20%, rgb(255 73 181 / 68%)) , url('images/HeroSection.png')`,backgroundSize:`cover`}}>
        
        
        <NavigationBar backGround="transparent" />
        
        <HeroSection />

    </div>
     );
}

export default HomeHader;