import { Axe, Corner, Side } from "@nui-tools/canvas";
import { element, property } from "@nui-tools/element";
import * as utils from "@nui-tools/canvas";
import { throttle } from "@nui-tools/timeout";
import styles from "!!raw-loader!sass-loader!./index.scss";

const template = document.createElement('template');
template.innerHTML = `
<style>${styles}</style>
<img alt="Image cropped" />
<canvas id="back"></canvas>
<section id="backdrop"></section>
<canvas id="front"></canvas>
<input type="file" />
`;

enum ExportType {
  BASE_64 = 'base64',
  FILE = 'file',
}

@element('cropper')
export class HTMLImageCropElement extends HTMLElement {
  readonly #shadow: ShadowRoot;
  readonly #front: CanvasRenderingContext2D;
  readonly #back: CanvasRenderingContext2D;
  readonly #img: HTMLImageElement;
  #scale: number = 1;

  @property()
  public set height(value: number|null) {
    this.render();
  }

  @property()
  public set src(value: string|null) {
    this.load().then(this.render);
  }

  @property()
  public set width(value: number|null) {
    this.render();
  }

  @property()
  public set x(value: number|null) {
    this.render();
  }

  @property()
  public set y(value: number|null) {
    this.render();
  }

  public set rect(rect: DOMRect) {
    this.height = rect.height;
    this.width = rect.width;
    this.x = rect.x;
    this.y = rect.y;
  }

  public get rect() {
    return new DOMRect(
      this.x || 0,
      this.y || 0,
      this.width || 0,
      this.height || 0,
    );
  }

  public constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#shadow.appendChild(template.content.cloneNode(true));
    this.#front = (this.#shadow.getElementById('front') as HTMLCanvasElement).getContext('2d')!;
    this.#back = (this.#shadow.getElementById('back') as HTMLCanvasElement).getContext('2d')!;
    this.#img = this.#shadow.querySelector('img')!;
  }

  public connectedCallback() {
    this.addEventListener('keydown', this.#onKeyDown);
    this.addEventListener('mousemove', this.#onMouseMove);
    this.addEventListener('touchmove', this.#onTouchMove);
    window.addEventListener('resize', this.#onResize);
    this.load().then(() => {
      this.render();
    });

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '-1');
    }
  }

  public disconnectedCallback() {
    this.removeEventListener('keydown', this.#onKeyDown);
    this.removeEventListener('mousemove', this.#onMouseMove);
    this.removeEventListener('touchmove', this.#onTouchMove);
    window.removeEventListener('resize', this.#onResize);
  }

  public center = (axe: Axe) => {
    utils.centerImage(this.rect, this.#img, axe);
  }

  public clip = (side: Corner | Side) => {
    utils.clipImage(this.rect, this.#img, side);
  }

  public crop = (type?: ExportType, mimeType?: string) => {
    switch (type) {
      case ExportType.BASE_64:
        return this.cropAsBase64(mimeType);
      case ExportType.FILE:
      default:
        return this.cropAsFile(mimeType);
    }
  }

  public cropAsBase64 = (mimeType: string = 'image/png') => {
    return Promise.resolve(this.#front.canvas.toDataURL(mimeType));
  }

  public cropAsFile = (mimeType: string = 'image/png') => {
    return new Promise((resolve) => {
      this.#front.canvas.toBlob(resolve, mimeType);
    });
  }

  public load = () => {
    return new Promise<void>((resolve) => {
      const rect = this.getBoundingClientRect();
      this.#front.fillStyle = 'transparent';
      this.#front.fillRect(0, 0, rect.width, rect.height);
      this.#back.fillStyle = 'transparent';
      this.#back.fillRect(0, 0, rect.width, rect.height);

      if (this.#img.src) {
        this.removeAttribute('x');
        this.removeAttribute('y');
      }

      if (null === this.src) {
        this.#img.removeAttribute('src');
        resolve();
      } else {
        this.#img.setAttribute('src', this.src || '');
        this.#img.addEventListener('load', () => {
          const rect = this.rect;
          rect.height = this.#img.naturalHeight;
          rect.width = this.#img.naturalWidth;
          this.rect = utils.centerImage(rect, this.#img, Axe.BOTH);
          resolve();
        });
      }
    });
  }

  public move = (field: 'x'|'y', value: number, active: boolean) => {
    const previousField = `prev${field.toUpperCase()}` as keyof this;
    const previousValue = this[previousField] as number;
    const setPreviousValue = (value: number|null) => this[previousField] = value as any;
    const setValue = (value: number|null) => this[field] = value as any;

    if (active) {
      if (null === previousValue) setPreviousValue(value);
      if (Math.abs(previousValue - value) > this.#scale) {
        const dir = previousValue > value ? -1 : 1;
        const length = Math.floor(Math.abs(previousValue - value) / this.#scale);

        setPreviousValue(previousValue + (length * this.#scale) * dir);
        setValue(length * dir);
      }
    } else {
      setPreviousValue(null);
    }
  }

  public render = () => {
    if (!this.#img.complete) return;
    if (!this.height) return;
    if (!this.width) return;
    if (null === this.x || Number.isNaN(this.x)) return;
    if (null === this.y || Number.isNaN(this.y)) return;

    const clientRect = this.getBoundingClientRect();
    this.#scale = utils.getScale(clientRect, this.width, this.height);
    utils.drawDualCanvas(this.#img, this.#front, this.#back, clientRect, this.rect, this.#scale);
  }

  #onKeyDown = (evt: KeyboardEvent) => {
    if (null === this.width || null === this.height) return;
    if (null === this.x || null === this.y) return;

    switch (evt.key) {
      case 'ArrowLeft':
        evt.preventDefault();
        this.x -= evt.shiftKey ? Math.ceil(this.width / 10) : 1;
        break;
      case 'ArrowRight':
        evt.preventDefault();
        this.x += evt.shiftKey ? Math.ceil(this.width / 10) : 1;
        break;
      case 'ArrowUp':
        evt.preventDefault();
        this.y -= evt.shiftKey ? Math.ceil(this.height / 10) : 1;
        break;
      case 'ArrowDown':
        evt.preventDefault();
        this.y += evt.shiftKey ? Math.ceil(this.height / 10) : 1;
        break;
      case 'Home':
        evt.preventDefault();
        this.clip(Side.LEFT);
        break;
      case 'End':
        evt.preventDefault();
        this.clip(Side.RIGHT);
        break;
      case 'PageUp':
        evt.preventDefault();
        this.clip(Side.TOP);
        break;
      case 'PageDown':
        evt.preventDefault();
        this.clip(Side.BOTTOM);
        break;
      case '.':
        evt.preventDefault();
        this.center(Axe.BOTH);
        break;
    }
  };

  #onMouseMove = throttle((evt: MouseEvent) => {
    this.move('x', evt.clientX, !!(evt.buttons & 1));
    this.move('y', evt.clientY, !!(evt.buttons & 1));
  }, 5);

  #onResize = () => {
    this.render();
  };

  #onTouchMove = throttle((evt: TouchEvent) => {
    this.move('x', evt.touches[0].clientX, true);
    this.move('y', evt.touches[0].clientY, true);
  }, 5, (evt: TouchEvent) => {
    evt.preventDefault();
  });
}
