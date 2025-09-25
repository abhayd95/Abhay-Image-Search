import { type UnsplashPhoto } from './unsplash';

export interface PersonalPhoto extends UnsplashPhoto {
  isPersonal: true;
  subtitle?: string;
}

export function personalResults(query: string): PersonalPhoto[] {
  const normalizedQuery = query.toLowerCase().trim();
  const aliases = [
    "abhay",
    "abhay virus", 
    "abhay tiwari",
    "abhay d95",
    "abhay_d95"
  ];

  if (!aliases.some(alias => normalizedQuery.includes(alias))) {
    return [];
  }

  return [{
    id: "abhay-profile",
    alt_description: "Abhay (Abhay Virus / Abhay Tiwari)",
    description: "Personal profile of Abhay (Abhay Virus / Abhay Tiwari)",
    urls: {
      small: "/abhay.jpg",
      regular: "/abhay.jpg",
      full: "/abhay.jpg"
    },
    user: {
      name: "Abhay (Abhay Virus / Abhay Tiwari)",
      links: {
        html: "https://www.instagram.com/abhay_d95/"
      }
    },
    links: {
      html: "https://www.instagram.com/abhay_d95/",
      download_location: ""
    },
    isPersonal: true,
    subtitle: "From Instagram"
  }];
}
