export default class UploadAdapter {
  constructor(loader, options) {
    this.loader = loader;
    this.options = options;
  }

  /**
   * 上传
   */
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this.options.handle(
            this.loader,
            this.options,
            file,
            resolve,
            reject
          );
        })
    );
  }

  /**
   * 终止
   */
  abort() {
    this.options.controller.abort();
  }
}
