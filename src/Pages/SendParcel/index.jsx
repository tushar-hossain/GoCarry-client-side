import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLoaderData } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Swal from "sweetalert2";

// DELIVERY COST
const calculateDeliveryCost = ({
  parcelType,
  weight,
  senderDistrict,
  receiverDistrict,
}) => {
  const isWithinCity = senderDistrict === receiverDistrict;

  // DOCUMENT
  if (parcelType === "document") {
    return isWithinCity ? 60 : 80;
  }

  // NON-DOCUMENT
  const parcelWeight = Number(weight);

  if (!parcelWeight || parcelWeight <= 0) {
    return 0;
  }

  // Up to 3 KG
  if (parcelWeight <= 3) {
    return isWithinCity ? 110 : 150;
  }

  // More than 3 KG
  const basePrice = isWithinCity ? 110 : 150;

  // Extra weight after 3 KG
  const extraWeight = parcelWeight - 3;

  const extraCharge = extraWeight * 40;

  return basePrice + extraCharge;
};

function FieldError({ message }) {
  if (!message) return null;

  return (
    <p className="mt-1 text-[11px] leading-none text-red-500">{message}</p>
  );
}

function FormField({ label, error, children }) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-[11px] font-medium text-[#18181B]">
        {label}
      </label>

      {children}

      <FieldError message={error?.message} />
    </div>
  );
}

const generateTrackingId = () => {
  const date = new Date()?.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random()?.toString(36).substring(2, 8)?.toUpperCase();

  return `GC-${date}-${random}`;
};

export default function SendParcel() {
  const warehouses = useLoaderData();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parcelType: "document",
      parcelName: "",
      parcelWeight: "",
      senderName: "",
      senderPhone: "",
      senderDistrict: "",
      senderServiceCenter: "",
      senderAddress: "",
      pickupInstruction: "",
      receiverName: "",
      receiverPhone: "",
      receiverDistrict: "",
      receiverServiceCenter: "",
      receiverAddress: "",
      deliveryInstruction: "",
    },
  });

  const parcelType = watch("parcelType");
  const senderDistrict = watch("senderDistrict");
  const receiverDistrict = watch("receiverDistrict");

  // DISTRICTS
  const districts = useMemo(() => {
    return [
      ...new Set(
        warehouses.map((warehouse) => warehouse.district).filter(Boolean),
      ),
    ];
  }, [warehouses]);

  // SENDER SERVICE CENTERS
  const senderServiceCenters = useMemo(() => {
    if (!senderDistrict) {
      return [];
    }

    const warehouse = warehouses.find(
      (warehouse) =>
        warehouse.district?.trim().toLowerCase() ===
        senderDistrict.trim().toLowerCase(),
    );

    return warehouse?.covered_area || [];
  }, [warehouses, senderDistrict]);

  // RECEIVER SERVICE CENTERS
  const receiverServiceCenters = useMemo(() => {
    if (!receiverDistrict) {
      return [];
    }

    const warehouse = warehouses.find(
      (warehouse) =>
        warehouse.district?.trim().toLowerCase() ===
        receiverDistrict.trim().toLowerCase(),
    );

    return warehouse?.covered_area || [];
  }, [warehouses, receiverDistrict]);

  const onSubmit = async (data) => {
    const deliveryCost = calculateDeliveryCost({
      parcelType: data.parcelType,
      weight: data.parcelWeight,
      senderDistrict: data.senderDistrict,
      receiverDistrict: data.receiverDistrict,
    });

    const parcelData = {
      ...data,
      trackingId: generateTrackingId(),
      paymentStatus: "pending",
      deliveryCost,
    };

    const isWithinCity = data.senderDistrict === data.receiverDistrict;

    let basePrice = 0;
    let extraWeight = 0;
    let extraCharge = 0;

    if (data.parcelType === "document") {
      basePrice = isWithinCity ? 60 : 80;
    } else {
      const weight = Number(data.parcelWeight);

      basePrice = isWithinCity ? 110 : 150;

      if (weight > 3) {
        extraWeight = weight - 3;
        extraCharge = extraWeight * 40;
      }
    }

    const result = await Swal.fire({
      title: "Parcel Booking Summary",

      html: `
      <div style="text-align: left; font-size: 13px; color: #71717A;">

        <!-- Parcel Information -->
        <div style="
          background: #F8FAFA;
          border-radius: 10px;
          padding: 12px;
          margin-bottom: 14px;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 7px;
          ">
            <span>Parcel Type</span>
            <strong style="color:#03373D;">
              ${data.parcelType === "document" ? "Document" : "Non-Document"}
            </strong>
          </div>

          ${
            data.parcelType === "non-document"
              ? `
                <div style="
                  display: flex;
                  justify-content: space-between;
                ">
                  <span>Parcel Weight</span>
                  <strong style="color:#03373D;">
                    ${data.parcelWeight} KG
                  </strong>
                </div>
              `
              : ""
          }
        </div>

        <!-- Pricing Breakdown -->
        <div style="
          border-top: 1px solid #E5E7EB;
          padding-top: 12px;
        ">

          <div style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          ">
            <span>
              ${
                isWithinCity
                  ? "Within City Base Charge"
                  : "Outside City Base Charge"
              }
            </span>

            <strong style="color:#03373D;">
              ৳${basePrice}
            </strong>
          </div>

          ${
            data.parcelType === "non-document" && extraCharge > 0
              ? `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 8px;
                ">
                  <span>
                    Extra Weight
                    (${extraWeight.toFixed(1)} KG × ৳40)
                  </span>

                  <strong style="color:#03373D;">
                    ৳${extraCharge}
                  </strong>
                </div>
              `
              : ""
          }

        </div>

        <!-- Total -->
        <div style="
          margin-top: 15px;
          padding: 14px;
          border-radius: 10px;
          background: #F1FAD5;
          text-align: center;
        ">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #71717A;
          ">
            Total Delivery Cost
          </p>

          <p style="
            margin: 4px 0 0;
            font-size: 30px;
            font-weight: 700;
            color: #03373D;
          ">
            ৳${deliveryCost}
          </p>
        </div>

      </div>
    `,

      width: "430px",
      showCancelButton: true,
      confirmButtonText: "Proceed To Payment",
      cancelButtonText: "Back To Editing",

      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#CAEB66",

      customClass: {
        popup: "rounded-2xl",
        title: "text-black",
        confirmButton: "text-black font-small",
        cancelButton: "text-black font-small",
      },

      buttonsStyling: true,
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      const finalParcelData = {
        ...parcelData,
        creation_date: new Date().toISOString(),
      };

      console.log("Confirmed Parcel:", finalParcelData);

      /*
       * Backend Note
       * const response = await axiosSecure.post(
       *   "/parcels",
       *   finalParcelData
       * );
       *
       * navigate(`/payment/${response.data.parcelId}`);
       */

      reset();

      Swal.fire({
        icon: "success",
        title: "Booking Confirmed!",
        text: "Your parcel booking has been confirmed successfully.",
        confirmButtonColor: "#CAEB66",
        customClass: {
          confirmButton: "text-black font-medium",
        },
      });
    }

    if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("User returned to edit the parcel.");
    }
  };

  return (
    <section className="w-full py-5">
      <div className="mx-auto w-full rounded-[14px] bg-white px-5 py-7 sm:px-7 md:px-8 lg:px-[50px] lg:py-8">
        <div>
          <h1 className="text-[24px] font-bold tracking-[-0.6px] text-[#03373D] sm:text-[26px]">
            Send A Parcel
          </h1>

          <h2 className="mt-6 text-[12px] font-bold text-[#03373D]">
            Enter your parcel details
          </h2>

          <div className="mt-3 border-t border-[#E5E7EB]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="radio"
                value="document"
                {...register("parcelType")}
                className="h-3 w-3 accent-[#067A87]"
              />

              <span className="text-[11px] text-[#18181B]">Document</span>
            </label>

            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="radio"
                value="non-document"
                {...register("parcelType")}
                className="h-3 w-3 accent-[#067A87]"
              />

              <span className="text-[11px] text-[#18181B]">Non-Document</span>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Parcel Name" error={errors.parcelName}>
              <Input
                placeholder="Parcel Name"
                {...register("parcelName", {
                  required: "Parcel name is required",
                })}
                className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[12px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
              />
            </FormField>

            <FormField label="Parcel Weight (KG)" error={errors.parcelWeight}>
              <Input
                type="number"
                min="0"
                step="0.1"
                disabled={parcelType === "document"}
                placeholder="Parcel Weight (KG)"
                {...register("parcelWeight", {
                  validate: (value) => {
                    if (
                      parcelType === "non-document" &&
                      (!value || Number(value) <= 0)
                    ) {
                      return "Parcel weight is required";
                    }

                    return true;
                  },
                })}
                className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66] disabled:bg-[#F5F5F5]"
              />
            </FormField>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="min-w-0">
              <h3 className="mb-5 text-[11px] font-bold text-[#03373D]">
                Sender Details
              </h3>

              <div className="space-y-3">
                <FormField label="Sender Name" error={errors.senderName}>
                  <Input
                    placeholder="Sender Name"
                    {...register("senderName", {
                      required: "Sender name is required",
                    })}
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>

                <FormField label="Sender Phone No" error={errors.senderPhone}>
                  <Input
                    placeholder="Sender Phone No"
                    {...register("senderPhone", {
                      required: "Sender phone is required",
                    })}
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>

                <FormField label="Your District" error={errors.senderDistrict}>
                  <Controller
                    name="senderDistrict"
                    control={control}
                    rules={{
                      required: "District is required",
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);

                          setValue("senderServiceCenter", "");
                        }}
                      >
                        <SelectTrigger className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px]">
                          <SelectValue placeholder="Select your District" />
                        </SelectTrigger>

                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem
                              key={district}
                              value={district}
                              className="text-[10px]"
                            >
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Service Center"
                  error={errors.senderServiceCenter}
                >
                  <Controller
                    name="senderServiceCenter"
                    control={control}
                    rules={{
                      required: "Service center is required",
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!senderDistrict}
                      >
                        <SelectTrigger className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px]">
                          <SelectValue placeholder="Select Service Center" />
                        </SelectTrigger>

                        <SelectContent>
                          {senderServiceCenters.map((serviceCenter) => (
                            <SelectItem
                              key={serviceCenter}
                              value={serviceCenter}
                              className="text-[10px]"
                            >
                              {serviceCenter}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField label="Address" error={errors.senderAddress}>
                  <Input
                    placeholder="Address"
                    {...register("senderAddress", {
                      required: "Sender address is required",
                    })}
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>

                <FormField
                  label="Pickup Instruction"
                  error={errors.pickupInstruction}
                >
                  <Textarea
                    placeholder="Pickup Instruction"
                    {...register("pickupInstruction", {
                      required: "Pickup instruction is required",
                    })}
                    className="min-h-[70px] w-full resize-none rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>
              </div>
            </div>

            <div className="min-w-0">
              <h3 className="mb-5 text-[11px] font-bold text-[#03373D]">
                Receiver Details
              </h3>

              <div className="space-y-3">
                <FormField label="Receiver Name" error={errors.receiverName}>
                  <Input
                    placeholder="Receiver Name"
                    {...register("receiverName", {
                      required: "Receiver name is required",
                    })}
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>

                <FormField
                  label="Receiver Contact No"
                  error={errors.receiverPhone}
                >
                  <Input
                    placeholder="Receiver Contact No"
                    {...register("receiverPhone", {
                      required: "Receiver contact is required",
                    })}
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>

                <FormField
                  label="Receiver District"
                  error={errors.receiverDistrict}
                >
                  <Controller
                    name="receiverDistrict"
                    control={control}
                    rules={{
                      required: "District is required",
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);

                          setValue("receiverServiceCenter", "");
                        }}
                      >
                        <SelectTrigger className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px]">
                          <SelectValue placeholder="Select your District" />
                        </SelectTrigger>

                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem
                              key={district}
                              value={district}
                              className="text-[10px]"
                            >
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Service Center"
                  error={errors.receiverServiceCenter}
                >
                  <Controller
                    name="receiverServiceCenter"
                    control={control}
                    rules={{
                      required: "Service center is required",
                    }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!receiverDistrict}
                      >
                        <SelectTrigger className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px]">
                          <SelectValue placeholder="Select Service Center" />
                        </SelectTrigger>

                        <SelectContent>
                          {receiverServiceCenters?.map((serviceCenter) => (
                            <SelectItem
                              key={serviceCenter}
                              value={serviceCenter}
                              className="text-[10px]"
                            >
                              {serviceCenter}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField label="Address" error={errors.receiverAddress}>
                  <Input
                    placeholder="Address"
                    {...register("receiverAddress", {
                      required: "Receiver address is required",
                    })}
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>

                <FormField
                  label="Delivery Instruction"
                  error={errors.deliveryInstruction}
                >
                  <Textarea
                    placeholder="Delivery Instruction"
                    {...register("deliveryInstruction", {
                      required: "Delivery instruction is required",
                    })}
                    className="min-h-[70px] w-full resize-none rounded-[4px] border-[#D9E0E5] text-[11px] placeholder:text-[#A1A1AA]"
                  />
                </FormField>
              </div>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-[#18181B]">
            * PickUp Time 4pm-7pm Approx.
          </p>

          <Button
            type="submit"
            className="mt-6 h-[32px] cursor-pointer rounded-[4px] bg-[#CAEB66] text-[11px] font-medium text-black hover:bg-[#CAEB66] hover:brightness-95"
          >
            Proceed to Confirm Booking
          </Button>
        </form>
      </div>
    </section>
  );
}
