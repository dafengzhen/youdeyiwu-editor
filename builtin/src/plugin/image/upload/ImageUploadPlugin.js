import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ImageUploadAdapter from './ImageUploadAdapter';

/**
 * 图片上传插件.
 *
 * <pre>
 *     ClassicEditor
 *     .create( document.querySelector( '#editor' ), {
 *         extraPlugins: [ ImageUploadPlugin ],
 *         // ...
 *     } )
 *     .catch( error => {
 *         console.log( error );
 *     } );
 * </pre>
 */
export default class ImageUploadPlugin extends Plugin {
    static get pluginName() {
        return 'ImageUploadPlugin';
    }
    init() {
        const options = this.editor.config.get('ywImageUpload');
        if (!options) {
            return;
        }
        this.editor.plugins.get('FileRepository').createUploadAdapter = loader => new ImageUploadAdapter(loader, options);
    }
}
