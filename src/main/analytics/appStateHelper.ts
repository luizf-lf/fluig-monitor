/**
 * Helper class to track the app state engagement time.
 */
class AppStateHelper {
  public currentState: string;

  public availableStates = {
    STARTED: 'STARTED',
    MINIMIZED: 'MINIMIZED',
    RESTORED: 'RESTORED',
    CLOSED: 'CLOSED',
  };

  public minimizedAt: number;

  public restoredAt: number;

  public startedAt: number;

  constructor() {
    this.currentState = this.availableStates.STARTED;
    this.minimizedAt = 0;
    this.restoredAt = 0;
    this.startedAt = Date.now();
  }

  setIsStarted() {
    this.currentState = this.availableStates.STARTED;
    this.startedAt = Date.now();
  }

  setIsMinimized() {
    this.currentState = this.availableStates.MINIMIZED;
    this.minimizedAt = Date.now();
  }

  setIsRestored() {
    this.currentState = this.availableStates.RESTORED;
    this.restoredAt = Date.now();
  }

  setIsClosed() {
    this.currentState = this.availableStates.CLOSED;
  }

  getEngagementTime() {
    switch (this.currentState) {
      case this.availableStates.STARTED:
        return Date.now() - this.startedAt;
      case this.availableStates.MINIMIZED:
        return this.restoredAt === 0
          ? Date.now() - this.startedAt
          : Date.now() - this.restoredAt;
      case this.availableStates.RESTORED:
        return this.minimizedAt === 0
          ? Date.now() - this.startedAt
          : Date.now() - this.minimizedAt;
      case this.availableStates.CLOSED:
        return Date.now() - this.startedAt;
      default:
        return 0;
    }
  }
}

const appStateHelper = new AppStateHelper();

export default appStateHelper;
