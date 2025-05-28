import { IEvents, IPageView } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class CatalogPage extends Component<IPageView> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		// получаем элементы со станицы
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		// обрабатываем событие открытия корзины
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// обновляем счетчик товаров в корзине
	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// устанавливаем содержимое каталога
	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	// блокируем прокрутку страницы
	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}
}
