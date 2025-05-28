// описываем возможные типы запросов на сервер и ответы на них
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// описываем методы для API
export interface ILarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderStatus>;
}

// описываем базовые типы для EventEmitter
export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
	eventName: string;
	data: unknown;
};

// описываем событийную систему
export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

// Данные и типы данных, используемые в приложении

// описываем категории продаваемого продукта
export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительно'
	| 'кнопка';

// описываем полученный из API продукт
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

// описываем способ оплаты
export type PaymentMethod = 'cash' | 'card';

// описываем форму доставки и информацию о покупателе
export interface IOrderForm {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

// описываем весь заказ
export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

// описываем ответ об оформлении заказа
export interface IOrderStatus {
	id: string;
	total: number;
}

// описываем ошибки валидации
export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

// Слой данных

export interface IProductData {
	products: IProduct[];
	preview: string | null;
	setProducts(items: IProduct[]): void;
	getProduct(id: string): IProduct;
}

export interface IBasketData {
	getProducts(): IProduct[];
	getTotal(): number;
	addProduct(id: IProduct): void;
	deleteProduct(id: IProduct): void;
	clearBasket(): void;
}

export interface IOrderFormData {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
}

//data

export interface IFormState {
	valid: boolean;
	errors: string;
}

// view

export interface IModalData {
	content: HTMLElement;
}

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}

export interface IPageView {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IBasketView {
	list: HTMLElement[];
	price: number;
}

export interface IDeliveryForm {
	payment: PaymentMethod;
	address: string;
}

export interface IContactForm {
	email: string;
	phone: string;
}
