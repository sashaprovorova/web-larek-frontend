import { IProduct } from '../../types';
import { IEvents } from '../../types';

export class BasketData {
	protected items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	add(product: IProduct) {
		if (!this.items.find((item) => item.id === product.id)) {
			this.items.push(product);
			this.events.emit('basket:changed', this.items);
		}
	}

	getItems() {
		return this.items;
	}

	getTotal() {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	remove(productId: string) {
		this.items = this.items.filter((item) => item.id !== productId);
		this.events.emit('basket:changed', this.items);
	}

	clear() {
		this.items = [];
		this.events.emit('basket:cleared');
	}
}
