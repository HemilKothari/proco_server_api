import { HydratedDocument, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { Request } from "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      isAdmin?: boolean;
      isAgent?: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};

/* ===== Chat ===== */
export interface Chat {
  chatName: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
  groupAdmin?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export type ChatDocument = HydratedDocument<Chat>;

/* ===== Job ===== */
export interface Job {
  title: string;
  location: string;
  company?: string;
  description?: string;
  salary?: string;
  period?: string;
  hiring: boolean;
  contract?: string;
  requirements: string[];
  imageUrl: string;
  agentId: Types.ObjectId;
  swipedUsers: Types.ObjectId[];
  matchedUsers: Types.ObjectId[];
  
}
export type JobDocument = HydratedDocument<Job>;

/* ===== Filter ===== */
export type OpportunityType =
  | "Internship"
  | "Research"
  | "Freelance"
  | "Competition";

export interface Filter {
  selectedOptions: string[];
  opportunityTypes: Map<OpportunityType, boolean>;
  selectedLocationOption: "City" | "State" | "Country" | "";
  locationDistance: number;
  selectedState: string;
  enteredCountry: string;
  customOptions: string[];
  agentId: Types.ObjectId;
}
export type FilterDocument = HydratedDocument<Filter>;

/* ===== Match ===== */
export interface Match {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  matchedAt: Date;
}
export type MatchDocument = HydratedDocument<Match>;

/* ===== Message ===== */
export interface Message {
  sender: Types.ObjectId;
  content: string;
  receiver?: Types.ObjectId;
  chat: Types.ObjectId;
  readBy: Types.ObjectId[];
}
export type MessageDocument = HydratedDocument<Message>;

/* ===== Swipe ===== */
export interface Swipe {
  jobId: Types.ObjectId;
  userId: Types.ObjectId;
  swipedAt: Date;
}
export type SwipeDocument = HydratedDocument<Swipe>;

/* ===== User ===== */
export interface User {
  username: string;
  email: string;
  password: string;
  phone: string;
  isAdmin: boolean;
  isAgent: boolean;
  skills: string[];
  profile: string;
  college?: string;
  gender?: string;
  branch?: string;
  city?: string;
  state?: string;
  country?: string;
  isFirstTimeUser: boolean;
}
export type UserDocument = HydratedDocument<User>;

/* ===== Bookmark ===== */
export interface Bookmark {
  job: Types.ObjectId;
  userId: Types.ObjectId;
}
export type BookmarkDocument = HydratedDocument<Bookmark>;

/* ===== Create User Type ===== */
export interface CreateUserBody {
  username: string;
  email: string;
  password: string;
  college?: string;
  gender?: string;
  branch?: string;
  city?: string;
  state?: string;
  country?: string;
}

/* ===== Login User Type ===== */
export interface LoginUserBody {
  email: string;
  password: string;
}

/* ===== Update User Type ===== */
export interface UpdateUserBody {
  username: string;
  email: string;
  password: string;
  college?: string;
  gender?: string;
  branch?: string;
  city?: string;
  state?: string;
  country?: string;
}

/* ===== Match User Type ===== */
export interface MatchUserBody {
  jobId: string;
  userId: string;
}

/* ===== Send Message Type ===== */
export interface SendMessageBody {
  content: string;
  chatId: string;
  receiver: string;
}

/* ===== Pagination ===== */
export interface PaginationQuery {
  page?: string;
}

/* ===== Authenticated Request Helper ===== */
export type AuthenticatedRequest<
  Params = {},
  ResBody = {},
  ReqBody = {},
  ReqQuery = {}
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  user: Express.User;
};

/* ===== Swipe User Type ===== */
export interface SwipeUserBody {
  jobId: string;
  userId: string;
}

/* ===== Create Bookmark Type ===== */
export interface CreateBookmarkBody {
  job: string;
}

// ======================== Socket Types ========================
export interface ChatUser {
  _id: string;
}

export interface ChatPayload {
  users: ChatUser[];
}

export interface MessagePayload {
  sender: {
    _id: string;
  };
  chat: ChatPayload;
}