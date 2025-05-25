import { IEvents } from '../../types';

// базовый компонент
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	// инструментарий для работы с DOM в дочерних компонентах

	// переключаем класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// устанавливаем текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// меняем статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// скрываем
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// показываем
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// устанавливаем изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// возвращаем корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
