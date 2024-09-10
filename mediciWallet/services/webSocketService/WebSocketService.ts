
type EventCallback = (data: WebSocketResponse) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private readonly apiKey: string = 'demo';
  private readonly url: string = `wss://ws.eodhistoricaldata.com/ws/crypto?api_token=${this.apiKey}`;
  private listeners: { [event: string]: EventCallback[] } = {};
  private connectionPromise: Promise<void> | null = null;
  private connectionResolve: (() => void) | null = null;
  private emitDelay: number = 1000; // Delay in milliseconds

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.ws = new WebSocket(this.url);
    this.connectionPromise = new Promise(resolve => {
      this.connectionResolve = resolve;
    });

    this.ws.onopen = () => {
      console.log('Connected to WebSocket');
      if (this.connectionResolve) {
        this.connectionResolve();
        this.connectionResolve = null; // Once resolved, it should not be resolved again
      }
    };

    this.ws.onmessage = (event: WebSocketMessageEvent) => {
      if (typeof event.data === 'string') {
        try {
          const data: WebSocketResponse = JSON.parse(event.data);
          // Check if the data matches the expected structure, for the purpose of the assesment 
          //I filtered out auth responses instead of verifying etc, in a real world scenario this would be part of state
          if (data.s && data.p !== undefined && data.q !== undefined && data.t !== undefined) {
            this.emit('message', data);
          } else {
            console.log('Skipped data due to unexpected structure:', data);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (event: Event) => {
      console.log('WebSocket error:', event);
    };
  }



  public async subscribe(tickerCode: string): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        action: 'subscribe',
        symbols: tickerCode,
      });
      this.ws.send(message);
    } else {
      if (this.connectionPromise) {
        await this.connectionPromise;
        this.connectionPromise = null; // Reset the promise after use
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            action: 'subscribe',
            symbols: tickerCode,
          });
          this.ws.send(message);
        } else {
          console.log('WebSocket is not open. Unable to subscribe.');
        }
      }
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public on(event: string, listener: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  public off(event: string, listener: EventCallback): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  private emit(event: string, data: WebSocketResponse): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => {
      setTimeout(() => listener(data), this.emitDelay);
    });
  }

  public setEmitDelay(seconds: number): void {
    this.emitDelay = seconds * 1000; // Convert seconds to milliseconds
  }
}

export default WebSocketService;
