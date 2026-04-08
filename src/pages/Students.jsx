import { useEffect, useState } from "react";
import { apiFetch, buildApiUrl, parseApiResponse } from "../lib/api.js";

const initialForm = {
  name: "",
  email: "",
  course: "",
};

const studentsPath = "/api/students";
const studentsEndpoint = buildApiUrl(studentsPath);

function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(studentsPath);
      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to load students");
      }

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to reach the backend");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function handleEdit(student) {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
    });
    setEditingId(student.id);
    setError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    const requestUrl = editingId
      ? `${studentsPath}/${editingId}`
      : studentsPath;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await apiFetch(requestUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        const validationSummary = data?.validationErrors
          ? Object.values(data.validationErrors).join(", ")
          : "";
        throw new Error(
          validationSummary || data?.message || "Unable to save student"
        );
      }

      resetForm();
      setSuccessMessage(
        editingId
          ? "Student updated successfully."
          : "Student created successfully."
      );
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to save student");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    setSuccessMessage("");

    try {
      const response = await apiFetch(`${studentsPath}/${id}`, {
        method: "DELETE",
      });

      const data = await parseApiResponse(response);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete student");
      }

      if (editingId === id) {
        resetForm();
      }

      setSuccessMessage("Student deleted successfully.");
      await loadStudents();
    } catch (err) {
      setError(err.message || "Unable to delete student");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr,1.2fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Backend Integration
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Student CRUD test page
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Use this page to verify that React can create, read, update, and
            delete data through the Spring Boot API and MySQL database.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-900">Endpoint:</span>{" "}
              <code>{studentsEndpoint}</code>
            </p>
            <p className="mt-2">
              <span className="font-medium text-slate-900">Mode:</span>{" "}
              {editingId ? `Editing student #${editingId}` : "Adding new student"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-slate-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter student name"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="course" className="text-xs font-medium text-slate-700">
                Course
              </label>
              <input
                id="course"
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-primary/30 focus:bg-white focus:ring"
                placeholder="Enter course name"
                required
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Student"
                    : "Add Student"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear Form
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Students from backend
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                This list is loaded from Spring Boot and refreshed after every change.
              </p>
            </div>
            <button
              type="button"
              onClick={loadStudents}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-slate-600">Loading students...</p>
          ) : students.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
              No students found yet. Add one using the form.
            </div>
          ) : (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">ID</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Course</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-3 text-slate-700">{student.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{student.email}</td>
                      <td className="px-4 py-3 text-slate-700">{student.course}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(student)}
                            className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student.id)}
                            className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Students;
