import type { FileLoader } from 'ckeditor__ckeditor5-upload/src/filerepository';
import type { EditorConfig } from 'ckeditor__ckeditor5-core/src/editor/editorconfig';

type ImageUploadOptionsType = EditorConfig & {
	handle: (
		loader: FileLoader,
		options: ImageUploadOptionsType,
		file: File | null,
		resolve: ( value: ( Record<string, string> | PromiseLike<Record<string, string>> ) ) => void,
		reject: ( reason?: any ) => void
	) => void;
	controller: AbortController;
};

/**
 * 图片上传适配器.
 */
export default class ImageUploadAdapter {
	public loader: FileLoader;
	public options: ImageUploadOptionsType;

	constructor( loader: FileLoader, options: ImageUploadOptionsType ) {
		this.loader = loader;
		this.options = options;
	}

	public upload(): Promise<Record<string, string>> {
		return this.loader.file.then(
			file =>
				new Promise( ( resolve, reject ) => {
					this.options.handle(
						this.loader,
						this.options,
						file,
						resolve,
						reject
					);
				} )
		);
	}

	public abort(): void {
		this.options.controller.abort();
	}
}
