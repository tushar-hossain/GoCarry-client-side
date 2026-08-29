import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BannerImag1 from "/assets/banner/banner1.png";
import BannerImag2 from "/assets/banner/banner2.png";
import BannerImag3 from "/assets/banner/banner3.png";

const Banner = () => {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <Carousel
        className="!rounded-none"
        infiniteLoop={true}
        autoPlay={true}
        showThumbs={false}
      >
        <div className="h-[350px]">
          <img className="h-[350px] object-fill" src={BannerImag1} />
        </div>
        <div className="h-[350px]">
          <img className="h-[350px] object-fill" src={BannerImag2} />
        </div>
        <div className="h-[350px]">
          <img className="h-[350px] object-fill" src={BannerImag3} />
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
