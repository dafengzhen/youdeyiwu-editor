import { Plugin } from 'ckeditor5/src/core';
import YwBoxCommand from './ywboxcommand';
import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import type ModelElement from 'ckeditor__ckeditor5-engine/src/model/element';
import type ContainerElement from 'ckeditor__ckeditor5-engine/src/view/containerelement';
import {
	toWidget,
	viewToModelPositionOutsideModelElement
} from 'ckeditor5/src/widget';

export default class YwBoxEditing extends Plugin {
	public static override get pluginName(): string {
		return 'YwBoxEditing';
	}

	public override init(): void {
		console.log( 'YwBox => init' );

		this.initSchema();
		this.initConversion();
	}

	public initSchema(): void {
		const editor = this.editor as EditorWithUI;
		const model = editor.model;
		const schema = model.schema;
		const mapper = editor.editing.mapper;

		schema.register( 'ywbox', {
			inheritAllFrom: '$inlineObject',
			allowAttributes: [ 'fid', 'fname' ]
		} );
		editor.commands.add( 'ywbox', new YwBoxCommand( editor ) );

		mapper.on(
			'viewToModelPosition',
			viewToModelPositionOutsideModelElement( model, viewElement => viewElement.name === 'a' &&
				viewElement.hasAttribute( 'fid' ) )
		);
	}

	public initConversion(): void {
		const editor = this.editor;

		editor.conversion.for( 'upcast' )
			.elementToElement( {
				view: {
					name: 'a',
					attributes: {
						'data-fid': /[\s\S]+/
					}
				},
				model: ( viewElement, conversionApi ): ModelElement | null => {
					const modelWriter = conversionApi.writer;
					const child = viewElement.getChild( 0 );
					if ( !child.is( '$text' ) || !child.data ) {
						return null;
					}

					const fid = viewElement.getAttribute( 'data-fid' );
					if ( !fid ) {
						return null;
					}

					if ( !conversionApi.consumable.test( viewElement, { attributes: [ 'data-fid' ] } ) ) {
						return null;
					}
					conversionApi.consumable.consume( viewElement, { attributes: [ 'data-fid' ] } );
					return modelWriter.createElement( 'ywbox', { fid, fname: child.data } );
				}
			} );
		editor.conversion.for( 'editingDowncast' )
			.elementToElement( {
				view: ( viewElement, conversionApi ): ContainerElement => {
					const modelWriter = conversionApi.writer;
					const fid = viewElement.getAttribute( 'fid' ) as string;
					const fname = viewElement.getAttribute( 'fname' ) as string;
					if ( !fid || !fname ) {
						return modelWriter.createEmptyElement( '' );
					}

					const containerElement = modelWriter.createContainerElement( 'a', {
						class: 'bg-info bg-opacity-75',
						fid
					}, [ modelWriter.createText( fname ) ] as any );
					return toWidget( containerElement, modelWriter );
				},
				model: 'ywbox'
			} );
		editor.conversion.for( 'dataDowncast' ).elementToElement( {
			view: ( viewElement, conversionApi ): ContainerElement => {
				const modelWriter = conversionApi.writer;
				const fid = viewElement.getAttribute( 'fid' ) as string;
				const fname = viewElement.getAttribute( 'fname' ) as string;
				const iconElement = modelWriter.createContainerElement( 'i', { class: 'bi bi-file-earmark' } );
				const aElement = modelWriter.createContainerElement(
					'a',
					{ class: 'yw-cursor-pointer text-decoration-none', 'data-fid': fid },
					[ modelWriter.createText( fname ) ] as any
				);
				return modelWriter.createContainerElement(
					'div',
					{ class: 'file d-inline-block' },
					[ iconElement, aElement ] as any
				);
			},
			model: 'ywbox'
		} );
	}
}

