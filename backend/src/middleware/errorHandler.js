export const notFound = (req, res, next) => {
  res.status(404);
  res.json({ message: 'Route not found' });
};

export const errorHandler = (err, req, res, next) => {
  const status = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status);
  res.json({ message: err.message || 'Server error' });
};
