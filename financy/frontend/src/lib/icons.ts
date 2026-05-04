import {
  BriefcaseBusiness, CarFront, HeartPulse, PiggyBank, ShoppingCart, Ticket,
  Wrench, Utensils, PawPrint, House, Gift, Dumbbell, BookOpen, BaggageClaim,
  Mailbox, ReceiptText, type LucideIcon,
} from 'lucide-react';

export const CATEGORY_ICONS = [
  'briefcase-business','car-front','heart-pulse','piggy-bank','shopping-cart',
  'ticket','tool-case','utensils','paw-print','house','gift','dumbbell',
  'book-open','baggage-claim','mailbox','receipt-text',
] as const;
export type CategoryIconKey = typeof CATEGORY_ICONS[number];

export const ICON_COMPONENTS: Record<CategoryIconKey, LucideIcon> = {
  'briefcase-business': BriefcaseBusiness,
  'car-front': CarFront,
  'heart-pulse': HeartPulse,
  'piggy-bank': PiggyBank,
  'shopping-cart': ShoppingCart,
  'ticket': Ticket,
  'tool-case': Wrench,
  'utensils': Utensils,
  'paw-print': PawPrint,
  'house': House,
  'gift': Gift,
  'dumbbell': Dumbbell,
  'book-open': BookOpen,
  'baggage-claim': BaggageClaim,
  'mailbox': Mailbox,
  'receipt-text': ReceiptText,
};
