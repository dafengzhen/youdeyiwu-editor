import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import browseFilesIcon from '../theme/icons/browse-files.svg';

export default class YwBoxUi extends Plugin {
    static get pluginName() {
        return 'YwBoxUi';
    }
    afterInit() {
        const editor = this.editor;
        const t = editor.t;
        const ywbox = editor.commands.get('ywbox');
        if (!ywbox) {
            return;
        }
        editor.ui.componentFactory.add('ywbox', locale => {
            console.log('YwBoxUi');
            const view = new ButtonView(locale);
            view.set({
                label: t('文件管理'),
                icon: browseFilesIcon,
                tooltip: true
            });
            view.bind('isOn').to(ywbox, 'value');
            view.bind('isEnabled').to(ywbox, 'isEnabled');
            view.on('execute', () => {
                editor.execute('ywbox');
            });
            return view;
        });
    }
}
