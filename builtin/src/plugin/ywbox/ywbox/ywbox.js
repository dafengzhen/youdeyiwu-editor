import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import YWBoxEditing from './ywboxediting';
import YWBoxUi from './YWBoxUi';
import YWBoxCommand from './ywboxcommand';

/**
 * 文件管理.
 */
export default class YWBox extends Plugin {
  static get pluginName() {
    return 'YWBox';
  }

  static get requires() {
    return [YWBoxEditing, YWBoxUi];
  }
}
