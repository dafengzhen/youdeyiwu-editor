import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import UploadAdapter from './UploadAdapter';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

/**
 * 上传插件.
 */
export default class UploadAdapterPlugin extends Plugin {
  static get pluginName() {
    return 'UploadAdapterPlugin';
  }

  static get requires() {
    return [FileRepository];
  }

  init() {
    const options = this.editor.config.get('upload');
    if (!options) {
      return;
    }

    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) =>
      new UploadAdapter(loader, options);
  }
}
