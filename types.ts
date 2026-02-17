
export interface GenerationForm {
  nombre_pages: number;
  nombre_chapitres: number;
  mots_par_page: number;
  avec_image: boolean;
  auteur: string;
  '1.titre': string;
  '2. cover_url': string;
  source_type: 'idea' | 'text' | 'youtube' | 'reel' | 'tiktok' | 'video' | 'audio' | 'vocal';
  source_content?: string;
  media_url?: string;
  customisation?: string;
  plan?: 'free' | 'essential' | 'abundance';
}

export enum Step {
  CONTENT = 0,
  NAMING = 1,
  DESIGN = 2,
  MOCKUP = 3,
  DASHBOARD = 4,
  SUCCESS = 5,
  ERROR = 6
}

export interface GeneratedItem {
  id: string;
  /* Added 'video' to the type union to support promo videos in production history */
  type: 'ebook' | 'cover' | 'mockup' | 'ad' | 'video';
  title: string;
  url: string;
  timestamp: number;
  expiresAt: number;
}

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}