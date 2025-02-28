/**
 * Tribute data model types for the Tributestream platform
 */

export interface Tribute {
  id: string;
  slug: string;
  deceased: DeceasedInfo;
  pointOfContact: ContactInfo;
  funeralDirector?: ContactInfo;
  scheduleDetails: ScheduleDetails;
  paymentDetails?: PaymentDetails;
  mediaItems?: MediaItem[];
  contributors?: Contributor[];
  visibility: TributeVisibility;
  createdAt: string;
  updatedAt: string;
}

export interface DeceasedInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string;
  dateOfPassing: string;
  biography?: string;
  photoUrl?: string;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship?: string;
  dateOfBirth?: string;
  userId?: string; // Reference to User if they have an account
}

export interface ScheduleDetails {
  date: string;
  time: string;
  locations: Location[];
  duration: number; // in hours
  timeZone: string;
  notes?: string;
}

export interface Location {
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  startTime: string;
  duration: number;
  notes?: string;
  mapUrl?: string;
}

export interface PaymentDetails {
  status: PaymentStatus;
  amount: number;
  currency: string;
  packageId: string;
  packageName: string;
  transactionId?: string;
  paymentMethod?: string;
  paymentDate?: string;
  dueDate?: string;
  invoiceUrl?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIAL = 'partial'
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
  isApproved: boolean;
}

export interface Contributor {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'contributor' | 'admin';
  invitedBy: string;
  invitedAt: string;
  joinedAt?: string;
}

export enum TributeVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted'
}