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

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const page = new CatalogPage(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);
const productData = new ProductData(events);

const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

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
