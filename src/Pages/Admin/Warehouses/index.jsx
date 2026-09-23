import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import LoadingSpinner from "@/Pages/Shared/Loading";

export default function Warehouses() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      region: "",
      district: "",
      city: "",
      covered_area: "",
      status: "active",
      flowchart: "",
      longitude: "",
      latitude: "",
    },
  });

  // GET WAREHOUSES
  const { data: warehouses = [], isPending } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const response = await axiosSecure.get("/warehouses");

      return response?.data?.data || [];
    },
  });

  // CREATE
  const createWarehouseMutation = useMutation({
    mutationFn: async (warehouseData) => {
      const response = await axiosSecure.post("/warehouses", warehouseData);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      closeModal();

      Swal.fire({
        icon: "success",
        title: "Warehouse Added",
        text: "Warehouse has been added successfully.",
        confirmButtonColor: "#CAEB66",
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error?.response?.data?.message || "Failed to create warehouse.",
      });
    },
  });

  // UPDATE
  const updateWarehouseMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosSecure.patch(`/warehouses/${id}`, data);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      closeModal();

      Swal.fire({
        icon: "success",
        title: "Warehouse Updated",
        text: "Warehouse has been updated successfully.",
        confirmButtonColor: "#CAEB66",
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error?.response?.data?.message || "Failed to update warehouse.",
      });
    },
  });

  // DELETE
  const deleteWarehouseMutation = useMutation({
    mutationFn: async (id) => {
      const response = await axiosSecure.delete(`/warehouses/${id}`);
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Warehouse has been deleted successfully.",
        confirmButtonColor: "#CAEB66",
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error?.response?.data?.message || "Failed to delete warehouse.",
      });
    },
  });

  const openAddModal = () => {
    setEditingWarehouse(null);
    reset({
      region: "",
      district: "",
      city: "",
      covered_area: "",
      status: "active",
      flowchart: "",
      longitude: "",
      latitude: "",
    });

    setIsModalOpen(true);
  };

  const openEditModal = (warehouse) => {
    setEditingWarehouse(warehouse);

    reset({
      region: warehouse.region || "",
      district: warehouse.district || "",
      city: warehouse.city || "",
      covered_area: warehouse.covered_area?.join(", ") || "",
      status: warehouse.status || "active",
      flowchart: warehouse.flowchart || "",
      longitude: warehouse.longitude || "",
      latitude: warehouse.latitude || "",
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWarehouse(null);
    reset();
  };

  const onSubmit = (data) => {
    const warehouseData = {
      region: data.region.trim(),
      district: data.district.trim(),
      city: data.city.trim(),
      covered_area: data.covered_area
        ?.split(",")
        ?.map((area) => area.trim())
        ?.filter(Boolean),
      status: data.status,
      flowchart: data.flowchart.trim(),
      longitude: Number(data.longitude),
      latitude: Number(data.latitude),
    };

    if (editingWarehouse) {
      updateWarehouseMutation.mutate({
        id: editingWarehouse._id,
        data: warehouseData,
      });
    } else {
      createWarehouseMutation.mutate(warehouseData);
    }
  };

  const handleDelete = async (warehouse) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Warehouse?",
      text: `Are you sure you want to delete ${warehouse.district} warehouse?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#CAEB66",
    });

    if (result.isConfirmed) {
      deleteWarehouseMutation.mutate(warehouse._id);
    }
  };

  const isSaving =
    createWarehouseMutation.isPending || updateWarehouseMutation.isPending;

  return (
    <section className="mx-auto w-full max-w-7xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#03373D]">Warehouses</h1>
        </div>

        <Button
          onClick={openAddModal}
          className="cursor-pointer bg-[#CAEB66] text-black hover:bg-[#CAEB66] hover:brightness-95"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Warehouse
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        {isPending ? (
          <LoadingSpinner />
        ) : warehouses?.length === 0 ? (
          <div className="flex min-h-62.5 items-center justify-center">
            <p className="text-sm text-[#71717A]">No warehouses found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFA]">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-[#03373D]">
                    District
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold text-[#03373D]">
                    Region
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold text-[#03373D]">
                    City
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold text-[#03373D]">
                    Covered Areas
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold text-[#03373D]">
                    Status
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold text-[#03373D]">
                    Coordinates
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#03373D]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {warehouses?.map((warehouse) => (
                  <tr key={warehouse._id} className="border-t border-[#E5E7EB]">
                    <td className="px-4 py-3 text-xs font-semibold text-[#18181B]">
                      {warehouse.district}
                    </td>

                    <td className="px-4 py-3 text-xs text-[#71717A]">
                      {warehouse.region}
                    </td>

                    <td className="px-4 py-3 text-xs text-[#71717A]">
                      {warehouse.city}
                    </td>

                    <td className="max-w-62.5 px-4 py-3 text-xs text-[#71717A]">
                      {warehouse.covered_area?.join(", ")}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                          warehouse.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {warehouse.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-xs text-[#71717A]">
                      {warehouse.latitude}, {warehouse.longitude}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => openEditModal(warehouse)}
                          className="h-7 w-7 cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          disabled={deleteWarehouseMutation.isPending}
                          onClick={() => handleDelete(warehouse)}
                          className="h-7 w-7 cursor-pointer text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#03373D]">
                  {editingWarehouse ? "Edit Warehouse" : "Add Warehouse"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="cursor-pointer rounded-full p-1 text-[#71717A] hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  Region
                </label>

                <Input
                  placeholder="e.g. Khulna"
                  {...register("region", {
                    required: "Region is required",
                  })}
                  className="h-9 text-xs"
                />

                {errors.region && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.region.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  District
                </label>

                <Input
                  placeholder="e.g. Bagerhat"
                  {...register("district", {
                    required: "District is required",
                  })}
                  className="h-9 text-xs"
                />

                {errors.district && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.district.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  City
                </label>

                <Input
                  placeholder="e.g. Bagerhat"
                  {...register("city", {
                    required: "City is required",
                  })}
                  className="h-9 text-xs"
                />

                {errors.city && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  Status
                </label>

                <select
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className="h-9 w-full rounded-md border border-[#D9E0E5] bg-white px-3 text-xs outline-none focus:border-[#067A87]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  Covered Areas
                </label>

                <Input
                  placeholder="Mongla, Rampal, Fakirhat, Kachua"
                  {...register("covered_area", {
                    required: "Covered area is required",
                  })}
                  className="h-9 text-xs"
                />

                <p className="mt-1 text-[10px] text-[#71717A]">
                  Separate multiple areas using commas.
                </p>

                {errors.covered_area && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.covered_area.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  Flowchart URL
                </label>

                <Input
                  placeholder="https://example.com/flowchart.png"
                  {...register("flowchart")}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  Latitude
                </label>

                <Input
                  type="number"
                  step="any"
                  placeholder="22.6516"
                  {...register("latitude", {
                    required: "Latitude is required",
                  })}
                  className="h-9 text-xs"
                />

                {errors.latitude && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.latitude.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-[#18181B]">
                  Longitude
                </label>

                <Input
                  type="number"
                  step="any"
                  placeholder="89.7926"
                  {...register("longitude", {
                    required: "Longitude is required",
                  })}
                  className="h-9 text-xs"
                />

                {errors.longitude && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.longitude.message}
                  </p>
                )}
              </div>

              <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer bg-[#CAEB66] text-black hover:bg-[#CAEB66] hover:brightness-95"
                >
                  {isSaving
                    ? "Saving..."
                    : editingWarehouse
                      ? "Update Warehouse"
                      : "Add Warehouse"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
