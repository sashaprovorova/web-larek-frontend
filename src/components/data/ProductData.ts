import { IProduct } from '../../types';
import { IEvents } from '../../types';

export class ProductData {
	protected _products: IProduct[] = [];
	// protected _preview: string | null = null;

	constructor(protected events: IEvents) {}

	// устанавливаем все продукты
	setProducts(items: IProduct[]) {
		this._products = items;
		this.events.emit('products:changed', items);
	}

	// выбираем товар по йади
	getProduct(id: string): IProduct | undefined {
		return this._products.find((item) => item.id === id);
	}

	// выбираем все продукты
	getProducts(): IProduct[] {
		return this._products;
	}
}
