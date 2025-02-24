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

interface AppointmentData {
  name: string;
  surname: string;
  email: string;
  telephone: string;
  id_appointment: string;
  date: string;
  time: string;
  updated_at: string;
  created_at: string;
  id: number;
}

interface AppointmentResponse {
  success: boolean;
  status: number;
  message: string;
  data: AppointmentData | AppointmentData[];
}

const RequestAppointmentButton = () => {
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
        <RequestAppointmentForm />
      </DialogContent>
    </Dialog>
  );
};

const RequestAppointmentForm = () => {
  const locale = useLocale();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
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
      const response = await getAppointments(locale);
      return response as AppointmentResponse;
    },
  });

  console.log(appointmentsData);

  // Check if data is empty
  const isEmpty =
    !appointmentsData?.data ||
    (Array.isArray(appointmentsData.data) &&
      appointmentsData.data.length === 0);

  const availableDates = Array.isArray(appointmentsData?.data)
    ? [
        ...new Set(
          appointmentsData.data
            .filter((appointment) => {
              const appointmentDate = new Date(appointment.date);
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
              return appointmentDate >= today;
            })
            .map((appointment) => appointment.date)
        ),
      ]
    : [];

  const availableTimes = Array.isArray(appointmentsData?.data)
    ? [...new Set(appointmentsData.data.map((appointment) => appointment.time))]
    : [];

  // Get appointment ID based on selected date and time
  const getAppointmentId = () => {
    if (!Array.isArray(appointmentsData?.data)) return null;

    const selectedAppointment = appointmentsData.data.find(
      (appointment) =>
        appointment.date === selectedDate && appointment.time === selectedTime
    );

    return selectedAppointment?.id_appointment || null;
  };

  const { mutate, isPending } = useMutation<AppointmentResponse>({
    mutationFn: async () => {
      const appointmentId = getAppointmentId();
      if (!appointmentId) {
        throw new Error(
          locale === "ar"
            ? "لم يتم العثور على موعد صالح"
            : "Valid appointment not found"
        );
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("telephone", formData.telephone);
      formDataToSend.append("id_appointment", appointmentId);

      return await clientPost(
        "/site/appointment-request",
        formDataToSend,
        locale
      );
    },
    onSuccess: (response) => {
      toast.success(response.message);
      setSelectedDate("");
      setSelectedTime("");
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
      !selectedDate ||
      !selectedTime ||
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.telephone
    ) {
      toast.error(
        locale === "ar"
          ? "يرجى إدخال جميع الحقول المطلوبة"
          : "Please fill in all required fields"
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
                {locale === "ar" ? "اختر اليوم" : "Choose Day"}
              </p>
              <div className="max-h-[250px] overflow-y-auto pr-2 -mr-2">
                <div className="grid gap-3">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`w-full p-4 rounded-lg flex items-center justify-between transition-all 
                        ${
                          selectedDate === date
                            ? "bg-green-600 text-white shadow-lg shadow-green-200 transform -translate-y-0.5"
                            : "bg-gray-50 hover:bg-gray-100 hover:shadow-md hover:-translate-y-0.5"
                        }
                        border border-gray-100
                        transition-all duration-200`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-2xl font-bold ${
                            selectedDate === date
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {format(new Date(date), "dd")}
                        </div>
                        <div className="flex flex-col items-start">
                          <div
                            className={`text-sm ${
                              selectedDate === date
                                ? "text-green-100"
                                : "text-gray-500"
                            }`}
                          >
                            {format(new Date(date), "MMM", {
                              locale: locale === "ar" ? ar : enUS,
                            })}
                          </div>
                          <div
                            className={`text-sm ${
                              selectedDate === date
                                ? "text-green-100"
                                : "text-gray-500"
                            }`}
                          >
                            {format(new Date(date), "EEE", {
                              locale: locale === "ar" ? ar : enUS,
                            })}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-gray-700 mb-3">
                {locale === "ar" ? "اختر الوقت" : "Choose Time"}
              </p>
              <div className="flex gap-3 flex-wrap">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 text-sm 
                      ${
                        selectedTime === time
                          ? "bg-green-600 text-white shadow-lg shadow-green-200 transform -translate-y-0.5 hover:bg-green-700"
                          : ""
                      }`}
                  >
                    {time}
                  </button>
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
