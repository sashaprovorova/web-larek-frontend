import { IEvents, IModalData } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', (e) => {
			if (e.target === this.container) {
				this.close();
			}
		});
		this._content.addEventListener('click', (e) => e.stopPropagation());
	}

	set content(value: HTMLElement) {
		if (value) {
			this._content.replaceChildren(value);
		}
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren();
		this.events.emit('modal:close');
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.content = data.content;
		this.open();
		return this.container;
	}
}
