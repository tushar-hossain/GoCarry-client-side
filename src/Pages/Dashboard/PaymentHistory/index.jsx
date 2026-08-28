import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function PaymentHistory() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: payments = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["payment-history", user?.email],
    enabled: !!user?.email,

    queryFn: async () => {
      const response = await axiosSecure.get(`/payments?email=${user?.email}`);
      return response?.data?.data || [];
    },
  });

  // LOADING
  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#03373D]" />
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-600">
          Failed to load payment history.
        </p>

        <p className="mt-1 text-xs text-red-500">
          {error?.response?.data?.message || error?.message}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#03373D]">
          Payment History
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1F5F5]">
              <CreditCard className="h-5 w-5 text-[#03373D]" />
            </div>

            <div>
              <p className="text-xs text-[#71717A]">Total Payments</p>

              <p className="mt-1 text-xl font-bold text-[#03373D]">
                {payments?.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-xs text-[#71717A]">Total Amount</p>

          <p className="mt-1 text-xl font-bold text-[#03373D]">
            $
            {payments
              ?.reduce(
                (total, payment) => total + Number(payment.amount || 0),
                0,
              )
              ?.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFA] hover:bg-[#F8FAFA]">
                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Date
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Payment ID
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Parcel ID
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Amount
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Currency
                </TableHead>

                <TableHead className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {payments?.length > 0 ? (
                payments?.map((payment) => (
                  <TableRow key={payment._id} className="hover:bg-[#F8FAFA]">
                    <TableCell className="whitespace-nowrap text-xs text-[#52525B]">
                      {new Date(payment.payment_date)?.toLocaleDateString(
                        "en-BD",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </TableCell>

                    <TableCell className="max-w-[220px]">
                      <span className="block truncate font-mono text-[10px] text-[#067A87]">
                        {payment.paymentIntentId || "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="max-w-[180px]">
                      <span className="block truncate font-mono text-[10px] text-[#52525B]">
                        {payment.parcelId || "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-xs font-semibold text-[#03373D]">
                      ${Number(payment.amount || 0).toFixed(2)}
                    </TableCell>

                    <TableCell className="text-xs uppercase text-[#52525B]">
                      {payment.currency || "BDT"}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={
                          payment.status === "succeeded"
                            ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                            : payment.status === "pending"
                              ? "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              : "border-red-200 bg-red-100 text-red-700 hover:bg-red-100"
                        }
                      >
                        {payment.paymentStatus || ""}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-sm text-[#71717A]"
                  >
                    No payment history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
