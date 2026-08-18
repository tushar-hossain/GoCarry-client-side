import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLoaderData } from "react-router";
import toast from "react-hot-toast";

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

export default function SendParcel() {
  const [isConfirming, setIsConfirming] = useState(false);
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

  const onSubmit = (data) => {
    const deliveryCost = calculateDeliveryCost({
      parcelType: data.parcelType,
      weight: data.parcelWeight,
      senderDistrict: data.senderDistrict,
      receiverDistrict: data.receiverDistrict,
    });
    console.log("data: ", data);
    const parcelData = {
      ...data,
      deliveryCost,
    };

    toast.success(
      (t) => (
        <div
          className={`w-[350px] rounded-xl border border-[#D9E0E5] bg-white p-5 shadow-xl transition-all ${
            t.visible ? "animate-in fade-in zoom-in" : "opacity-0"
          }`}
        >
          <div>
            <p className="text-[13px] font-bold text-[#03373D]">
              Delivery Cost
            </p>

            <p className="mt-1 text-[10px] text-[#71717A]">
              Your estimated delivery cost is:
            </p>

            <p className="mt-2 text-[26px] font-bold text-[#03373D]">
              ৳{deliveryCost}
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              className="rounded-md border border-[#D9E0E5] px-4 py-2 text-[10px] font-medium text-[#71717A] transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isConfirming}
              onClick={() => {
                setIsConfirming(true);

                const finalParcelData = {
                  ...parcelData,
                  creation_date: new Date()?.toISOString(),
                };

                console.log("Confirmed Parcel:", finalParcelData);

                /*
                 * backend is ready to send
                 */

                toast.dismiss(t.id);
                setIsConfirming(false);
                reset();
                toast.success("Parcel booking confirmed successfully!");
              }}
              className="rounded-md bg-[#CAEB66] px-4 py-2 text-[10px] font-medium text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConfirming ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      },
    );
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

              <span className="text-[8px] text-[#18181B]">Document</span>
            </label>

            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="radio"
                value="non-document"
                {...register("parcelType")}
                className="h-3 w-3 accent-[#067A87]"
              />

              <span className="text-[8px] text-[#18181B]">Non-Document</span>
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
