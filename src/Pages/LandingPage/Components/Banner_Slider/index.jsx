import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BannerImag1 from "/assets/banner/banner1.png";
import BannerImag2 from "/assets/banner/banner2.png";
import BannerImag3 from "/assets/banner/banner3.png";

const Banner = () => {
  return (
    <Carousel infiniteLoop={true} autoPlay={true} showThumbs={false}>
      <div>
        <img src={BannerImag1} />
      </div>
      <div>
        <img src={BannerImag2} />
      </div>
      <div>
        <img src={BannerImag3} />
      </div>
    </Carousel>
  );
};

export default Banner;
