import type { Profile } from './index';

// Simplificando e alinhando com a refatoração
export interface Auction {
  id: string;
  creator_id: string; // Anteriormente client_id
  creator?: Profile;
  title: string;
  description: string;
  base_price: number; // Renomeado de start_price
  end_date: string; // Renomeado de end_time
  status: 'open' | 'closed' | 'cancelled' | 'active' | 'completed';
  created_at?: string;
  bids?: AuctionBid[];
  highest_bid?: number;
  category?: string; // Adicionado para filtragem
  current_bid_amount?: number; // Adicionado
  category_id?: string;
  location?: any;
  event_date?: string;
  duration_hours?: number;
  winning_bid_id?: string;
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  bidder_id: string; // Anteriormente professional_id
  bid_amount: number; // Renomeado de amount
  created_at?: string;
  professional?: Profile; // Renomeado de bidder e tipado
  auction?: Auction;
}