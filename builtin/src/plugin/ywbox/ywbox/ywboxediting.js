import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import YWBoxCommand from './ywboxcommand';
import { Range } from '@ckeditor/ckeditor5-engine';

export default class YWBoxEditing extends Plugin {
  constructor(editor) {
    super(editor);
  }

  init() {
    const editor = this.editor;

    this._initSchema();
    this._initConversion();
    this._initFixers();

    editor.commands.add('ywbox', new YWBoxCommand(editor));
  }

  _initSchema() {
    const editor = this.editor;
    const schema = editor.model.schema;

    schema.extend('$text', { allowAttributes: 'ywboxLinkId' });

    if (schema.isRegistered('imageBlock')) {
      schema.extend('imageBlock', {
        allowAttributes: ['ywboxImageId', 'ywboxLinkId'],
      });
    }

    if (schema.isRegistered('imageInline')) {
      schema.extend('imageInline', {
        allowAttributes: ['ywboxImageId', 'ywboxLinkId'],
      });
    }
  }

  _initConversion() {
    const editor = this.editor;

    editor.conversion.for('downcast').add((dispatcher) => {
      dispatcher.on(
        'attribute:ywboxLinkId:imageBlock',
        (evt, data, conversionApi) => {
          const { writer, mapper, consumable } = conversionApi;

          console.log('consumable.consume => ', data.item, evt.name);
          if (!consumable.consume(data.item, evt.name)) {
            return;
          }

          const viewFigure = mapper.toViewElement(data.item);
          const linkInImage = [...viewFigure.getChildren()].find(
            (child) => child.name === 'a'
          );

          // No link inside an image - no conversion needed.
          if (!linkInImage) {
            return;
          }

          if (data.item.hasAttribute('ywboxLinkId')) {
            writer.setAttribute(
              'data-ywbox-fid',
              data.item.getAttribute('ywboxLinkId'),
              linkInImage
            );
          } else {
            writer.removeAttribute('data-ywbox-fid', linkInImage);
          }
        },
        { priority: 'low' }
      );

      dispatcher.on(
        'attribute:ywboxLinkId',
        (evt, data, conversionApi) => {
          const { writer, mapper, consumable } = conversionApi;

          if (!consumable.consume(data.item, evt.name)) {
            return;
          }

          if (data.attributeOldValue) {
            const viewElement = createLinkElement(
              writer,
              data.attributeOldValue
            );

            writer.unwrap(mapper.toViewRange(data.range), viewElement);
          }

          if (data.attributeNewValue) {
            const viewElement = createLinkElement(
              writer,
              data.attributeNewValue
            );

            if (data.item.is('selection')) {
              const viewSelection = writer.document.selection;

              writer.wrap(viewSelection.getFirstRange(), viewElement);
            } else {
              writer.wrap(mapper.toViewRange(data.range), viewElement);
            }
          }
        },
        { priority: 'low' }
      );
    });

    editor.conversion.for('upcast').add((dispatcher) => {
      dispatcher.on(
        'element:a',
        (evt, data, conversionApi) => {
          const { writer, consumable } = conversionApi;

          if (!data.viewItem.getAttribute('href')) {
            return;
          }

          const consumableAttributes = { attributes: ['data-ywbox-fid'] };
          if (!consumable.consume(data.viewItem, consumableAttributes)) {
            return;
          }

          const attributeValue = data.viewItem.getAttribute('data-ywbox-fid');
          if (!attributeValue) {
            return;
          }

          if (data.modelRange) {
            for (let item of data.modelRange.getItems()) {
              if (item.is('$textProxy')) {
                item = item.textNode;
              }

              if (shouldUpcastAttributeForNode(item)) {
                writer.setAttribute('ywboxLinkId', attributeValue, item);
              }
            }
          } else {
            const modelElement =
              data.modelCursor.nodeBefore || data.modelCursor.parent;

            writer.setAttribute('ywboxLinkId', attributeValue, modelElement);
          }
        },
        { priority: 'low' }
      );
    });

    editor.conversion.for('downcast').attributeToAttribute({
      model: 'ywboxImageId',
      view: 'data-ywbox-fid',
    });

    editor.conversion.for('upcast').elementToAttribute({
      model: {
        key: 'ywboxImageId',
        value: (viewElement) => viewElement.getAttribute('data-ywbox-fid'),
      },
      view: {
        attributes: {
          'data-ywbox-fid': /[\s\S]+/,
        },
      },
    });
  }

  _initFixers() {
    const editor = this.editor;
    const model = editor.model;
    model.document.registerPostFixer(syncDataIdPostFixer(editor));
  }
}

function shouldUpcastAttributeForNode(node) {
  if (node.is('$text')) {
    return true;
  }

  if (node.is('element', 'imageInline') || node.is('element', 'imageBlock')) {
    return true;
  }

  return false;
}

function createLinkElement(writer, id) {
  const viewElement = writer.createAttributeElement(
    'a',
    { 'data-ywbox-fid': id },
    { priority: 5 }
  );

  writer.setCustomProperty('link', true, viewElement);

  return viewElement;
}

function syncDataIdPostFixer(editor) {
  return (writer) => {
    let changed = false;

    const ywboxCommand = editor.commands.get('ywbox');
    if (!ywboxCommand) {
      return changed;
    }

    for (const entry of editor.model.document.differ.getChanges()) {
      if (entry.type !== 'insert' && entry.type !== 'attribute') {
        continue;
      }

      const range =
        entry.type === 'insert'
          ? new Range(entry.position, entry.position.getShiftedBy(entry.length))
          : entry.range;

      for (const item of range.getItems()) {
        const assets = ywboxCommand._chosenAssets;
        for (const asset of assets) {
          const attributeName = asset.isImage ? 'ywboxImageId' : 'ywboxLinkId';

          if (asset.id === item.getAttribute(attributeName)) {
            continue;
          }

          writer.setAttribute(attributeName, asset.id, item);

          changed = true;
        }
      }
    }

    return changed;
  };
}
