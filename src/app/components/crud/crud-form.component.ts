import { Component, Input, Output, EventEmitter, signal, Signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { FieldErrorComponent } from '../field-error/field-error.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-crud-form',
    imports: [ CommonModule, ButtonModule, SelectModule, 
        FormsModule, ReactiveFormsModule, IftaLabelModule, FieldErrorComponent, InputTextModule, ],
    templateUrl: './crud-form.component.html',
})

export class CrudFormComponent {
    @Input() sectionForm!: FormGroup;
    @Input() formFields: any[] = []
    @Input() formSize: string = 'LARGE'
    @Input() loading: boolean = false
    @Output() submitFormEvent = new EventEmitter<any>();

    submitForm() {
        this.submitFormEvent.emit(this.sectionForm.value)
    }
}
