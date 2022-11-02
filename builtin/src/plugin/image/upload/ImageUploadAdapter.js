/**
 * 图片上传适配器.
 */
export default class ImageUploadAdapter {
    constructor(loader, options) {
        this.loader = loader;
        this.options = options;
    }
    upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            this.options.handle(this.loader, this.options, file, resolve, reject);
        }));
    }
    abort() {
        this.options.controller.abort();
    }
}
