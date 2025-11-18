import { Injectable } from '@angular/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
@Injectable({
  providedIn: 'root',
})
export class DrawingService {
  directory: Directory = Directory.Documents;
  fileBaseName: String = `drawing`;

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
}
