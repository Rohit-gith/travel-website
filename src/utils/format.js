export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// pricePerKm can be a number (13) or a range [12, 13]
export const formatPerKm = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    const [min, max] = value;
    return min === max ? `₹${min}/km` : `₹${min}-${max}/km`;
  }
  return `₹${value}/km`;
};

// Shows "₹12-13/km" or "Call for price" when the rate is not set yet
export const formatCarRate = (car) => formatPerKm(car.pricePerKm) ?? 'Call for price';