export interface MenuItem {
  name: string;
  price: number;
  description: string;
  tags?: string[];
  isFeatured?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "food" | "drinks" | "interior" | "exterior";
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}
