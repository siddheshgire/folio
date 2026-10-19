/**
 * FOLIO Real-Time Sync Engine
 * Provides instant zero-latency cross-tab and cross-window real-time synchronization
 * using BroadcastChannel with localStorage fallback.
 */

export type RealtimeEvent =
  | { type: "GROUP_MESSAGE"; groupId: string; message: any }
  | { type: "GROUP_RESOURCE"; groupId: string; resource: any }
  | { type: "GROUP_MEMBER_ADDED"; groupId: string; member: any }
  | { type: "DM_MESSAGE"; chatId: string; message: any }
  | { type: "CAMPUS_USER_REGISTERED"; user: any };

class RealtimeEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: ((event: RealtimeEvent) => void)[] = [];

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("folio_realtime_sync");
        this.channel.onmessage = (e) => {
          this.notify(e.data);
        };
      } catch (err) {
        console.warn("BroadcastChannel not supported, falling back to storage listener", err);
      }
    }

    // Fallback to storage event for older browsers / slow webviews
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === "folio_realtime_event" && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notify(parsed);
          } catch (err) {}
        }
      });
    }
  }

  public broadcast(event: RealtimeEvent) {
    if (this.channel) {
      this.channel.postMessage(event);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("folio_realtime_event", JSON.stringify({ ...event, _t: Date.now() }));
    }
  }

  public subscribe(callback: (event: RealtimeEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify(event: RealtimeEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(event);
      } catch (e) {
        console.error("Realtime event error:", e);
      }
    });
  }
}

export const realtimeEngine = new RealtimeEngine();
