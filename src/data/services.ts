import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export const SERVICE_CATEGORIES = [
  'Workshops & Creative Wellness',
  'Creative Mentoring',
  'Fine Art & Crafts',
  'Technology & Branding',
  'Events, Media & Design',
  'Growth & Opportunities',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
export type ServiceIcon = ComponentProps<typeof Ionicons>['name'];

export type Service = {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  summary: string;
  description: string;
  icon: ServiceIcon;
  enquiryLabel: string;
  verificationStatus: 'verified' | 'needs-review';
};

export const services: Service[] = [
  {
    id: 's1',
    slug: 'art-therapy-workshops',
    title: 'Art Therapy Workshops & Creative Sessions',
    category: 'Workshops & Creative Wellness',
    summary: 'Art-focused workshops and creative sessions. Format is confirmed on enquiry.',
    description: 'Ask about art-focused workshops and creative sessions. These are creative wellbeing conversations, not a claim of licensed clinical therapy. Availability is by appointment.',
    icon: 'color-palette',
    enquiryLabel: 'Enquire about workshops',
    verificationStatus: 'needs-review',
  },
  {
    id: 's2',
    slug: 'calligraphy-handwriting',
    title: 'Calligraphy & Handwriting Mentoring',
    category: 'Creative Mentoring',
    summary: 'Ask about calligraphy and handwriting mentoring.',
    description: 'Enquire about calligraphy and handwriting mentoring. Lesson format, schedule and fees are shared directly — nothing is listed as a fixed package here.',
    icon: 'create',
    enquiryLabel: 'Enquire about calligraphy',
    verificationStatus: 'needs-review',
  },
  {
    id: 's3',
    slug: 'painting-drawing-mentoring',
    title: 'Painting & Drawing Mentoring',
    category: 'Creative Mentoring',
    summary: 'Ask about painting and drawing mentoring.',
    description: 'Enquire about painting and drawing mentoring with Praveen S. Scope and availability are confirmed in conversation.',
    icon: 'brush',
    enquiryLabel: 'Enquire about mentoring',
    verificationStatus: 'needs-review',
  },
  {
    id: 's4',
    slug: 'creative-technology',
    title: 'Creative Technology & Innovation',
    category: 'Technology & Branding',
    summary: 'Conversations around creative technology and innovation.',
    description: 'Explore creative technology and innovation ideas. This is an enquiry starting point, not a list of products or studio facilities.',
    icon: 'hardware-chip',
    enquiryLabel: 'Enquire about technology',
    verificationStatus: 'needs-review',
  },
  {
    id: 's5',
    slug: 'creative-branding',
    title: 'Creative Branding & Innovation',
    category: 'Technology & Branding',
    summary: 'Explore creative branding conversations and enquiries.',
    description: 'Discuss creative branding and visual identity ideas. Deliverables are agreed after a conversation — no packages or prices are published in the app.',
    icon: 'sparkles',
    enquiryLabel: 'Enquire about branding',
    verificationStatus: 'needs-review',
  },
  {
    id: 's6',
    slug: 'devotional-nature-paintings',
    title: 'Devotional & Nature Paintings',
    category: 'Fine Art & Crafts',
    summary: 'Original paintings in the Directional Works gallery.',
    description: 'Praveen S. paints original works including devotional and nature subjects. Open the Gallery to view the collection. Enquiries about a specific work should use the artwork ID on that painting’s screen.',
    icon: 'images',
    enquiryLabel: 'Enquire about paintings',
    verificationStatus: 'verified',
  },
  {
    id: 's7',
    slug: 'recruitment-growth',
    title: 'Recruitment & Growth Opportunities',
    category: 'Growth & Opportunities',
    summary: 'Catalogue-listed topic. Scope needs owner confirmation.',
    description: 'The catalogue mentions recruitment and growth conversations. No vacancies, placements or job guarantees are published here. Send an enquiry if you wish to discuss this topic.',
    icon: 'people',
    enquiryLabel: 'Enquire about opportunities',
    verificationStatus: 'needs-review',
  },
  {
    id: 's8',
    slug: 'growth-investment',
    title: 'Growth & Investment Enquiries',
    category: 'Growth & Opportunities',
    summary: 'Catalogue-listed topic. No financial offers are published.',
    description: 'Investment-related topics appear in the catalogue and require owner clarification. This app does not offer financial products, accept funds or promise returns.',
    icon: 'trending-up',
    enquiryLabel: 'Enquire about this topic',
    verificationStatus: 'needs-review',
  },
  {
    id: 's9',
    slug: 'devotional-nature-crafts',
    title: 'Devotional & Nature Crafts',
    category: 'Fine Art & Crafts',
    summary: 'Ask about craft-related creative work in these themes.',
    description: 'Enquire about crafts related to devotional and nature themes. Materials, availability and scope are confirmed directly.',
    icon: 'leaf',
    enquiryLabel: 'Enquire about crafts',
    verificationStatus: 'needs-review',
  },
  {
    id: 's10',
    slug: 'creative-events',
    title: 'Creative Events & Collaborations',
    category: 'Events, Media & Design',
    summary: 'Conversations around workshops, events and shared projects.',
    description: 'Discuss workshops, events and collaborative creative projects. Dates and formats are not listed as a public calendar in this app.',
    icon: 'calendar',
    enquiryLabel: 'Enquire about events',
    verificationStatus: 'needs-review',
  },
  {
    id: 's11',
    slug: '3d-live-action',
    title: '3D & Live Action Creative Media',
    category: 'Events, Media & Design',
    summary: 'Media conversations. No completed films are claimed here.',
    description: 'Enquire about 3D and live-action creative media. This is not a claim of a production house, completed films or licensed facilities.',
    icon: 'videocam',
    enquiryLabel: 'Enquire about media',
    verificationStatus: 'needs-review',
  },
  {
    id: 's12',
    slug: 'interior-exterior-design',
    title: 'Interior & Exterior Creative Design',
    category: 'Events, Media & Design',
    summary: 'Creative design conversations. No licensing is claimed.',
    description: 'Discuss interior and exterior creative design ideas. This is not a claim of architectural or engineering licensing. Scope is confirmed on enquiry.',
    icon: 'home',
    enquiryLabel: 'Enquire about design',
    verificationStatus: 'needs-review',
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((item) => item.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory | 'all') {
  if (category === 'all') return services;
  return services.filter((item) => item.category === category);
}

export function getRelatedServices(slug: string, limit = 3) {
  const current = getServiceBySlug(slug);
  if (!current) return services.slice(0, limit);
  const same = services.filter((item) => item.slug !== slug && item.category === current.category);
  if (same.length >= limit) return same.slice(0, limit);
  const rest = services.filter((item) => item.slug !== slug && item.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}
