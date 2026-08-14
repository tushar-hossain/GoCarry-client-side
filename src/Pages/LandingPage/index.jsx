import Banner from "./Components/Banner_Slider";
import BrandsClient from "./Components/Brands_Client";
import HowItWorks from "./Components/HowItWorks";
import OurServices from "./Components/OurServices";

const Home = () => {
  return (
    <div>
      <div className="my-10">
        <Banner />
      </div>
      <div className="my-10">
        <HowItWorks />
      </div>
      <div className="my-10">
        <OurServices />
      </div>
      <div className="my-10">
        <BrandsClient />
      </div>
    </div>
  );
};

export default Home;
