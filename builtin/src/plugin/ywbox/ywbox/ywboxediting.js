import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import YwBoxCommand from './ywboxcommand';
import {toWidget, viewToModelPositionOutsideModelElement} from '@ckeditor/ckeditor5-widget';

export default class YwBoxEditing extends Plugin {
	static get pluginName() {
		return 'YwBoxEditing';
	}

	init() {
		this.initSchema();
		this.initConversion();
	}

	initSchema() {
		const editor = this.editor;
		const model = editor.model;
		const schema = model.schema;
		const mapper = editor.editing.mapper;
		schema.register('ywbox', {
			inheritAllFrom: '$inlineObject',
			allowAttributes: ['fid', 'fname']
		});
		editor.commands.add('ywbox', new YwBoxCommand(editor));
		mapper.on('viewToModelPosition', viewToModelPositionOutsideModelElement(model, viewElement => viewElement.name === 'a' &&
			viewElement.hasAttribute('fid')));
	}

	initConversion() {
		const editor = this.editor;
		editor.conversion.for('upcast')
			.elementToElement({
				view: {
					name: 'a',
					attributes: {
						'data-fid': /[\s\S]+/
					}
				},
				model: (viewElement, conversionApi) => {
					const modelWriter = conversionApi.writer;
					const child = viewElement.getChild(0);
					if (!child.is('$text') || !child.data) {
						return null;
					}
					const fid = viewElement.getAttribute('data-fid');
					if (!fid) {
						return null;
					}
					if (!conversionApi.consumable.test(viewElement, {attributes: ['data-fid']})) {
						return null;
					}
					conversionApi.consumable.consume(viewElement, {attributes: ['data-fid']});
					return modelWriter.createElement('ywbox', {fid, fname: child.data});
				}
			});
		editor.conversion.for('editingDowncast')
			.elementToElement({
				view: (viewElement, conversionApi) => {
					const modelWriter = conversionApi.writer;
					const fid = viewElement.getAttribute('fid');
					const fname = viewElement.getAttribute('fname');
					if (!fid || !fname) {
						return modelWriter.createEmptyElement('');
					}
					const containerElement = modelWriter.createContainerElement('a', {
						class: 'bg-info bg-opacity-75',
						fid
					}, [modelWriter.createText(fname)]);
					return toWidget(containerElement, modelWriter);
				},
				model: 'ywbox'
			});
		editor.conversion.for('dataDowncast').elementToElement({
			view: (viewElement, conversionApi) => {
				const modelWriter = conversionApi.writer;
				const fid = viewElement.getAttribute('fid');
				const fname = viewElement.getAttribute('fname');
				const iconElement = modelWriter.createContainerElement('i', {class: 'bi bi-file-earmark'});
				const aElement = modelWriter.createContainerElement('a', {class: 'yw-cursor-pointer text-decoration-none', 'data-fid': fid}, [modelWriter.createText(fname)]);
				return modelWriter.createContainerElement('div', {class: 'file d-inline-block'}, [iconElement, aElement]);
			},
			model: 'ywbox'
		});
	}
}
