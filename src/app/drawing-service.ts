import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';
@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  directory: Directory = Directory.Documents;
  fileBaseName!: string;

  setDestination(dir: Directory, fileName: string) {
    this.directory = dir;
    this.fileBaseName = fileName;
  }
  getDestination() {
    return {
      directory: this.directory,
      fileBaseName: this.fileBaseName,
    };
  }

  async SaveDrawing(imageBase64Png: string): Promise<void> {
    const timeStamp = new Date().getTime();
    const filename = `${this.fileBaseName}_${timeStamp}.png`;

    await Filesystem.writeFile({
      path: filename,
      directory: this.directory,
      data: imageBase64Png,
    });
  }
  async showMessage(message: string) {
    const info = await Device.getInfo();
    if (info.platform === 'android' || info.platform === 'ios') {
      await Toast.show({
        text: message,
        duration: 'short',
      });
    } else {
      alert(message);
    }
  }
}
