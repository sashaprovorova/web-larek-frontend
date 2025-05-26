import './scss/styles.scss';

import { LarekAPI } from './components/LarekAPI';
import { EventEmitter } from './components/base/events';
import { CatalogPage } from './components/view/CatalogPage';
import { Modal } from './components/common/Modal';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IProduct } from './types';
import { ProductData } from './components/data/ProductData';
import { Card } from './components/view/ProductCard';
import { BasketData } from './components/data/BasketData';
import { Basket } from './components/view/Basket';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const page = new CatalogPage(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
const productData = new ProductData(events);
const basketData = new BasketData(events);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketView = new Basket(cloneTemplate(basketTemplate), events);

api
	.getProductList()
	.then((products: IProduct[]) => {
		productData.setProducts(products);
	})
	.catch(console.error);

events.on('products:changed', () => {
	const cards = productData.getProducts().map((product) => {
		const card = new Card(cloneTemplate(catalogTemplate), {
			onClick: () => events.emit('card:select', product),
		});
		return card.render(product);
	});
	page.catalog = cards;
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('card:select', (product: IProduct) => {
	const preview = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('basket:add', product);
			modal.close();
		},
	});

	preview.id = product.id;
	preview.title = product.title;
	preview.image = product.image;
	preview.category = product.category;
	preview.description = product.description;
	preview.price = product.price;
	preview.button = 'В корзину';

	modal.render({
		content: preview.render(product),
	});
});

events.on('basket:add', (product: IProduct) => {
	basketData.add(product);
});

events.on('basket:changed', (items: IProduct[]) => {
	page.counter = items.length;
});

events.on('basket:open', () => {
	const items = basketData.getItems();
	const productItems = items.map((item, index) => {
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
});

events.on('basket:remove', (item: IProduct) => {
	basketData.remove(item.id);
	page.counter = basketData.getItems().length;
	events.emit('basket:open');
});
