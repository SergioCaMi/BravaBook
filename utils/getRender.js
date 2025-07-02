// ********** Función para renderizar con todos los datos necesarios **********
export function getRenderObject(
  title,
  dataApartments = null,
  dataReservations = null,
  req = null,
  user = null,
  message,
  currentPage,
  rol
) {
  const userData =
    user ||
    (req.isAuthenticated?.() &&
    req.user &&
    req.user.photos &&
    req.user.photos.length > 0
      ? { photo: req.user.photos[0].value }
      : null);

  return {
    title,
    dataApartments,
    dataReservations,
    message,
    user: userData,
    currentPage,
    rol
  };
}

export async function getPaginatedData(model, filter, req, limit = 6) {
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const total = await model.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const data = await model.find(filter).skip(skip).limit(limit);

  return {
    dataApartments: data,
    currentPage: page,
    totalPages
  };
}