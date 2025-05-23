import { Component, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { IftaLabelModule } from 'primeng/iftalabel'
import { InputTextModule } from 'primeng/inputtext'
// import { Message } from 'primeng/message'
import { FieldErrorComponent } from '../field-error/field-error.component'
import { ButtonModule } from 'primeng/button'
import { CommonModule } from '@angular/common'
import { SelectModule } from 'primeng/select'
import { ImageUploaderComponent } from '@app/components/image-uploader/image-uploader.component'

@Component({
	selector: 'app-crud-form',
	imports: [CommonModule, ButtonModule, SelectModule, FormsModule, ReactiveFormsModule,
		IftaLabelModule, FieldErrorComponent, InputTextModule, ImageUploaderComponent],
	templateUrl: './crud-form.component.html',
})

export class CrudFormComponent {
	@Input() sectionForm!: FormGroup;
	@Input() formFields: any[] = []
	@Input() formSize: string = 'LARGE'
	@Input() loading: boolean = false
	@Input() existingImageUrl: string | null = null;
	@Output() submitFormEvent = new EventEmitter<any>();

	imageChangedEvent: any = '';
	croppedImage: any = '';

	get saveBtnLabel(): string {
		return this.loading ? 'Saving...' : 'Save';
	}

	ngOnInit() {
		if (this.sectionForm.get('image')?.value && !this.croppedImage) {
			this.existingImageUrl = this.sectionForm.get('image')?.value;
		}
	}

	submitForm() {
		this.submitFormEvent.emit(this.sectionForm.value)
	}

	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}

	

	loadExistingImage(url: string) {
		this.existingImageUrl = url;
	}


	// #region Image Upload
	triggerImageUpload() {
		const inputElement = document.getElementById('imageInput') as HTMLInputElement;
		inputElement.click();
	}

	onImageDeleted() {
		console.error('Image deleted');
		// this.sectionForm.get('image')?.setValue(null);
	}

	// onImageCropped(imageBase64: string): void {
	// 	this.sectionForm.get('image')?.setValue(imageBase64);
	// }

	// imageCropped(event: ImageCroppedEvent) {
	// 	this.croppedImage = event.base64;
	// 	this.sectionForm.get('image')?.setValue(this.croppedImage);
	// }

	// #endregion
	
}
