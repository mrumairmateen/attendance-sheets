import { Component } from '@angular/core';
import { DatFileUploaderComponent } from './dat-file-uploader/dat-file-uploader.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [DatFileUploaderComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent {
}
