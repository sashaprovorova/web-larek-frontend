import { ApiPostMethods } from '../../types';

export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;

	// создаем базовый API запрос и заголовками по умолчанию
	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		};
	}

	// обрабатываем запрос с сервера, если все ок, то обрабатывает, в обратном случае выдаем ошибкуы
	protected handleResponse(response: Response): Promise<object> {
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then((data) => Promise.reject(data.error ?? response.statusText));
	}

	//GET запрос
	get(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse);
	}

	//POST/PUT/DELETE запрос с передачей информации
	post(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse);
	}
}
