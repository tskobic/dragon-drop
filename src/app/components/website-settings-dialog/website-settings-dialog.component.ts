import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.reducer';

import { ThemeColorsPickerComponent } from '../theme-colors-picker/theme-colors-picker.component';
import { ThemeFontsSelectComponent } from '../theme-fonts-select/theme-fonts-select.component';
import { WebsiteSettingsComponent } from '../website-settings/website-settings.component';

@Component({
  selector: 'drd-website-settings-dialog',
  standalone: true,
  templateUrl: './website-settings-dialog.component.html',
  styleUrls: ['./website-settings-dialog.component.scss'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ThemeColorsPickerComponent,
    ThemeFontsSelectComponent,
    WebsiteSettingsComponent,
  ],
})
export class WebsiteSettingsDialogComponent {
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<WebsiteSettingsDialogComponent>
  ) {}
}
