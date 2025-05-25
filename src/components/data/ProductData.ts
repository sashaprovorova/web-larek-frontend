import { IProduct } from '../../types';
import { IEvents } from '../../types';

export class ProductData {
	protected _products: IProduct[] = [];
	protected _preview: string | null = null;

	constructor(protected events: IEvents) {}
	setProducts(items: IProduct[]) {
		this._products = items;
		this.events.emit('products:changed', items);
	}

	getProduct(id: string): IProduct | undefined {
		return this._products.find((item) => item.id === id);
	}

	getProducts(): IProduct[] {
		return this._products;
	}

	setPreview(id: string) {
		this._preview = id;
		const product = this.getProduct(id);
		if (product) {
			this.events.emit('product:selected', product);
		}
	}

	clearPreview() {
		this._preview = null;
		this.events.emit('product:previewClear');
	}

	getAll(): IProduct[] {
		return this._products;
	}

	get preview(): string | null {
		return this._preview;
	}
}
