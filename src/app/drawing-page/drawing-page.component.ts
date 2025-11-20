import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonFooter,
} from '@ionic/angular/standalone';

import { DrawingService } from '../drawing-service';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-drawing-page',
  standalone: true,
  templateUrl: './drawing-page.component.html',
  styleUrls: ['./drawing-page.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonBackButton,
  ],
})
export class DrawingPageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private drawing = false;

  color = '#000000';
  size = 5;
  private canvasBgColor = '#ffffff';

  constructor(private drawingService: DrawingService) {}

  // --- init canvas after layout ---
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    requestAnimationFrame(() => this.initCanvas());
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      console.warn('Canvas element not found');
      return;
    }

    const parent = canvas.parentElement as HTMLElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;

    console.log('Canvas parent size:', width, height);

    if (width === 0 || height === 0) {
      console.warn('Canvas parent has zero size');
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    console.log('Got ctx?', !!ctx);
    if (!ctx) return;

    this.ctx = ctx;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = this.size;

    this.canvasBgColor = this.getCssVar('--ion-background-color', '#ffffff');
    this.color = this.getCssVar('--ion-text-color', '#000000');

    this.ctx.fillStyle = this.canvasBgColor;
    this.ctx.fillRect(0, 0, width, height);
  }

  // --- helpers ---
  private getCssVar(name: string, fallback: string): string {
    // Try on <html>
    const fromRoot = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    if (fromRoot) return fromRoot;

    // Try on <body> (Ionic sometimes sets vars here)
    const fromBody = getComputedStyle(document.body)
      .getPropertyValue(name)
      .trim();

    return fromBody || fallback;
  }

  private getPos(
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } | null {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }

    const touch = event.touches[0] || event.changedTouches[0];
    if (!touch) return null;

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  startDrawing(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    if (!this.ctx) {
      console.warn('startDrawing: ctx not ready');
      return;
    }

    const pos = this.getPos(event);
    console.log('startDrawing', pos);
    if (!pos) return;

    this.drawing = true;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
  }

  draw(event: MouseEvent | TouchEvent): void {
    if (!this.drawing || !this.ctx) return;

    event.preventDefault();
    const pos = this.getPos(event);
    // console.log('draw', pos);
    if (!pos) return;

    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.size;
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  endDrawing(): void {
    this.drawing = false;
  }

  clearCanvas(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    this.canvasBgColor = this.getCssVar(
      '--ion-background-color',
      this.canvasBgColor
    );
    this.ctx.fillStyle = this.canvasBgColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- controls ---

  onColorChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.color = input.value;
  }

  onSizeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.size = Number(input.value);
  }

  // --- save via service ---

  async save(): Promise<void> {
    if (!this.ctx) return;

    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL('image/png');
    const base64 = dataUrl.split(',')[1];

    await this.drawingService.SaveDrawing(base64);
  }
}
