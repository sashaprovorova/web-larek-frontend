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

	constructor(container: HTMLElement, actions?: ICardAction) {
		super(container);

		// получаем элементы из шаблона
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector('.card__button');

		// обрабатываем клик по товару
		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	// устанавливаем айди товара
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	// устанавливаем название
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	// устанавливаем картинку
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// устанавливаем описание
	set description(value: string) {
		this.setText(this._description, value);
	}

	// устанавливаем цену
	set price(value: number | null) {
		const displayPrice =
			value != null ? `${value.toLocaleString('ru-RU')} синапсов` : 'Бесценно';
		this.setText(this._price, displayPrice);
		this._button && (this._button.disabled = value == null);
	}

	// устанавливаем категорию
	set category(value: ProductCategory) {
		this.setText(this._category, value);
		const className = this._productCategory.get(value);
		if (className && this._category) {
			this._category.classList.add(className);
		}
	}

	// устанавливаем надпись на кнопке
	set button(value: string) {
		if (this._button) {
			this.setText(this._button, value);
		}
	}

	// меняем обработчик кнопки с текстом
	setButtonHandler(text: string, onClick: () => void) {
		if (this._button) {
			this.setText(this._button, text);
			this._button.disabled = false;
			this._button.onclick = onClick;
		}
	}
}
