import { Command } from 'ckeditor5/src/core';
import type Editor from 'ckeditor__ckeditor5-core/src/editor/editor';
import { toMap } from 'ckeditor5/src/utils';

export default class YwBoxCommand extends Command {
	private isOn = false;

	constructor( editor: Editor ) {
		super( editor );
		this.initListener();
	}

	public initListener(): void {
		const editor = this.editor;
		const model = editor.model;
		const config = editor.config.get( 'ywBox' );
		if ( !config ) {
			return;
		}

		this.on(
			'ywbox',
			() => {
				this.refresh();
			},
			{ priority: 'low' }
		);
		this.on( 'ywbox:open', () => {
			if ( typeof config.onOpen !== 'function' ) {
				return;
			}
			this.isOn = true;

			// noinspection TypeScriptValidateJSTypes
			config.onOpen( {
				onClose: () => this.fire( 'ywbox:close' ),
				onSelect: ( file: any ) => this.fire( 'ywbox:select', file )
			} );
		} );
		this.on( 'ywbox:close', () => {
			this.isOn = false;
		} );
		this.on( 'ywbox:select', ( evt, file ) => {
			if ( !this.isEnabled ||
				typeof file !== 'object' ||
				Object.keys( file ).length === 0 ||
				!( String( file.id ) ) ||
				!file.originalName
			) {
				return;
			}

			if ( file.isImage && ( !file.urls || typeof file.urls !== 'object' || !file.urls.default ) ) {
				return;
			}

			model.change( writer => {
				if ( file.isImage ) {
					editor.execute( 'insertImage', {
						source: [
							{
								src: file.urls.default,
								alt: file.originalName
							}
						]
					} );
				} else {
					const selection = model.document.selection;
					const selectionAttributes = toMap( selection.getAttributes() as any );
					selectionAttributes.set( 'fid', file.id );
					selectionAttributes.set( 'fname', file.originalName );
					const range = model.insertContent( writer.createElement( 'ywbox', selectionAttributes as any ) );
					writer.setSelection( range );
				}
				this.fire( 'ywbox:close' );
			} );
		} );
		this.on( 'destroy', () => {
			this.fire( 'ywbox:close' );
		} );
	}

	public override refresh(): void {
		// noinspection JSConstantReassignment
		this.value = this.isOn;
		// noinspection JSConstantReassignment
		this.isEnabled = !!this.editor.commands.get( 'link' )?.isEnabled;
	}

	public override execute(): void {
		this.fire( 'ywbox:open' );
	}
}
