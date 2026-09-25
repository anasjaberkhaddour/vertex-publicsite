export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
  }