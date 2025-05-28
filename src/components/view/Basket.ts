import { Component } from '../base/Component';
import { IBasketView, IEvents } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// получаем элементы из шаблона корзины
		this._list = ensureElement('.basket__list', container);
		this._price = ensureElement('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this._button.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}

	// отображаем список товаров
	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
		this._button.disabled = items.length === 0;
	}

	// отображаем итоговую стоимость
	set price(value: number) {
		this.setText(this._price, `${value.toLocaleString('ru-RU')} синапсов`);
	}

	// диактивируем кнопку оформить
	disableButton() {
		this._button.disabled = true;
	}
}
