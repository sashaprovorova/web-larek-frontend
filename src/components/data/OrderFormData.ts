import { FormErrors, IOrderForm, PaymentMethod } from '../../types';
import { IEvents } from '../../types';

export class OrderFormData {
	payment: PaymentMethod = 'card';
	address: string = '';
	email: string = '';
	phone: string = '';

	constructor(private events: IEvents) {}

	setField(field: keyof IOrderForm, value: string) {
		if (field === 'payment') {
			if (value === 'cash' || value === 'card') {
				this.payment = value;
			}
		} else if (field === 'address') {
			this.address = value;
		} else if (field === 'email') {
			this.email = value;
		} else if (field === 'phone') {
			this.phone = value;
		}
		// this[field] = value;
		if (field === 'payment' || field === 'address') {
			this.validateDelivery();
			// }
		} else if (field === 'email' || field === 'phone') {
			this.validateContacts();
		}
		this.events.emit('order:changed', { field, value });
	}

	getFormData(): IOrderForm {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	validateDelivery(): boolean {
		const errors: FormErrors = {};

		if (!this.payment) errors.payment = 'Не выбран способ оплаты';
		// if (!this.address) errors.address = 'Не указан адрес';
		if (!this.address?.trim()) errors.address = 'Не указан адрес';

		this.events.emit('order:validation-error', errors);

		const isValid = Object.keys(errors).length === 0;
		this.events.emit('order:valid', { isValid });
		return isValid;
	}

	validateContacts(): boolean {
		const errors: FormErrors = {};

		if (!this.email) errors.email = 'Не указана почта';
		if (!this.phone) errors.phone = 'Не указан номер телефона';

		this.events.emit('order:validation-error', errors);

		const isValid = Object.keys(errors).length === 0;
		this.events.emit('contacts:valid', { isValid });
		return isValid;
	}
	clear() {
		this.payment = 'card';
		this.address = '';
		this.email = '';
		this.phone = '';
	}
}
