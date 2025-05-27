import { Form } from '../common/Form';
import { IContactForm, IEvents } from '../../types';

export class ContactForm extends Form<IContactForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	clear() {
		this.email = '';
		this.phone = '';
		this.container.reset();
	}
}
