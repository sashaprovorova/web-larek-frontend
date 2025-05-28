import { Form } from '../common/Form';
import { IDeliveryForm, IEvents, IOrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';

export class DeliveryForm extends Form<IDeliveryForm> {
	private _cardButton: HTMLButtonElement;
	private _cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._cardButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);

		this._cashButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);

		// this.togglePayment('card');

		this._cardButton.addEventListener('click', () =>
			this.togglePayment('card')
		);
		this._cashButton.addEventListener('click', () =>
			this.togglePayment('cash')
		);
	}

	private togglePayment(method: 'card' | 'cash') {
		this._cardButton.classList.toggle('button_alt-active', method === 'card');
		this._cashButton.classList.toggle('button_alt-active', method === 'cash');
		this.onInputChange('payment', method);
	}

	override render(data: any): HTMLFormElement {
		super.render(data);
		if (data.payment) this.togglePayment(data.payment);
		return this.container;
	}

	clear() {
		this.container.reset();
		this._cardButton.classList.remove('button_alt-active');
		this._cashButton.classList.remove('button_alt-active');
	}
}
