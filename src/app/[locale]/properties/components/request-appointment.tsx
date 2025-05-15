/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useLocale } from "next-intl";
import { Loader2, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { enUS, ar } from "date-fns/locale";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { clientPost } from "@/services/api";
import { getAppointments } from "@/services/properties";
import { Property } from "@/types";

interface AppointmentData {
  id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}

interface AppointmentResponse {
  success: boolean;
  status: number;
  message: string;
  data: AppointmentData[];
}

const RequestAppointmentButton = ({ property }: { property: Property | undefined }) => {
  const locale = useLocale();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full py-4 text-lg font-medium shadow-lg shadow-primary/5 hover:shadow-primary/10">
          <div className="flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5" />
            {locale === "ar" ? "طلب موعد" : "Request Appointment"}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 z-[99999]">
        <DialogTitle asChild>
          <VisuallyHidden>
            {locale === "ar" ? "نموذج طلب موعد" : "Appointment Request Form"}
          </VisuallyHidden>
        </DialogTitle>
        <RequestAppointmentForm property={property ?? undefined} />
      </DialogContent>
    </Dialog>
  );
};

const RequestAppointmentForm = ({ property }: { property: Property | undefined }) => {
  const locale = useLocale();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    telephone: "",
  });

  const { data: appointmentsData, isLoading } = useQuery<
    AppointmentResponse,
    Error
  >({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await getAppointments();
      return response as AppointmentResponse;
    },
  });

  // Check if data is empty
  const isEmpty =
    !appointmentsData?.data ||
    appointmentsData.data.length === 0;

  // Filter available appointments (only show not reserved ones)
  const availableAppointments = appointmentsData?.data?.filter(
    appointment => appointment.status === "NotReserved"
  ) || [];

  // Group appointments by date for better organization
  const appointmentsByDate = availableAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, AppointmentData[]>);

  const { mutate, isPending } = useMutation<AppointmentResponse>({
    mutationFn: async () => {
      if (!selectedAppointmentId) {
        throw new Error(
          locale === "ar"
            ? "يرجى اختيار موعد"
            : "Please select an appointment"
        );
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telephone", formData.telephone);
      formDataToSend.append("id_appointment", selectedAppointmentId.toString());
      formDataToSend.append("preporty_name", property?.home_name ?? "");
      formDataToSend.append("preporty_id", property?.id.toString() ?? "");

      return await clientPost("/site/appointment-request", formDataToSend);
    },
    onSuccess: () => {
      toast.success(locale === "ar" ? "تم إرسال الطلب بنجاح" : "Request sent successfully");
      setSelectedAppointmentId(null);
      setFormData({
        name: "",
        surname: "",
        email: "",
        telephone: "",
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.message ||
        (locale === "ar"
          ? "حدث خطأ أثناء إرسال الطلب"
          : "Error submitting request")
      );
    },
  });

  const handleSubmit = () => {
    if (
      !selectedAppointmentId ||
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.telephone
    ) {
      toast.error(
        locale === "ar"
          ? "يرجى إدخال جميع الحقول المطلوبة واختيار موعد"
          : "Please fill in all required fields and select an appointment"
      );
      return;
    }
    mutate();
  };

  if (isEmpty) {
    return (
      <div className="p-6 text-center text-gray-500">
        {locale === "ar"
          ? "لا تتوفر مواعيد في الوقت الحالي"
          : "No appointments available at the moment"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="flex justify-between items-center p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {locale === "ar" ? "طلب موعد" : "Request Appointment"}
          </h2>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            <div>
              <p className="text-gray-700 mb-3">
                {locale === "ar" ? "اختر موعداً متاحاً" : "Choose an available appointment"}
              </p>
              <div className="max-h-[350px] overflow-y-auto pr-2 -mr-2">
                {Object.entries(appointmentsByDate).map(([date, appointments]) => (
                  <div key={date} className="mb-6">
                    <h3 className="text-md font-medium mb-3 text-gray-700">
                      {format(new Date(date), "EEEE, MMMM dd, yyyy", {
                        locale: locale === "ar" ? ar : enUS,
                      })}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {appointments.map((appointment) => (
                        <button
                          key={appointment.id}
                          onClick={() => setSelectedAppointmentId(appointment.id.toString())}
                          className={`w-full p-4 rounded-lg text-left transition-all 
                            ${selectedAppointmentId === appointment.id.toString()
                              ? "bg-green-600 text-white shadow-lg shadow-green-200 transform -translate-y-0.5"
                              : "bg-gray-50 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                            }
                            border border-gray-100
                            transition-all duration-200`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className={`font-medium ${selectedAppointmentId === appointment.id.toString() ? "text-white" : "text-gray-800"}`}>
                              {appointment.name}
                            </span>
                            <span className={`text-sm ${selectedAppointmentId === appointment.id.toString() ? "text-green-100" : "text-gray-500"}`}>
                              {appointment.start_time.substring(0, 5)} - {appointment.end_time.substring(0, 5)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg text-sm text-primary">
              {locale === "ar"
                ? "هذا ليس تحجير: سيتم إرسال طلبك إلى الوكالة التي ستتواصل معك مرة أخرى."
                : "This is not a reservation: Your request will be sent to the agency that will contact you again."}
            </div>

            <div>
              <p className="text-gray-700 mb-3">
                {locale === "ar"
                  ? "أدخل تفاصيلك هنا"
                  : "Enter your details here"}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  label={locale === "ar" ? "الاسم الأول*" : "First Name*"}
                  value={formData.name}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  type="text"
                  label={locale === "ar" ? "الاسم الأخير*" : "Last Name*"}
                  value={formData.surname}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, surname: e.target.value })
                  }
                />
                <Input
                  type="email"
                  label={locale === "ar" ? "البريد الإلكتروني*" : "E-mail*"}
                  value={formData.email}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Input
                  type="tel"
                  label={locale === "ar" ? "الهاتف*" : "Telephone*"}
                  value={formData.telephone}
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              variant="success"
              className="w-full py-4"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : locale === "ar" ? (
                "تأكيد"
              ) : (
                "Confirm"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestAppointmentButton;
