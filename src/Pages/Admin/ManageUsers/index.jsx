import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldCheck, ShieldOff, X } from "lucide-react";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");

  const {
    data: users = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axiosSecure.get("/users");
      return response?.data?.data;
    },
  });

  const makeAdminMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosSecure.patch(
        `/admin/users/make-admin/${userId}`,
      );
      return response.data;
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Admin role added",
        text: "The user is now an admin.",
        confirmButtonColor: "#CAEB66",
      });

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error?.response?.data?.message || "Failed to make user admin.",
        confirmButtonColor: "#CAEB66",
      });
    },
  });

  const removeAdminMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await axiosSecure.patch(
        `/admin/users/remove-admin/${userId}`,
      );
      return response.data;
    },

    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Admin role removed",
        text: "The user is now a regular user.",
        confirmButtonColor: "#CAEB66",
      });

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error?.response?.data?.message || "Failed to remove admin role.",
        confirmButtonColor: "#CAEB66",
      });
    },
  });

  const filteredUsers = useMemo(() => {
    const search = searchValue.trim()?.toLowerCase();

    if (!search) {
      return users;
    }

    return users?.filter((user) =>
      String(user.email || "")
        .toLowerCase()
        .includes(search),
    );
  }, [users, searchValue]);

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Make this user admin?",
      text: `${user.email} will get admin access.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#CAEB66",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdminMutation.mutate(user?._id);
      }
    });
  };

  const handleRemoveAdmin = (user) => {
    Swal.fire({
      title: "Remove admin role?",
      text: `${user.email} will no longer have admin access.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove admin",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#CAEB66",
      cancelButtonColor: "#CAEB66",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAdminMutation.mutate(user?._id);
      }
    });
  };

  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#71717A]">Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-sm text-red-600">
          {error?.response?.data?.message || "Failed to load users."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#03373D]">Manage Users</h1>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs text-[#71717A]">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-[#03373D]">
            {users?.length}
          </p>
        </div>

        <div className="flex w-full max-w-sm items-center gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1AA]" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by email..."
              className="h-9 pl-9 pr-9 text-xs"
            />
            {searchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[#71717A] hover:bg-[#F1F5F5]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E5E7EB] bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFA]">
              <TableHead className="text-xs font-semibold text-[#03373D]">
                #
              </TableHead>

              <TableHead className="text-xs font-semibold text-[#03373D]">
                Email
              </TableHead>

              <TableHead className="text-xs font-semibold text-[#03373D]">
                Created At
              </TableHead>

              <TableHead className="text-xs font-semibold text-[#03373D]">
                Role
              </TableHead>

              <TableHead className="text-right text-xs font-semibold text-[#03373D]">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={user._id} className="hover:bg-[#F8FAFA]">
                  <TableCell className="text-xs text-[#71717A]">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#03373D]">
                    {user.email}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-[#71717A]">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-BD", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.role === "admin"
                          ? "border-purple-200 bg-purple-50 text-purple-700"
                          : "border-gray-200 bg-gray-50 text-gray-600"
                      }
                    >
                      {user.role || "user"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {user.role === "admin" ? (
                      <Button
                        type="button"
                        size="sm"
                        disabled={removeAdminMutation.isPending}
                        onClick={() => handleRemoveAdmin(user)}
                        className="h-8 cursor-pointer bg-red-50 text-xs text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        <ShieldOff className="mr-1.5 h-3.5 w-3.5" />
                        Remove Admin Role
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        disabled={makeAdminMutation.isPending}
                        onClick={() => handleMakeAdmin(user)}
                        className="h-8 cursor-pointer bg-[#CAEB66] text-xs text-black hover:bg-[#CAEB66] hover:brightness-95"
                      >
                        <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                        Make User Admin
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-sm text-[#71717A]"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
