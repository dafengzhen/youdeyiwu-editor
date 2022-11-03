import { Plugin } from 'ckeditor5/src/core';
import type { EditorWithUI } from 'ckeditor__ckeditor5-core/src/editor/editorwithui';
import { ButtonView } from 'ckeditor5/src/ui';
import browseFilesIcon from '../../theme/icons/browse-files.svg';

export default class YwBoxUi extends Plugin {
	public static override get pluginName(): string {
		return 'YwBoxUi';
	}

	public override afterInit(): void {
		const editor = this.editor as EditorWithUI;
		const t = editor.t;
		const ywbox = editor.commands.get( 'ywbox' );
		if ( !ywbox ) {
			return;
		}

		editor.ui.componentFactory.add( 'ywbox', locale => {
			console.log( 'YwBoxUi' );

			const view = new ButtonView( locale );

			view.set( {
				label: t( '文件管理' ),
				icon: browseFilesIcon,
				tooltip: true
			} );

			view.bind( 'isOn' ).to( ywbox, 'value' );
			view.bind( 'isEnabled' ).to( ywbox, 'isEnabled' );

			view.on( 'execute', () => {
				editor.execute( 'ywbox' );
			} );

			return view;
		} );
	}
}
