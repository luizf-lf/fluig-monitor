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
    FOCUSED: 'FOCUSED',
    BLURRED: 'BLURRED',
  };

  public minimizedAt: number;

  public restoredAt: number;

  public startedAt: number;

  public blurredAt: number;

  public focusedAt: number;

  constructor() {
    this.currentState = this.availableStates.STARTED;
    this.minimizedAt = 0;
    this.restoredAt = 0;
    this.blurredAt = 0;
    this.focusedAt = Date.now();
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

  setIsBlurred() {
    this.currentState = this.availableStates.BLURRED;
    this.blurredAt = Date.now();
  }

  setIsFocused() {
    this.currentState = this.availableStates.FOCUSED;
    this.focusedAt = Date.now();
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
      case this.availableStates.FOCUSED:
        return this.blurredAt === 0
          ? Date.now() - this.startedAt
          : Date.now() - this.blurredAt;
      case this.availableStates.BLURRED:
        return Date.now() - this.focusedAt;
      default:
        return 0;
    }
  }
}

const appStateHelper = new AppStateHelper();

export default appStateHelper;
