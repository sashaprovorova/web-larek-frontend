import { IProduct, ICardAction, ProductCategory } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	protected _productCategory = new Map<ProductCategory, string>([
		['софт-скил', 'card__category_soft'],
		['хард-скил', 'card__category_hard'],
		['другое', 'card__category_other'],
		['дополнительно', 'card__category_extra'],
		['кнопка', 'card__category_button'],
	]);

	protected setImage(
		element: HTMLImageElement | undefined,
		src: string,
		alt?: string
	) {
		if (element) {
			element.src = src;
			if (alt) element.alt = alt;
		}
	}

	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}
	set id(value: string) {
		this.container.dataset.id = value;
	}
	get id(): string {
		return this.container.dataset.id || '';
	}
	set title(value: string) {
		this.setText(this._title, value);
	}
	get title(): string {
		return this._title.textContent || '';
	}
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: number | null) {
		this.setText(this._price, value != null ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled = value === null;
		}
	}

	set category(value: ProductCategory) {
		this.setText(this._category, value);
		// this._category?.classList.add(this._productCategory.get(value) || '');
		const className = this._productCategory.get(value);
		if (className && this._category) {
			this._category.classList.add(className);
		}
	}

	set button(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}
}
