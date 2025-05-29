import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { EventEmitter } from './components/base/events';
import { CatalogPage } from './components/view/CatalogPage';
import { Modal } from './components/common/Modal';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IOrderForm, IProduct } from './types';
import { ProductData } from './components/data/ProductData';
import { Card } from './components/view/ProductCard';
import { BasketData } from './components/data/BasketData';
import { Basket } from './components/view/Basket';
import { DeliveryForm } from './components/view/DeliveryForm';
import { ContactForm } from './components/view/ContactForm';
import { OrderFormData } from './components/data/OrderFormData';
import { Success } from './components/view/Success';

// шаблоны
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// инициализация классов
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const page = new CatalogPage(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
const productData = new ProductData(events);
const basketData = new BasketData(events);
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderData = new OrderFormData(events);
const deliveryForm = new DeliveryForm(cloneTemplate(orderTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), () => {
	modal.close();
});

// получаем список товаров
api
	.getProductList()
	.then((products: IProduct[]) => {
		productData.setProducts(products);
	})
	.catch(console.error);

// отображаем товары при изменении
events.on('products:changed', () => {
	page.catalog = productData
		.getProducts()
		.map((product) => createCard(product));
});

// открываем модальное окно и блокируем скролл
events.on('modal:open', () => {
	page.locked = true;
});

// закрываем модальное окно и очищаем формы
events.on('modal:close', () => {
	page.locked = false;
});

// создаем карточку товара и предпросмотра
function createCard(product: IProduct, isPreview = false): HTMLElement {
	const template = isPreview ? cardPreviewTemplate : catalogTemplate;

	const card = new Card(cloneTemplate(template), {
		onClick: () => {
			if (isPreview) {
				events.emit('basket:add', product);
				modal.close();
			} else {
				events.emit('card:select', product);
			}
		},
	});

	card.id = product.id;
	card.title = product.title;
	card.image = product.image;
	card.category = product.category;
	card.description = product.description;
	card.price = product.price;

	if (isPreview) {
		const isInCart = basketData.getItems().some((i) => i.id === product.id);
		const isPriceless = product.price === null;

		if (isInCart) {
			card.setButtonHandler('Удалить из корзины', () => {
				basketData.remove(product.id);
				events.emit('basket:changed', basketData.getItems());
				modal.close();
			});
		} else if (isPriceless) {
			card.button = 'Нельзя купить';
		} else {
			card.button = 'В корзину';
		}
	}

	return card.render(product);
}

// открываем модальное предпросмотра
events.on('card:select', (product: IProduct) => {
	modal.render({
		content: createCard(product, true),
	});
});

// добавляем в корзину
events.on('basket:add', (product: IProduct) => {
	basketData.add(product);
});

// обновляем счетчик товаров в корзине
events.on('basket:changed', (items: IProduct[]) => {
	page.counter = items.length;
});

// отображаем корзину
function renderBasket() {
	const items = basketData.getItems();
	const productItems = items.map((item) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});
		card.title = item.title;
		card.price = item.price;
		card.id = item.id;
		return card.render(item);
	});

	basketView.list = productItems;
	basketView.price = basketData.getTotal();

	modal.render({
		content: basketView.render({}),
	});
	events.emit('modal:open');
}

// открываем корзину
events.on('basket:open', renderBasket);

// закрываем корзину и удаляем из нее товары
events.on('basket:remove', (item: IProduct) => {
	basketData.remove(item.id);
	page.counter = basketData.getItems().length;
	renderBasket();
});

// открываем форму доставки
events.on('order:open', () => {
	orderData.clear();
	deliveryForm.clear();
	modal.render({
		content: deliveryForm.render({
			address: '',
			payment: orderData.payment,
			valid: false,
			errors: '',
		}),
	});
});

// валидируем первую форму
events.on('order:valid', ({ isValid }: { isValid: boolean }) => {
	deliveryForm.valid = isValid;
});

events.on('order:validation-error', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	deliveryForm.errors = Object.values({ payment, address })
		.filter(Boolean)
		.join('; ');
});

// валидируем вторую форму
events.on('contacts:valid', ({ isValid }: { isValid: boolean }) => {
	contactForm.valid = isValid;
});

events.on('contacts:validation-error', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contactForm.errors = Object.values({ email, phone })
		.filter(Boolean)
		.join('; ');
});

// сохраняем инфо о доставке и переходим ко второй форме
events.on('order:submit', () => {
	const isValid = orderData.validateDelivery();
	if (isValid) {
		contactForm.clear();
		modal.render({
			content: contactForm.render({
				email: '',
				phone: '',
				valid: false,
				errors: '',
			}),
		});
	}
});

// обрабатываем ввод
events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		orderData.setField(data.field, data.value);
	}
);

// делаем финальную проверку заказа перед отправкой
events.on('contacts:submit', () => {
	if (orderData.validateContacts()) {
		const payload = {
			...orderData.getFormData(),
			items: basketData.getItems().map((i) => i.id),
			total: basketData.getTotal(),
		};
		api
			.orderProducts(payload)
			.then((res) => {
				modal.render({
					content: success.render({ total: res.total }),
				});
				orderData.clear();
				basketData.clear();
				page.counter = 0;
				contactForm.clear();
				deliveryForm.clear();
			})
			.catch(console.error);
	} else {
		events.emit(
			'contacts:validation-error',
			orderData.getContactValidationErrors()
		);
	}
});
