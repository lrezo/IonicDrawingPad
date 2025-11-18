import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
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
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonButton,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
  ],
})
export class HomePage {
  directory!: string;
  fileBaseName!: string;
  constructor(private drawingService: DrawingService, private router: Router) {}

  selectedFolder(event: CustomEvent) {
    this.directory = event.detail.value;
  }
  filenameInputChanged(event: CustomEvent) {
    console.log(event.detail.value);
    console.log(this.fileBaseName);
  }

  startDrawing() {
    const dir =
      this.directory === 'Documents' ? Directory.Documents : Directory.Data;
    this.drawingService.setDestination(dir, this.fileBaseName);
    this.router.navigate(['/draw']);
  }
}
