import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
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
  constructor() {}

  selectedFolder(event: CustomEvent) {
    this.directory = event.detail.value;
  }
  filenameInputChanged(event: CustomEvent) {
    console.log(event.detail.value);
    console.log(this.fileBaseName);
  }
}
