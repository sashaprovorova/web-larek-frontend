import { IProduct } from '../../types';
import { IEvents } from '../../types';

export class BasketData {
	protected items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	// добавить товар в корзину
	add(product: IProduct) {
		if (!this.items.find((item) => item.id === product.id)) {
			this.items.push(product);
			this.events.emit('basket:changed', this.items);
		}
	}

	// получить все продукты
	getItems() {
		return this.items;
	}

	// получаем общую стоимость
	getTotal() {
		return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
	}

	// удаляем продукт по йади
	remove(productId: string) {
		this.items = this.items.filter((item) => item.id !== productId);
		this.events.emit('basket:changed', this.items);
	}

	// очищаем корзину
	clear() {
		this.items = [];
		this.events.emit('basket:cleared');
	}
}
