import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const calculateDeliveryCost = ({ parcelType, destination, weight }) => {
  const isWithinCity = destination === "within-city";

  if (parcelType === "document") {
    return isWithinCity ? 60 : 80;
  }

  const parcelWeight = Number(weight);

  if (!parcelWeight || parcelWeight <= 0) {
    return 0;
  }

  if (parcelWeight <= 3) {
    return isWithinCity ? 110 : 150;
  }

  const basePrice = isWithinCity ? 110 : 150;
  const extraWeight = parcelWeight - 3;
  const extraCharge = extraWeight * 40;

  return basePrice + extraCharge;
};

export default function Pricing() {
  const [parcelType, setParcelType] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState(0);

  const handleCalculate = () => {
    if (!parcelType || !destination) {
      return;
    }

    const calculatedPrice = calculateDeliveryCost({
      parcelType,
      destination,
      weight,
    });

    setPrice(calculatedPrice);
  };

  const handleReset = () => {
    setParcelType("");
    setDestination("");
    setWeight("");
    setPrice(0);
  };

  return (
    <section className="bg-[#EEF0F1] px-4 py-6 sm:px-6 lg:px-8">
      <div className="md:max-w-6xl mx-auto py-5 bg-white rounded-lg p-5 sm:p-7 lg:px-9 lg:py-8">
        <div className="border-b border-[#E5E7EB] pb-3">
          <h2 className="text-[25px] font-bold leading-tight tracking-[-0.7px] text-[#03373D]">
            Pricing Calculator
          </h2>
        </div>

        <div className="mt-4">
          <h3 className="text-center text-[18px] font-bold text-[#03373D] sm:text-[20px]">
            Calculate Your Cost
          </h3>

          <div className="mx-auto mt-6 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className="mx-auto w-full max-w-63.5 space-y-3">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                  Parcel type
                </label>

                <Select value={parcelType} onValueChange={setParcelType}>
                  <SelectTrigger className="h-7.5 w-full rounded-md border-[#D9E0E5] bg-white text-[10px] text-[#A1A1AA] focus:ring-1 focus:ring-[#CAEB66]">
                    <SelectValue placeholder="Select Parcel type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="document" className="text-[10px]">
                      Document
                    </SelectItem>

                    <SelectItem value="non-document" className="text-[10px]">
                      Non-Document
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                  Delivery Destination
                </label>

                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-7.5 w-full rounded-md border-[#D9E0E5] bg-white text-[10px] text-[#A1A1AA] focus:ring-1 focus:ring-[#CAEB66]">
                    <SelectValue placeholder="Select Delivery Destination" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="within-city" className="text-[10px]">
                      Within City
                    </SelectItem>

                    <SelectItem value="outside-city" className="text-[10px]">
                      Outside City
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-[#18181B]">
                  Weight (KG)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={parcelType === "document"}
                  placeholder="Weight"
                  className="h-7.5 w-full rounded-md border border-[#D9E0E5] bg-white px-2 text-[10px] text-[#18181B] outline-none placeholder:text-[#A1A1AA] focus:border-[#CAEB66] disabled:bg-[#F5F5F5]"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-7.5 w-16 cursor-pointer rounded-md border border-[#B8CE6A] bg-white text-[9px] font-medium text-[#58701B] transition hover:bg-[#F5F9E8]"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="h-7.5 flex-1 cursor-pointer rounded-md bg-[#CAEB66] text-[9px] font-medium text-black transition hover:brightness-95"
                >
                  Calculate
                </button>
              </div>
            </div>

            <div className="flex min-h-37.5 items-center justify-center">
              <div className="flex items-baseline">
                <span className="text-[58px] font-bold leading-none tracking-[-3px] text-black sm:text-[68px]">
                  {price}
                </span>

                <span className="ml-2 text-[34px] font-bold leading-none text-black sm:text-[40px]">
                  Tk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
