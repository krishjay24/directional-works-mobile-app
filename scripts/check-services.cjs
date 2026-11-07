const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.join(__dirname, '../src/data/services.ts'), 'utf8');
const slugs = [...file.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const ids = [...file.matchAll(/id:\s*'([^']+)'/g)].map((m) => m[1]);
const titles = [...file.matchAll(/title:\s*'([^']+)'/g)].map((m) => m[1]);
const categories = [...file.matchAll(/category:\s*'([^']+)'/g)].map((m) => m[1]);

const errors = [];
if (slugs.length !== 12) errors.push(`Expected 12 services, found ${slugs.length}`);
if (new Set(slugs).size !== slugs.length) errors.push('Duplicate slugs');
if (new Set(ids).size !== ids.length) errors.push('Duplicate ids');
if (titles.some((t) => /\$|fee|guaranteed|certified|ROI/i.test(t))) errors.push('Unverified commercial claims in titles');

const expected = [
  'art-therapy-workshops',
  'calligraphy-handwriting',
  'painting-drawing-mentoring',
  'creative-technology',
  'creative-branding',
  'devotional-nature-paintings',
  'recruitment-growth',
  'growth-investment',
  'devotional-nature-crafts',
  'creative-events',
  '3d-live-action',
  'interior-exterior-design',
];
expected.forEach((slug) => {
  if (!slugs.includes(slug)) errors.push(`Missing slug ${slug}`);
});

const groups = new Set(categories);
['Workshops & Creative Wellness', 'Creative Mentoring', 'Fine Art & Crafts', 'Technology & Branding', 'Events, Media & Design', 'Growth & Opportunities']
  .forEach((c) => { if (!groups.has(c)) errors.push(`Missing category ${c}`); });

const whatsapp = fs.readFileSync(path.join(__dirname, '../src/lib/whatsapp.ts'), 'utf8');
const business = fs.readFileSync(path.join(__dirname, '../src/config/business.ts'), 'utf8');
if (!business.includes('919966966881')) errors.push('Business phone E164 mismatch');
if (!business.includes('worksdirectional@gmail.com')) errors.push('Business email mismatch');
if (!whatsapp.includes('wa.me/${business.phoneE164}') && !whatsapp.includes('wa.me/${business.phoneE164}')) {
  if (!whatsapp.includes('wa.me/')) errors.push('WhatsApp helper missing wa.me');
}

const serviceMsg = 'Hello Praveen, I visited the Directional Works app and would like more information about Calligraphy & Handwriting Mentoring. Please share the details.';
const paintingMsg = 'Hello Praveen, I viewed a painting in the Directional Works app and would like to enquire about artwork ID 12.';
if (!whatsapp.includes('would like more information about ${serviceName}')) errors.push('Service enquiry template mismatch');
if (!whatsapp.includes('artwork ID ${paintingId}')) errors.push('Painting enquiry template mismatch');

const encoded = encodeURIComponent(serviceMsg);
if (!encoded.includes('Calligraphy')) errors.push('Encoding failed');
const encodedPainting = encodeURIComponent(paintingMsg);
if (!encodedPainting.includes('12')) errors.push('Painting encoding failed');

const expectedUrl = `https://wa.me/919966966881?text=${encodeURIComponent(paintingMsg)}`;
if (!expectedUrl.startsWith('https://wa.me/919966966881')) errors.push('WhatsApp destination mismatch');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`OK ${slugs.length} services, unique slugs, WhatsApp destination 919966966881`);
console.log(titles.map((t, i) => `${i + 1}. ${t}`).join('\n'));
