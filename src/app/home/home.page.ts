import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Directory } from '@capacitor/filesystem';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

import { DrawingService } from '../drawing-service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
  ],
})
export class HomePage {
  directory: 'Documents' | 'Data' = 'Documents';
  fileBaseName: string = 'drawing';

  constructor(private drawingService: DrawingService, private router: Router) {}

  startDrawing(): void {
    const dir =
      this.directory === 'Documents' ? Directory.Documents : Directory.Data;

    this.drawingService.setDestination(dir, this.fileBaseName);
    this.router.navigate(['/draw']); // adapt to your route
    console.log(this.fileBaseName);
    console.log(this.directory);
  }
}
