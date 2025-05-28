import {
	FormErrors,
	IOrderForm,
	IOrder,
	PaymentMethod,
	IContactForm,
} from '../../types';
import { IEvents } from '../../types';

export class OrderFormData {
	payment: PaymentMethod = 'card';
	address: string = '';
	email: string = '';
	phone: string = '';

	private touchedFields: Partial<Record<keyof IOrderForm, boolean>> = {};

	constructor(private events: IEvents) {}

	setField(field: keyof IOrderForm, value: string) {
		this.touchedFields[field] = true;

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

		if (field === 'payment' || field === 'address') {
			this.validateDelivery();
		} else if (field === 'email' || field === 'phone') {
			const errors = this.getContactValidationErrors(field);
			this.events.emit('contacts:validation-error', errors);

			const isEmailTouched = this.touchedFields.email;
			const isPhoneTouched = this.touchedFields.phone;
			const isValid =
				!errors.email && !errors.phone && isEmailTouched && isPhoneTouched;

			this.events.emit('contacts:valid', { isValid });
		}
		this.events.emit('order:changed', { field, value });
	}

	getFormData(): IOrder {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
			items: [],
			total: 0,
		};
	}

	validateDelivery(): boolean {
		const errors: FormErrors = {};

		if (this.touchedFields.payment && !this.payment)
			errors.payment = 'Не выбран способ оплаты';
		if (this.touchedFields.address && !this.address?.trim())
			errors.address = 'Не указан адрес';

		this.events.emit('order:validation-error', errors);

		const isValid =
			!errors.address && this.touchedFields.address && !!this.payment;
		this.events.emit('order:valid', { isValid });

		return isValid;
	}

	getContactValidationErrors(field?: 'email' | 'phone'): Partial<IContactForm> {
		const errors: Partial<IContactForm> = {};

		if (!field || field === 'email') {
			if (!this.email?.match(/^\S+@\S+\.\S+$/)) {
				errors.email = 'Некорректный email';
			}
		}

		if (!field || field === 'phone') {
			if (!this.phone?.match(/^(?:\+7|8)\d{10}$/)) {
				errors.phone = 'Номер должен начинаться с +7 или 8 и содержать 11 цифр';
			}
		}

		return errors;
	}

	validateContacts(): boolean {
		const errors: Partial<IContactForm> = {};

		const isValid =
			!errors.email &&
			!errors.phone &&
			this.touchedFields.email &&
			this.touchedFields.phone;

		this.events.emit('contacts:valid', { isValid });
		return isValid;
	}

	getDeliveryData(): Pick<IOrderForm, 'address' | 'payment'> {
		return {
			address: this.address,
			payment: this.payment,
		};
	}

	clear() {
		this.payment = 'card';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.touchedFields = {};
	}
}
