import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // Allow many listeners
  }

  emitTransactionEvent(eventType, data) {
    this.emit('transaction', { type: eventType, data, timestamp: Date.now() });
  }

  emitNotification(userId, message, type = 'info') {
    this.emit('notification', { userId, message, type, timestamp: Date.now() });
  }

  emitBlockchainSync(eventType, data) {
    this.emit('blockchain:sync', { type: eventType, data, timestamp: Date.now() });
  }
}

// Export singleton instance
export default new EventBus();

