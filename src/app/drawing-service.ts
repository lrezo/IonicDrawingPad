import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  folder: 'documents' | 'pictures' | 'downloads' = 'documents';
  fileBaseName!: string;

  setDestination(folder: 'documents' | 'pictures' | 'downloads') {
    this.folder = folder;
  }
  getDestination() {
    return {
      folder: this.folder,
    };
  }

  async SaveDrawing(imageBase64Png: string): Promise<void> {
    await this.requestAndroidPermissions();
    const timeStamp = new Date().getTime();
    const fileName = `${this.fileBaseName}_${timeStamp}.png`;
    if (Capacitor.getPlatform() === 'android') {
      if (this.folder === 'pictures') {
        await Filesystem.writeFile({
          path: `Pictures/${fileName}`,
          directory: Directory.ExternalStorage,
          data: imageBase64Png,
          recursive: true,
        });
      }

      if (this.folder === 'downloads') {
        await Filesystem.writeFile({
          path: `Download/${fileName}`,
          directory: Directory.ExternalStorage,
          data: imageBase64Png,
          recursive: true,
        });
      }

      await Filesystem.writeFile({
        path: fileName,
        directory: Directory.Documents,
        data: imageBase64Png,
      });
    }
    if (Capacitor.getPlatform() === 'ios') {
      await Filesystem.writeFile({
        path: fileName,
        directory: Directory.Documents,
        data: imageBase64Png,
      });
    }
    //return this.saveWithPicker(imageBase64Png);
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
  async requestAndroidPermissions() {
    if (Capacitor.getPlatform() !== 'android') return;

    // Step 1 — See current permission state
    const status = await Filesystem.checkPermissions();

    if (status.publicStorage === 'granted') {
      return; // already allowed
    }

    // Step 2 — Ask user for permission
    const result = await Filesystem.requestPermissions();

    console.log('Permission request result:', result);
  }

  async saveWithPicker(base64: string) {
    //@ts-ignore
    const dirHandle = await window.showDirectoryPicker();
    const fileHandle = await dirHandle.getFileHandle(
      `drawing_${Date.now()}.png`,
      { create: true }
    );
    const writable = await fileHandle.createWritable();

    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);

    await writable.write(buffer);
    await writable.close();
  }
}
