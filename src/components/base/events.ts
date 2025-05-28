import {
	EventName,
	Subscriber,
	EmitterEvent,
	IEvents,
} from '../../types/index';

// брокер событий, классическая реализация,
// в расширенных вариантах есть возможность подписаться на все события или слушать события по шаблону например
export class EventEmitter implements IEvents {
	_events: Map<EventName, Set<Subscriber>>;

	constructor() {
		this._events = new Map<EventName, Set<Subscriber>>();
	}

	// установить обработчик на событие
	on<T extends object>(eventName: EventName, callback: (event: T) => void) {
		if (!this._events.has(eventName)) {
			this._events.set(eventName, new Set<Subscriber>());
		}
		this._events.get(eventName)?.add(callback);
	}

	//  снять обработчик с события
	off(eventName: EventName, callback: Subscriber) {
		if (this._events.has(eventName)) {
			this._events.get(eventName)!.delete(callback);
			if (this._events.get(eventName)?.size === 0) {
				this._events.delete(eventName);
			}
		}
	}

	//  инициировать событие с данными
	emit<T extends object>(eventName: string, data?: T) {
		this._events.forEach((subscribers, name) => {
			if (name === '*')
				subscribers.forEach((callback) =>
					callback({
						eventName,
						data,
					})
				);
			if (
				(name instanceof RegExp && name.test(eventName)) ||
				name === eventName
			) {
				subscribers.forEach((callback) => callback(data));
			}
		});
	}

	//  слушать все события
	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*', callback);
	}

	//  сбросить все обработчики
	offAll() {
		this._events = new Map<string, Set<Subscriber>>();
	}

	//  сделать коллбек триггер, генерирующий событие при вызове
	trigger<T extends object>(eventName: string, context?: Partial<T>) {
		return (event: object = {}) => {
			this.emit(eventName, {
				...(event || {}),
				...(context || {}),
			});
		};
	}
}
