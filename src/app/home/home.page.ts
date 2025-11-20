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
import { Capacitor } from '@capacitor/core';

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
  selectedFolder: 'documents' | 'pictures' | 'downloads' = 'documents';
  fileBaseName!: string;
  isWindowsPlatform: boolean = false;
  constructor(private drawingService: DrawingService, private router: Router) {}

  startDrawing(): void {
    this.drawingService.fileBaseName = this.fileBaseName;
    this.drawingService.setDestination(this.selectedFolder);
    this.router.navigate(['/draw']);
  }
  ngOnInit() {
    if (Capacitor.getPlatform() === 'web') {
      this.isWindowsPlatform = true;
    }
  }
}
