import Command from '@ckeditor/ckeditor5-core/src/command';
import { toMap } from '@ckeditor/ckeditor5-utils';

export default class YWBoxCommand extends Command {
  constructor(editor) {
    super(editor);

    this._chosenAssets = new Set();

    this._isOn = false;

    this._initListeners();
  }

  _initListeners() {
    const editor = this.editor;
    const model = editor.model;
    const ywboxConfig = editor.config.get('ywbox');

    //
    this.on(
      'ywbox',
      () => {
        this.refresh();
      },
      { priority: 'low' }
    );

    //
    this.on('ywbox:open', () => {
      if (typeof ywboxConfig.onOpen === 'function') {
        this._isOn = true;
        ywboxConfig.onOpen({
          onClose: () => this.fire('ywbox:close'),
          onChoose: (assets) => this.fire('ywbox:choose', assets),
        });
      }
    });

    //
    this.on('ywbox:close', () => {
      if (!this._isOn) {
        return;
      }
      this._isOn = false;
    });

    //
    this.on('ywbox:choose', (evt, assets) => {
      if (!this.isEnabled) {
        return;
      }

      const imageCommand = editor.commands.get('insertImage');
      const linkCommand = editor.commands.get('link');

      const assetsToProcess = assets.filter((asset) =>
        asset.isImage === 'image'
          ? imageCommand.isEnabled
          : linkCommand.isEnabled
      );

      if (assetsToProcess.length === 0) {
        return;
      }

      model.change((writer) => {
        for (const asset of assetsToProcess) {
          const isLastAsset =
            asset === assetsToProcess[assetsToProcess.length - 1];

          this._insertAsset(asset, isLastAsset, writer);

          setTimeout(() => this._chosenAssets.delete(asset), 2000);
          this._chosenAssets.add(asset);
        }
      });
    });

    //
    this.listenTo(editor, 'destroy', () => {
      this.fire('ywbox:close');
      this._chosenAssets.clear();
    });
  }

  refresh() {
    this.value = this._getValue();
    this.isEnabled = this._checkEnabled();
  }

  _getValue() {
    return this._isOn;
  }

  _checkEnabled() {
    const imageCommand = this.editor.commands.get('insertImage');
    const linkCommand = this.editor.commands.get('link');
    return !(!imageCommand.isEnabled && !linkCommand.isEnabled);
  }

  _insertAsset(asset, isLastAsset, writer) {
    const editor = this.editor;
    const model = editor.model;
    const selection = model.document.selection;

    writer.removeSelectionAttribute('linkHref');

    if (asset.isImage) {
      this._insertImage(asset);
    } else {
      this._insertLink(asset, writer);
    }

    if (!isLastAsset) {
      writer.setSelection(selection.getLastPosition());
    }
  }

  _insertImage(asset) {
    const editor = this.editor;
    const { urls, originalName } = asset;
    editor.execute('insertImage', {
      source: [
        {
          src: urls.default,
          alt: originalName,
        },
      ],
    });
  }

  _insertLink(asset, writer) {
    const editor = this.editor;
    const model = editor.model;
    const selection = model.document.selection;
    const { urls, originalName } = asset;

    if (selection.isCollapsed) {
      const selectionAttributes = toMap(selection.getAttributes());
      const textNode = writer.createText(originalName, selectionAttributes);
      const range = model.insertContent(textNode);
      writer.setSelection(range);
    }

    editor.execute('link', urls.default);
  }

  execute() {
    this.fire('ywbox:open');
  }
}
