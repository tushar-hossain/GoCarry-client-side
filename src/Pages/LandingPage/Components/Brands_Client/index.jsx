import Marquee from "react-fast-marquee";

function BrandsClient() {
  return (
    <div className="py-10">
      <Marquee speed={40}>
        <div className="mx-10 text-2xl font-bold">Amazon</div>
        <div className="mx-10 text-2xl font-bold">Brand 2</div>
        <div className="mx-10 text-2xl font-bold">Brand 3</div>
      </Marquee>
    </div>
  );
}

export default BrandsClient;
