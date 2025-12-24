// Contact Form Types
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// FAQ Form Types
export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQFormData {
  image: File | null;
  faq: FAQItem[];
}

// Our Story Form Types
export interface StorySection {
  title: string;
  content: string[];
  points?: string[];
  ending?: string;
  subTitle?: string;
  subPoints?: string[];
}

export interface OurStoryFormData {
  sections: StorySection[];
}

// Real Winners Form Types
export interface WinnerItem {
  icon: string;
  title: string;
  description: string;
}

export interface RealWinnersFormData {
  sectionTitle: string;
  sectionDescription: string;
  winnersList: WinnerItem[];
}

// Services Form Types
export interface ReferenceItem {
  label: string;
  link: string;
}

export interface DetailSection {
  key: string;
  title?: string;
  text?: string;
  list?: string[];
}

export interface ServiceDetails {
  intro?: string;
  sections: DetailSection[];
}

export interface ServicesFormData {
  title: string;
  description: string;
  image: File | null;
  link: string;
  demands: string[];
  demandText?: string;
  references?: ReferenceItem[];
  details?: ServiceDetails;
}

// Setting Form Types
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SanityImageRef {
  _type: 'image';
  asset: {
    _type: 'reference';
    _ref: string;
  };
}

export interface SettingFormData {
  siteTitle: string;
  siteDescription: string;
  logo?: File | SanityImageRef | null;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: SocialLink[];
}

// United Voices Form Types
export interface VoiceItem {
  heading?: string;
  subHeading?: string;
}

export interface UnitedVoicesFormData {
  title?: string;
  subTitle?: string;
  description?: string;
  frontimage: File | null;
  backimage: File | null;
  voices?: VoiceItem[];
}

// Banner Form Types
export interface BannerFormData {
  title?: string;
  subTitle?: string;
}
