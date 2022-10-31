import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import browseFilesIcon from '../theme/icons/browse-files.svg';

export default class YWBoxUi extends Plugin {
  static get pluginName() {
    return 'YWBoxUi';
  }

  afterInit() {
    const editor = this.editor;

    if (!editor.commands.get('ywbox')) {
      return;
    }

    const t = editor.t;
    const componentFactory = editor.ui.componentFactory;

    componentFactory.add('ywbox', (locale) => {
      const command = editor.commands.get('ywbox');

      const button = new ButtonView(locale);

      button.set({
        label: t('文件管理'),
        icon: browseFilesIcon,
        tooltip: true,
      });

      button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

      button.on('execute', () => {
        editor.execute('ywbox');
      });

      return button;
    });
  }
}
