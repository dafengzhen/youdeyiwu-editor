import { Plugin } from 'ckeditor5/src/core';
import YwBoxEditing from './ywboxediting';
import YwBoxUi from './ywboxui';

/**
 * 文件管理.
 */
export default class YwBox extends Plugin {
	public static override get pluginName(): string {
		return 'YwBox';
	}

	public static override get requires(): Array<typeof Plugin> {
		return [ YwBoxEditing, YwBoxUi ];
	}
}
