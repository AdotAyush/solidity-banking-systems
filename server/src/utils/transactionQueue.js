class TransactionQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.workers = [];
  }

  enqueue(transaction) {
    this.queue.push({
      ...transaction,
      queuedAt: Date.now(),
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
    this.processQueue();
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      try {
        // Emit event for worker to process
        this.emit('transaction:process', item);
      } catch (error) {
        console.error('Error processing queue item:', error);
        this.emit('transaction:error', { item, error });
      }
    }

    this.processing = false;
  }

  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      workers: this.workers.length
    };
  }
}

// Create queue instance with event emitter capabilities
import { EventEmitter } from 'events';
const queue = Object.assign(new TransactionQueue(), EventEmitter.prototype);
EventEmitter.call(queue);

export default queue;

