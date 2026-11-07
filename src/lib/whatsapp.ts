import { Linking } from 'react-native';
import { business } from '../config/business';

export const CONTACT_PHONE_DISPLAY = business.phoneDisplay;
export const CONTACT_PHONE_E164 = business.phoneE164;

function waUrl(text?: string) {
  const query = text?.trim() ? `?text=${encodeURIComponent(text.trim())}` : '';
  return `https://wa.me/${business.phoneE164}${query}`;
}

export async function openWhatsAppMessage(draft?: string) {
  const url = waUrl(draft);
  try {
    await Linking.openURL(url);
  } catch {
    const sms = `sms:+${business.phoneE164}${draft?.trim() ? `?body=${encodeURIComponent(draft.trim())}` : ''}`;
    await Linking.openURL(sms);
  }
}

export function serviceEnquiryMessage(serviceName: string) {
  return `Hello Praveen, I visited the Directional Works app and would like more information about ${serviceName}. Please share the details.`;
}

export function paintingEnquiryMessage(paintingId: number) {
  return `Hello Praveen, I viewed a painting in the Directional Works app and would like to enquire about artwork ID ${paintingId}.`;
}

export function generalEnquiryMessage() {
  return 'Hello Praveen, I am contacting you through the Directional Works app regarding your creative services.';
}

export function collaborationEnquiryMessage() {
  return 'Hello Praveen, I am contacting you through the Directional Works app regarding a collaboration.';
}

export function contactFormEnquiryMessage(name: string, email: string, message: string) {
  return `Hello Praveen, this is ${name.trim()}.\n\n${message.trim()}\n\nEmail: ${email.trim()}`;
}

export function whatsappUrl(text?: string) {
  const query = text?.trim() ? `?text=${encodeURIComponent(text.trim())}` : '';
  return `https://wa.me/${business.phoneE164}${query}`;
}
