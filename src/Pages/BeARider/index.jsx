import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WearhouseData from "/public/warehouses.json";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";

export default function BeARider() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName ?? "",
      drivingLicenseNumber: "",
      email: user?.email ?? "",
      region: "",
      district: "",
      nid: "",
      phone: "",
      bikeBrandModel: "",
      bikeRegistrationNumber: "",
      about: "",
    },
  });

  const {
    data: wearhouseData = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      //   const response = await axiosSecure.get("/warehouses");

      //   return response?.data?.data || response?.data || [];
      return WearhouseData;
    },
  });

  const selectedRegion = watch("region");

  const regions = useMemo(() => {
    return [...new Set(wearhouseData?.map((item) => item.region))];
  }, [wearhouseData]);

  const districts = useMemo(() => {
    if (!selectedRegion) {
      return [];
    }

    return wearhouseData
      ?.filter((item) => item.region === selectedRegion)
      ?.map((item) => item.district);
  }, [wearhouseData, selectedRegion]);

  const onSubmit = async (data) => {
    try {
      const result = await axiosSecure.post("/riders", data);

      if (result?.data?.data?._id) {
        reset();
        await Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your rider application has been submitted successfully.",
          confirmButtonText: "Okay",
          confirmButtonColor: "#CAEB66",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#CAEB66",
      });
    }
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-sm text-red-500">
        {error?.message || "Failed to load warehouse data"}
      </div>
    );
  }

  return (
    <div className="md:max-w-6xl mx-auto py-5">
      <Card className="overflow-hidden rounded-[14px] bg-white">
        <CardContent className="p-5 sm:p-7 lg:px-9 lg:py-8">
          {/* Header */}
          <div className="mb-5">
            <h1 className="text-[25px] font-bold leading-tight tracking-[-0.7px] text-[#03373D]">
              Be a Rider
            </h1>

            <p className="mt-1 text-[11px] leading-[15px] text-[#71717A]">
              Enjoy fast, reliable parcel delivery with real-time tracking and
              zero hassle. From personal packages to business shipments we
              deliver on time, every time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 border-t border-[#E5E7EB] pt-3 md:grid-cols-[1fr_0.85fr] md:gap-10">
            {/* LEFT : FORM */}
            <div>
              <h2 className="mb-3 text-[11px] font-bold text-[#03373D]">
                Tell us about yourself
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Name */}
                <FormField
                  className="text-[11px]"
                  label="Your Name"
                  error={errors.name?.message}
                >
                  <Input
                    {...register("name", {
                      required: "Name is required",
                    })}
                    readOnly
                    placeholder="Your Name"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Driving License */}
                <FormField
                  label="Driving License Number"
                  error={errors.drivingLicenseNumber?.message}
                >
                  <Input
                    {...register("drivingLicenseNumber", {
                      required: "Driving license number is required",
                    })}
                    type="number"
                    placeholder="Driving License Number"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Email */}
                <FormField label="Your Email" error={errors.email?.message}>
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    readOnly
                    placeholder="Your Email"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Region */}
                <FormField label="Your Region" error={errors.region?.message}>
                  <Select
                    value={selectedRegion}
                    onValueChange={(value) => {
                      setValue("region", value, {
                        shouldValidate: true,
                      });

                      // Reset district when region changes
                      setValue("district", "", {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px]">
                      <SelectValue placeholder="Select your Region" />
                    </SelectTrigger>

                    <SelectContent>
                      {regions?.map((region) => (
                        <SelectItem
                          key={region}
                          value={region}
                          className="text-[10px]"
                        >
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                {/* Hidden RHF registration for Select */}
                <input
                  type="hidden"
                  {...register("region", {
                    required: "Region is required",
                  })}
                />

                {/* District */}
                <FormField
                  label="Your District"
                  error={errors.district?.message}
                >
                  <Select
                    value={watch("district")}
                    disabled={!selectedRegion}
                    onValueChange={(value) =>
                      setValue("district", value, {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px]">
                      <SelectValue placeholder="Select your District" />
                    </SelectTrigger>

                    <SelectContent>
                      {districts?.map((district) => (
                        <SelectItem
                          key={district}
                          value={district}
                          className="text-[11px]"
                        >
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <input
                  type="hidden"
                  {...register("district", {
                    required: "District is required",
                  })}
                />

                {/* NID */}
                <FormField label="NID No" error={errors.nid?.message}>
                  <Input
                    {...register("nid", {
                      required: "NID number is required",
                    })}
                    type="number"
                    placeholder="NID Number"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Phone */}
                <FormField label="Phone Number" error={errors.phone?.message}>
                  <Input
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                    type="number"
                    placeholder="Phone Number"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Bike Brand */}
                <FormField
                  label="Bike Brand Model and Year"
                  error={errors.bikeBrandModel?.message}
                >
                  <Input
                    {...register("bikeBrandModel", {
                      required: "Bike brand, model and year is required",
                    })}
                    placeholder="Bike Brand Model and Year"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Registration */}
                <FormField
                  label="Bike Registration Number"
                  error={errors.bikeRegistrationNumber?.message}
                >
                  <Input
                    {...register("bikeRegistrationNumber", {
                      required: "Bike registration number is required",
                    })}
                    placeholder="Bike Registration Number"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* About */}
                <FormField
                  label="Tell Us About Yourself"
                  error={errors.about?.message}
                >
                  <Textarea
                    {...register("about", {
                      required: "Please tell us about yourself",
                    })}
                    placeholder="Tell Us About Yourself"
                    className="h-[32px] w-full rounded-[4px] border-[#D9E0E5] bg-white text-[11px] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-[#CAEB66]"
                  />
                </FormField>

                {/* Submit */}
                <Button
                  type="submit"
                  className="mt-1 h-[29px] w-full cursor-pointer rounded-[4px] bg-[#CAEB66] px-3 text-[11px] font-medium text-black shadow-none hover:bg-[#CAEB66] hover:brightness-95"
                >
                  Submit
                </Button>
              </form>
            </div>

            {/* ================= RIGHT : IMAGE ================= */}
            <div className="hidden items-center justify-center md:flex">
              <img
                src="/assets/agent-pending.png"
                alt="Rider"
                className="w-full max-w-[360px] object-contain"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================= FORM FIELD ================= */

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="mb-[2px] block text-[11px] font-medium leading-[11px] text-[#18181B]">
        {label}
      </label>

      {children}

      {error && <p className="mt-[1px] text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
