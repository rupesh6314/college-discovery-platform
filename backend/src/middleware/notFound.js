const notFound = (req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  })
}

module.exports = notFound