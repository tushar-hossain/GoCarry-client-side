import Banner from "./Components/Banner_Slider";
import HowItWorks from "./Components/HowItWorks";
import OurServices from "./Components/OurServices";

const Home = () => {
  return (
    <div>
      <div className="my-8">
        <Banner />
      </div>
      <div className="my-8">
        <HowItWorks />
      </div>
      <div className="my-8">
        <OurServices />
      </div>
    </div>
  );
};

export default Home;
