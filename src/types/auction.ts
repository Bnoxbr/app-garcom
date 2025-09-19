// Simplificando e alinhando com a refatoração
export interface Auction {
  id: string;
  creator_id: string; // Anteriormente client_id
  title: string;
  description: string;
  start_price: number;
  end_time: string;
  status: 'open' | 'closed' | 'cancelled' | 'active' | 'completed';
  created_at?: string;
  bids?: AuctionBid[];
  highest_bid?: number;
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
  amount: number;
  created_at?: string;
  bidder?: any; // Para dados do join
  auction?: Auction;
}