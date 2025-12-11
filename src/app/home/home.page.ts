import { Component, NgZone } from '@angular/core';
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
  reply = '';
  electronVersion = '';

  selectedFolder: 'documents' | 'pictures' | 'downloads' = 'documents';
  fileBaseName!: string;
  isWindowsPlatform: boolean = false;
  constructor(
    private ngZone: NgZone,
    private drawingService: DrawingService,
    private router: Router
  ) {
    this.electronVersion = window.api.getElectronVersion();
    window.api.ipcSendToMain();
    window.api.ipcReceiveReplyFromMain(
      'do-a-thing-reply',
      (event: any, arg: any) => {
        console.log('Received reply from main process:', arg);
        this.ngZone.run(() => {
          this.reply = arg;
        });
      }
    );
  }

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
