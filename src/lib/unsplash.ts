const BASE_URL = 'https://api.unsplash.com';

export interface UnsplashPhoto {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  links: {
    download_location: string;
    html: string;
  };
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  alt_description: string | null;
  description: string | null;
}

export interface SearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export interface SearchParams {
  query: string;
  page?: number;
  per_page?: number;
}

const getAuthHeader = () => ({
  'Authorization': `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
});

export const searchPhotos = async (
  query: string, 
  page = 1, 
  perPage = 24,
  signal?: AbortSignal
): Promise<SearchResponse> => {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await fetch(`${BASE_URL}/search/photos?${params}`, {
    headers: getAuthHeader(),
    signal,
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (response.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    }
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    results: data.results,
    total: data.total,
    total_pages: data.total_pages,
  };
};

export const triggerDownload = async (downloadLocation: string): Promise<void> => {
  try {
    await fetch(downloadLocation, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.warn('Failed to trigger download tracking:', error);
    // Don't throw here as the download should still proceed
  }
};
