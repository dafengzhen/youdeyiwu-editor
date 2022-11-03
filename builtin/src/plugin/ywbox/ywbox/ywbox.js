import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import YwBoxEditing from './ywboxediting';
import YwBoxUi from './ywboxui';

/**
 * 文件管理.
 */
export default class YwBox extends Plugin {
    static get pluginName() {
        return 'YwBox';
    }
    static get requires() {
        return [YwBoxEditing, YwBoxUi];
    }
}
