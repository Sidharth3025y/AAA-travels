import { apiFetch, clearAuthToken, saveAuthToken } from "./client";

export function sendEnquiry(payload) {
  return apiFetch("/api/contact/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function mailtoFallback({ name, email, phone, message }) {
  const subject = encodeURIComponent(
    `Enquiry from ${name} — AAA Travels and Tours`,
  );

  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\n${message}`,
  );

  window.location.href = `mailto:info@aaatravelsandtours.com?subject=${subject}&body=${body}`;
}

export function fetchEnquiries() {
  return apiFetch("/api/contact/messages");
}

export function deleteEnquiry(id) {
  return apiFetch(`/api/contact/messages/${id}`, {
    method: "DELETE",
  });
}

export function bookFlight(payload) {
  return apiFetch("/api/bookings/flight", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export function updateBookingStatus(id, status) {
  return apiFetch(`/api/bookings/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function deleteBooking(id) {
  return apiFetch(`/api/bookings/${id}`, {
    method: "DELETE",
  });
}

export function fetchBookings() {
  return apiFetch("/api/bookings/all");
}

// ===============================
// TESTIMONIALS / GOOGLE REVIEWS
// ===============================

export function fetchTestimonials() {
  return apiFetch("/api/testimonials");
}

export function createTestimonial(payload) {
  return apiFetch("/api/testimonials", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      location: payload.location || "Google Review",
      quote: payload.quote,
      rating: payload.rating || 5,
      reviewDate: payload.reviewDate || "",
      avatar: payload.avatar || "",
      source: "Google",
    }),
  });
}

export function deleteTestimonial(id) {
  return apiFetch(`/api/testimonials/${id}`, {
    method: "DELETE",
  });
}

// ===============================
// ADMIN
// ===============================

export function loginAdmin(payload) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ ...payload, adminOnly: true }),
  }).then((data) => {
    saveAuthToken(data.token);
    return data;
  });
}

export function registerAdmin(payload) {
  return apiFetch("/api/auth/admin/register", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((data) => {
    saveAuthToken(data.token);
    return data;
  });
}

export function fetchAdminSetup() {
  return apiFetch("/api/auth/admin-setup");
}

export function createAdmin(payload) {
  return apiFetch("/api/auth/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMe() {
  return apiFetch("/api/auth/me");
}

export function logoutAdmin() {
  return apiFetch("/api/auth/logout", {
    method: "POST",
  }).finally(clearAuthToken);
}
