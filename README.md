# Abhay Image Search

A production-ready image search application built with React, TypeScript, and Vite, powered by the Unsplash API.

## Features

- 🔍 **Real-time Search**: Debounced search with 400ms delay
- 🖼️ **Responsive Gallery**: Masonry grid layout that adapts to screen size
- 📱 **Mobile-First Design**: Fully responsive and accessible
- ♿ **Accessibility**: Keyboard navigation, ARIA labels, and screen reader support
- 🔄 **Pagination**: Load more functionality with infinite scroll capability
- 💾 **Persistent Search**: Remembers last search query using localStorage
- ⚡ **Performance**: Optimized with lazy loading and request cancellation
- 🎨 **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Pure CSS with CSS Grid and Flexbox
- **API**: Unsplash API
- **State Management**: React Hooks (useState, useEffect, useCallback)

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd abhay-image-search
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in the root directory
echo "VITE_UNSPLASH_ACCESS_KEY=your_access_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## API Configuration

This application uses the Unsplash API. You'll need to:

1. Sign up for a free Unsplash account
2. Create a new application at [Unsplash Developers](https://unsplash.com/developers)
3. Get your Access Key (not the Secret Key)
4. Add it to your `.env` file as `VITE_UNSPLASH_ACCESS_KEY`

## Project Structure

```
src/
├── components/
│   ├── SearchBar.tsx      # Search input with debouncing
│   ├── ImageCard.tsx      # Individual image card component
│   └── Gallery.tsx        # Image gallery with loading states
├── lib/
│   └── unsplash.ts        # API client and types
├── App.tsx                # Main application component
├── App.css                # Application styles
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## Key Features Explained

### Search Functionality
- Debounced input to prevent excessive API calls
- Request cancellation to avoid race conditions
- Error handling for rate limits and network issues

### Image Gallery
- Responsive grid layout (1-5 columns based on screen size)
- Lazy loading for performance
- Skeleton loaders during image loading
- Hover effects and smooth transitions

### Download Compliance
- Properly triggers Unsplash's download tracking endpoint
- Opens images in new tabs after tracking
- Maintains compliance with Unsplash API terms

### Accessibility
- Full keyboard navigation support
- ARIA labels and descriptions
- High contrast mode support
- Screen reader friendly

## Performance Optimizations

- **Request Cancellation**: Uses AbortController to cancel stale requests
- **Lazy Loading**: Images load only when needed
- **Debounced Search**: Reduces API calls during typing
- **Memoized Callbacks**: Prevents unnecessary re-renders
- **Efficient State Management**: Minimal re-renders with proper state structure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is for educational purposes. Images are provided by Unsplash and are subject to their terms of service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🚀 Render Deployment Checklist

### Prerequisites
1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Unsplash API Key**: Have your Unsplash Access Key ready

### Render Setup Steps

#### 1. Environment Variables
In Render Dashboard → Environment, add:
```
KEY: VITE_UNSPLASH_ACCESS_KEY
VALUE: [Your Unsplash Access Key]
```

#### 2. Build Configuration
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Root Directory**: Leave empty (or set to project root)

#### 3. SPA Configuration
- **Static Site**: Yes
- **Redirects**: Already configured in `public/_redirects`
- **Headers**: Default (no additional headers needed)

#### 4. Post-Deploy Verification
1. **Check Console**: Open browser dev tools → Console
   - Should see no 404 errors for environment variables
   - Should see no runtime errors
2. **Test Search**: Try searching for "cats" or "nature"
3. **Test Personal Query**: Search "abhay" to see custom card
4. **Test Theme Toggle**: Click moon icon in header
5. **Test Responsive**: Resize browser window

#### 5. Troubleshooting
- **Blank Page**: Check if `VITE_UNSPLASH_ACCESS_KEY` is set correctly
- **404 Errors**: Verify `public/_redirects` file exists with `/*   /index.html   200`
- **API Errors**: Check Unsplash API key validity and rate limits
- **Build Failures**: Check Node.js version (use 18.x or 20.x)

### File Structure for Render
```
abhay-image-search/
├── public/
│   └── _redirects          # SPA routing
├── src/
│   ├── components/         # React components
│   ├── lib/               # API utilities
│   └── index.css          # Styles
├── package.json           # Dependencies
└── vite.config.ts         # Build config
```

## Troubleshooting

### Common Issues

1. **API Key Issues**: Ensure your Unsplash Access Key is correctly set in the `.env` file
2. **Rate Limiting**: The free Unsplash API has rate limits. Wait a moment and try again
3. **CORS Issues**: This is a client-side app, so CORS should work fine with Unsplash API

### Development Tips

- Use the browser's Network tab to monitor API calls
- Check the Console for any error messages
- Ensure your `.env` file is in the project root
- Make sure you're using the Access Key, not the Secret Key