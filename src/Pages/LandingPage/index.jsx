import Banner from "./Components/Banner_Slider";
import HowItWorks from "./Components/HowItWorks";

const Home = () => {
  return (
    <div>
      <div className="mt-8">
        <Banner />
      </div>
      <div>
        <HowItWorks />
      </div>
    </div>
  );
};

export default Home;
