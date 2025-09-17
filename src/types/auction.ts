import type { Profile } from './index';

export type AuctionStatus = 'active' | 'completed' | 'cancelled';
export type BidStatus = 'pending' | 'accepted' | 'rejected';
export type NotificationType = 'new_auction' | 'new_bid' | 'auction_ending' | 'auction_completed' | 'bid_accepted';

export interface Auction {
  id: string;
  title: string;
  description?: string;
  category_id?: string;
  client_id: string;
  location?: string;
  event_date: string;
  duration_hours: number;
  base_price: number;
  min_rating: number;
  status: AuctionStatus;
  winner_id?: string;
  final_price?: number;
  end_time: string;
  created_at: string;
  updated_at: string;
  
  // Campos relacionados (não armazenados diretamente na tabela)
  client?: Profile;
  creator?: Profile; // Alias para client
  winner?: Profile;
  category_name?: string;
  category?: string; // Nome da categoria
  bids_count?: number;
  lowest_bid?: number;
  current_bid_amount?: number; // Valor do lance atual
  end_date?: string; // Alias para end_time
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  professional_id: string;
  bid_amount: number;
  service_fee: number;
  total_amount: number;
  status: BidStatus;
  created_at: string;
  updated_at: string;
  
  // Campos relacionados (não armazenados diretamente na tabela)
  professional?: Profile;
  auction?: Auction;
}

export interface AuctionNotification {
  id: string;
  auction_id: string;
  user_id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
  
  // Campos relacionados (não armazenados diretamente na tabela)
  auction?: Auction;
}