import Command from '@ckeditor/ckeditor5-core/src/command';
import { toMap } from '@ckeditor/ckeditor5-utils';

export default class YwBoxCommand extends Command {
    constructor(editor) {
        super(editor);
        this.isOn = false;
        this.initListener();
    }
    initListener() {
        const editor = this.editor;
        const model = editor.model;
        const config = editor.config.get('ywBox');
        if (!config) {
            return;
        }
        this.on('ywbox:open', () => {
            if (typeof config.onOpen !== 'function') {
                return;
            }
            this.isOn = true;
            // noinspection TypeScriptValidateJSTypes
            config.onOpen({
                onClose: () => this.fire('ywbox:close'),
                onSelect: (file) => this.fire('ywbox:select', file)
            });
        });
        this.on('ywbox:close', () => {
            if (!this.isOn) {
                return;
            }
            this.isOn = false;
        });
        this.on('ywbox:select', (evt, file) => {
            if (!this.isEnabled ||
                typeof file !== 'object' ||
                Object.keys(file).length === 0 ||
                !(String(file.id)) ||
                !file.originalName) {
                return;
            }
            if (file.isImage && (!file.urls || typeof file.urls !== 'object' || !file.urls.default)) {
                return;
            }
            model.change(writer => {
                if (file.isImage) {
                    editor.execute('insertImage', {
                        source: [
                            {
                                src: file.urls.default,
                                alt: file.originalName
                            }
                        ]
                    });
                }
                else {
                    const selection = model.document.selection;
                    const selectionAttributes = toMap(selection.getAttributes());
                    selectionAttributes.set('fid', file.id);
                    selectionAttributes.set('fname', file.originalName);
                    const range = model.insertContent(writer.createElement('ywbox', selectionAttributes));
                    writer.setSelection(range);
                }
                this.fire('ywbox:close');
            });
        });
        this.on('destroy', () => {
            this.fire('ywbox:close');
        });
    }
    refresh() {
        // noinspection JSConstantReassignment
        this.value = this.isOn;
        // noinspection JSConstantReassignment
        this.isEnabled = !!this.editor.commands.get('link')?.isEnabled;
    }
    execute() {
        this.fire('ywbox:open');
    }
}
