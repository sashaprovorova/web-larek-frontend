import { Form } from '../common/Form';
import { IContactForm, IEvents } from '../../types';

export class ContactForm extends Form<IContactForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	// устанавливаем значения почты
	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	// устанавливаем значения номера телефона
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	// очищаем формы и их поля
	clear() {
		this.email = '';
		this.phone = '';
		this.container.reset();
	}
}
