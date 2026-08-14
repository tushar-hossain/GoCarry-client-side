import Banner from "./Components/Banner_Slider";
import HowItWorks from "./Components/HowItWorks";
import OurServices from "./Components/OurServices";

const Home = () => {
  return (
    <div>
      <div className="mt-8">
        <Banner />
      </div>
      <div>
        <HowItWorks />
      </div>
      <div>
        <OurServices />
      </div>
    </div>
  );
};

export default Home;
