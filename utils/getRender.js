// ********** Función para renderizar con todos los datos necesarios **********
export function getRenderObject(
  title,
  dataApartments = null,
  dataReservations = null,
  req = null,
  user = null,
  message,
  currentPage
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
  };
}
