import { Linking } from 'react-native';
import { business } from '../config/business';

export async function openPhoneCall() {
  await Linking.openURL(`tel:+${business.phoneE164}`);
}

export async function openEmail(subject?: string, body?: string) {
  const params = [
    subject ? `subject=${encodeURIComponent(subject)}` : '',
    body ? `body=${encodeURIComponent(body)}` : '',
  ].filter(Boolean).join('&');
  const url = `mailto:${business.email}${params ? `?${params}` : ''}`;
  await Linking.openURL(url);
}

export function contactEmailSubject() {
  return `Enquiry from the ${business.name} app`;
}

export function contactEmailBody(name: string, email: string, message: string) {
  return `Hello Praveen,\n\n${message.trim()}\n\nFrom: ${name.trim()}\nEmail: ${email.trim()}`;
}
