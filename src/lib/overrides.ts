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
    "abhay_d95"
  ];

  if (!aliases.some(alias => normalizedQuery.includes(alias))) {
    return [];
  }

  return [{
    id: "abhay-profile",
    alt_description: "Abhay Tiwari (Abhay Virus)",
    description: "Personal profile of Abhay Tiwari (Abhay Virus)",
    urls: {
      small: "/abhay.jpg",
      regular: "/abhay.jpg",
      full: "/abhay.jpg"
    },
    user: {
      name: "Abhay Tiwari (Abhay Virus)",
      links: {
        html: "https://www.linkedin.com/in/abhay-tiwari-545a57358/"
      }
    },
    links: {
      html: "https://www.linkedin.com/in/abhay-tiwari-545a57358/",
      download_location: ""
    },
    isPersonal: true,
    subtitle: "Creator & Developer"
  }];
}
