// AUTO-GENERATED from http://localhost:8000/api/openapi.v1.yaml
// Do not edit manually — run `npm run generate:api` to regenerate

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  display_name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RefreshRequest = {
  refresh_token: string;
};

export type LogoutRequest = {
  refresh_token: string;
};

export type CreateGameRequest = {
  setting_key?: string;
  saboteur_mode?: boolean;
  langs: string[];
  attrs: string[];
  player_count?: number;
  host_display_name: string;
};

export type CreateGameResponse = {
  game_code: string;
  host_token: string;
  game_id: string;
  player_id: number;
  player_token: string;
};

export type JoinGameRequest = {
  display_name: string;
  user_id?: string | null;
};

export type JoinGameResponse = {
  player_id: number;
  player_token: string;
  card: Record<string, unknown>;
};

export type RevealCardRequest = {
  field: string;
};

export type UsePowerRequest = {
  power: string;
  target_player_id?: number | null;
  forced_field?: string | null;
};

export type VoteRequest = {
  target_player_id: number;
};

export type RateGameRequest = {
  scenario_rating: number;
  game_rating: number;
  comment?: string | null;
};

export type UnlockRewardedRequest = {
  feature: "setting" | "extra_lang" | "saboteur_mode" | "extra_attrs" | "no_ads";
  ad_provider_token: string;
};

export type CreateCheckoutRequest = {
  product: "setting_unlock" | "all_settings" | "session_no_ads" | "corporate_session";
  setting_key?: string | null;
};

export type CheckoutResponse = {
  checkout_url: string;
};

export type SurvivalStats = {
  games: number;
  survived: number;
  rate: number;
};

export type SaboteurStats = {
  games_as_saboteur: number;
  saboteur_wins: number;
  rate: number;
  times_detected: number;
};

export type UserPublicProfile = {
  user_id: string;
  display_name: string;
  favourite_setting: string | null;
  survival: SurvivalStats;
  saboteur: SaboteurStats;
};

export type LeaderboardEntry = {
  rank: number;
  user_id: string;
  display_name: string;
  rate: number;
  games: number;
};

// Game document types — derived from backend schemas.py
export type DarkSecret = {
  content: Record<string, string>;
  reveal_round: number;
};

export type SpecialPower = {
  name: Record<string, string>;
  description: Record<string, string>;
  used: boolean;
};

export type Card = {
  role?: Record<string, string>;
  gender?: Record<string, string>;
  health?: Record<string, string>;
  dark_secret?: DarkSecret;
  special_skill?: Record<string, string>;
  phobia?: Record<string, string>;
  inventory_item?: Record<string, string>;
  personality_trait?: Record<string, string>;
  special_power?: SpecialPower;
  // is_saboteur is intentionally omitted — never shown until GAME_ENDED
};

export type CardWithSaboteur = Card & {
  is_saboteur?: boolean;
};

export type GameSettings = {
  setting_key: string;
  saboteur_mode: boolean;
  langs: string[];
  attrs: string[];
  player_count: number;
  ads_enabled: boolean;
};

export type Scenario = {
  title: Record<string, string>;
  description: Record<string, string>;
  environment_conditions: Record<string, string>[];
};

export type RoundEffects = {
  shielded: number[];
  silenced: number[];
  double_vote: number[];
  veto_active: boolean;
};

export type Player = {
  player_id: number;
  player_type: "human" | "ai" | "guest";
  user_id: string | null;
  display_name: string;
  player_token: string;
  is_eliminated: boolean;
  card: Card;
  revealed_fields: string[];
};

export type GameStatus = "lobby" | "active" | "ended";

export type GameDocument = {
  game_id: string;
  game_code: string;
  status: GameStatus;
  host_player_id: number;
  survivors_count: number;
  scenario: Scenario | null;
  settings: GameSettings;
  players: Player[];
  current_round: number;
  events: GameEvent[];
  round_effects: RoundEffects | null;
  votes_this_round: Record<string, number>;
  created_at: string;
};

// WebSocket event types
export type WsEventType =
  | "ROUND_STARTED"
  | "CARD_REVEALED"
  | "POWER_USED"
  | "SPY_RESULT"
  | "SCAN_RESULT"
  | "VOTE_CAST"
  | "PLAYER_ELIMINATED"
  | "PLAYER_KICKED"
  | "GAME_ENDED"
  | "SABOTEUR_REVEALED";

export type GameEvent = {
  type: WsEventType;
  player_id?: number;
  target_player_id?: number;
  field?: string;
  value?: unknown;
  round?: number;
  votes?: Record<string, number>;
  eliminated_player_id?: number;
  survivors?: number[];
  saboteur_player_id?: number;
  timestamp?: string;
};

// History response
export type GameHistoryResponse = {
  events: GameEvent[];
  rounds: number;
};
