import { useEffect, useMemo, useState } from "react";
import {
  getAssignedNutritionist,
  loadAppointments,
  saveAppointments,
} from "../../lib/wellness.js";

function UserVideoConsultation() {
  const [nutritionist, setNutritionist] = useState({
    name: "Priya Sharma",
    employeeId: "NB1023",
    specialty: "Weight loss and pregnancy support",
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [minutesToStart, setMinutesToStart] = useState(null);

  useEffect(() => {
    const user =
      localStorage.getItem("nbCurrentUserName") ||
      localStorage.getItem("nbUserName") ||
      "User";
    setNutritionist(getAssignedNutritionist(user));
    setAppointments(loadAppointments());
  }, []);

  useEffect(() => {
    saveAppointments(appointments);
  }, [appointments]);

  const upcomingAppointment = useMemo(
    () =>
      [...appointments]
        .filter((item) => item.status !== "Completed")
        .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0] ||
      null,
    [appointments],
  );

  useEffect(() => {
    const tick = () => {
      if (!upcomingAppointment) {
        setMinutesToStart(null);
        return;
      }

      const appointmentTime = new Date(`${upcomingAppointment.date}T${upcomingAppointment.time}`);
      const diffMinutes = Math.round((appointmentTime.getTime() - Date.now()) / 60000);
      setMinutesToStart(diffMinutes);
    };

    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, [upcomingAppointment]);

  const bookAppointment = () => {
    if (!date || !time) {
      return;
    }

    setAppointments((prev) => [
      {
        id: `${Date.now()}`,
        date,
        time,
        reason: reason.trim(),
        nutritionist: nutritionist.name,
        status: "Booked",
      },
      ...prev,
    ]);
    setDate("");
    setTime("");
    setReason("");
  };

  const completeAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === appointmentId ? { ...item, status: "Completed" } : item,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Video Consultation Booking
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Book a face-to-face consultation with your assigned nutritionist. You do not call directly; you schedule a slot first.
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold text-slate-800">{nutritionist.name}</p>
          <p className="text-[11px] text-slate-500">{nutritionist.employeeId}</p>
          <p className="text-[11px] text-slate-500">{nutritionist.specialty}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr,0.9fr]">
        <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Book appointment
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-700">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
              />
            </div>
            <div className="space-y-1.5 md:col-span-1">
              <label className="text-[11px] font-medium text-slate-700">Reason</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Weight loss follow-up"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={bookAppointment}
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Book with assigned nutritionist
          </button>

          <div className="mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Reminder
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  5 minute before alert
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${minutesToStart !== null && minutesToStart <= 5 && minutesToStart >= 0 ? "bg-amber-100 text-amber-700" : "bg-slate-200 text-slate-600"}`}>
                {minutesToStart !== null && minutesToStart <= 5 && minutesToStart >= 0
                  ? `Starts in ${minutesToStart} min`
                  : "Waiting"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              When the booking reaches 5 minutes before the slot, the page will highlight it so you can join on time.
            </p>
          </div>
        </section>

        <aside className="space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Upcoming appointments
            </h2>
            <p className="text-[11px] text-slate-500">
              Your consultations stay attached to the same nutritionist every time.
            </p>
          </div>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400">No appointments booked yet.</p>
            ) : (
              appointments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{item.date}</p>
                      <p className="text-slate-500">{item.time} • {item.nutritionist}</p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 font-medium text-slate-700">
                      {item.status}
                    </span>
                  </div>
                  {item.reason && <p className="mt-2 text-slate-600">{item.reason}</p>}
                  {item.status !== "Completed" && (
                    <button
                      type="button"
                      onClick={() => completeAppointment(item.id)}
                      className="mt-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Mark completed
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {upcomingAppointment && minutesToStart !== null && minutesToStart <= 5 && minutesToStart >= 0 && (
            <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
              Consultation reminder is active. Please get ready to join your scheduled face-to-face video call.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default UserVideoConsultation;
