import { Api } from './base/api';
import { ApiListResponse } from '../types';
import { IProduct, IOrder, IOrderStatus, ILarekAPI } from '../types';

export class LarekAPI extends Api implements ILarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseURL: string, options?: RequestInit) {
		super(baseURL, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({ ...item, image: this.cdn + item.image }))
		);
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	orderProducts(order: IOrder): Promise<IOrderStatus> {
		return this.post('/order', order).then((data: IOrderStatus) => data);
	}
}
