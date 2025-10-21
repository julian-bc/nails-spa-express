import mongoose from "mongoose";

// Valida si el string tiene formato YYYY-MM-DD
export const isYMD = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

// Genera el filtro de fechas y cancelación
export function buildAppointmentFilter({ date, from, to, cancelled }) {
  const filter = {};

  // Validaciones de formato
  if (date && !isYMD(date)) throw new Error("Formato de 'date' inválido. Use YYYY-MM-DD.");
  if (from && !isYMD(from)) throw new Error("Formato de 'from' inválido. Use YYYY-MM-DD.");
  if (to && !isYMD(to)) throw new Error("Formato de 'to' inválido. Use YYYY-MM-DD.");

  // Filtro por fecha
  if (date) {
    filter["schedule.date"] = date;
  } else if (from || to) {
    filter["schedule.date"] = {};
    if (from) filter["schedule.date"]["$gte"] = from;
    if (to) filter["schedule.date"]["$lte"] = to;
  }

  // Filtro por canceladas
  if (typeof cancelled !== "undefined") {
    if (!["true", "false"].includes(String(cancelled))) {
      throw new Error("El parámetro 'cancelled' debe ser 'true' o 'false'.");
    }
    filter.cancelled = String(cancelled) === "true";
  }

  return filter;
}

// Procesa la paginación de manera uniforme
export function parsePagination({ page = 1, limit = 10 }) {
  const _page = Math.max(1, parseInt(page, 10) || 1);
  const _limit = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (_page - 1) * _limit;
  return { _page, _limit, skip };
}

// Construye la metadata de la respuesta
export function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
}
