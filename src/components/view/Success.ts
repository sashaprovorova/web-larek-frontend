import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<{ total: number }> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, onClose: () => void) {
		super(container);

		// получаем элементы по селекторам
		this._close = ensureElement('.order-success__close', container);
		this._description = ensureElement('.order-success__description', container);

		this._close.addEventListener('click', onClose);
	}

	// устанавливаем и отображаем сумму заказа
	set total(value: number) {
		this.setText(
			this._description,
			`Списано ${value.toLocaleString('ru-RU')} синапсов`
		);
	}
}
