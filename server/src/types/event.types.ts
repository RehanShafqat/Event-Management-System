export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string; // User ID
  category: string;
  price: number;
  capacity: number;
  availableTickets: number;
  imageUrl?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventCreate
  extends Omit<IEvent, "_id" | "createdAt" | "updatedAt" | "availableTickets"> {
  availableTickets?: number;
}

export interface IEventUpdate extends Partial<IEventCreate> {}
