import { environment } from '../../../environments/environment';

export function imageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const base = environment.apiUrl.replace('/api', '');
  return `${base}${path}`;
}