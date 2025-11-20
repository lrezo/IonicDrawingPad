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
    const fileName = `${this.fileBaseName}_${this.formatDateNow()}.png`;
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
      await this.showMessage('Image saved');
    }
    if (Capacitor.getPlatform() === 'ios') {
      await Filesystem.writeFile({
        path: fileName,
        directory: Directory.Documents,
        data: imageBase64Png,
      });
      await this.showMessage('Image saved');
    }
    if (Capacitor.getPlatform() === 'web') {
      await this.saveWithPicker(fileName, imageBase64Png); // it works will all the browwser but not mozilla
      await this.showMessage('Image saved');
    }
  }
  async showMessage(message: string) {
    const info = Capacitor.getPlatform();
    if (info === 'android' || info === 'ios') {
      try {
        await Toast.show({
          text: message,
          duration: 'short',
        });
      } catch {
        alert(message);
      }
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

  async saveWithPicker(fileName: string, base64: string) {
    //@ts-ignore
    const dirHandle = await window.showDirectoryPicker();
    const fileHandle = await dirHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await fileHandle.createWritable();

    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);

    await writable.write(buffer);
    await writable.close();
  }
  formatDateNow(): string {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year}Date ${hour}-${minute}Time`;
  }
}
