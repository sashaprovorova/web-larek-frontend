import { Component } from '../base/Component';
import { IEvents, IFormState } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		// получаем элементы формы
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		// следим за вводом и отправкой
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			console.log('[form:input]', field, value);
			this.onInputChange(field, value);
		});
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	// обрабатываем изменение поля
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit('orderInput:change', { field, value });
	}

	// управление кнопкой отправки
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// установка текста ошибки
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	//  отображение состояние формы
	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}
