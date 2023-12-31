import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridsterItem } from 'angular-gridster2';
import { ResizeEvent } from 'angular-resizable-element';
import { map, Subscription } from 'rxjs';
import { DynamicComponentType } from 'src/app/models/dynamic-component.model';
import { FontFamily } from 'src/app/models/font-family.enum';
import { ThemeColor } from 'src/app/models/theme-color.enum';
import { Viewport } from 'src/app/models/viewport.enum';
import { AppState } from 'src/app/state/app.reducer';
import { selectPages } from 'src/app/state/design-canvas/design-canvas.reducer';
import { selectIsExporting, selectSidebarOpened, selectViewport } from 'src/app/state/editor/editor.reducer';
import { selectLogo } from 'src/app/state/global-settings/global-settings.reducer';

@Component({
  selector: 'drd-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements DynamicComponentType, OnInit, OnDestroy {
  readonly Viewport = Viewport;
  toolbarHeight = getComputedStyle(document.documentElement).getPropertyValue('--toolbar-height');

  @Input() themeColor: ThemeColor = ThemeColor.Secondary;
  @Input() fontThemeColor?: ThemeColor;
  @Input() themeFontFamily?: FontFamily = FontFamily.Primary;
  @Input() style: object = {};
  @Input() elements: GridsterItem[] = [];
  @Input() resized?: ResizeEvent;

  currentViewport$ = this.store.select(selectViewport);
  isExporting$ = this.store.select(selectIsExporting);
  sidebarOpened$ = this.store.select(selectSidebarOpened);
  isMobile$ = this.breakpointObserver.observe('(max-width: 640px)').pipe(map(result => result.matches));

  pages$ = this.store.select(selectPages);
  logo$ = this.store.select(selectLogo);

  isMenuOpened = false;
  logoSrc: string | null = null;
  subscriptions: Subscription[] = [];

  get backgroundColor() {
    const background = this.style['background-color' as keyof typeof this.style];
    return background ? background : `var(--${this.themeColor}-color)`;
  }

  get color() {
    const color = this.style['color' as keyof typeof this.style];
    return color ? color : this.fontThemeColor ? `var(--${this.fontThemeColor}-color)` : '';
  }

  get fontFamily() {
    return `var(--${this.themeFontFamily?.toLowerCase()}-font-family), var(--alternative-font-family)`;
  }

  get fontSize() {
    const fontSize = this.style['font-size' as keyof typeof this.style];
    return fontSize || '';
  }

  constructor(
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.logo$.subscribe(logo => {
        if (logo) {
          const reader = new FileReader();

          reader.addEventListener('load', () => {
            this.logoSrc = reader.result as string;
          });

          reader.readAsDataURL(logo);
        } else {
          this.logoSrc = null;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
