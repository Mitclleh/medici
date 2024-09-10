interface WebSocketResponse {
    e: string; // Event type (e.g., 'trade', 'orderBook', etc.)
    s: string; // Symbol (e.g., 'BTC-USD', 'ETH-USD')
    p: number; // Price
    q: number; // Quantity
    t: number; // Timestamp
    dc?: number; // Daily change percentage (optional)
    dd?: number; // Daily difference price (optional)
  }
  