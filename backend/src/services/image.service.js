// Free image API service using Unsplash Source and Picsum
const axios = require('axios')

class ImageService {
  // Get college image from Unsplash (free, no API key needed for demo)
  static getCollegeImage(collegeName, city, type = 'college') {
    // Encode the search query
    const query = encodeURIComponent(`${collegeName} ${city} campus ${type}`)
    
    // Using Lorem Picsum for consistent placeholder (always works, no API key)
    // And Unsplash random for college-themed images
    return {
      logoUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/200/200`,
      coverImageUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/1200/400`,
      galleryImages: [
        `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/400/300`,
        `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/400/300`,
        `https://picsum.photos/id/${Math.floor(Math.random() * 100) + 1}/400/300`
      ]
    }
  }

  // Alternative: Use Unsplash Source (no API key required for basic usage)
  static getUnsplashImage(collegeName) {
    const query = encodeURIComponent(collegeName)
    return {
      logoUrl: `https://source.unsplash.com/featured/200x200?${query},college`,
      coverImageUrl: `https://source.unsplash.com/featured/1200x400?${query},campus`,
      galleryImages: [
        `https://source.unsplash.com/featured/400x300?${query},building`,
        `https://source.unsplash.com/featured/400x300?${query},library`,
        `https://source.unsplash.com/featured/400x300?${query},students`
      ]
    }
  }
}

module.exports = ImageService