import Banner from "./Components/Banner_Slider";
import BrandsClient from "./Components/Brands_Client";
import CustomerTestimonials from "./Components/Customertestimonials";
import HowItWorks from "./Components/HowItWorks";
import MerchantCTA from "./Components/MerchantCTA";
import OurServices from "./Components/OurServices";
import WhyChooseUs from "./Components/WhyChooseUs";

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
      <div className="my-10">
        <WhyChooseUs />
      </div>
      <div className="my-10">
        <MerchantCTA />
      </div>
      <div className="my-10">
        <CustomerTestimonials />
      </div>
    </div>
  );
};

export default Home;
