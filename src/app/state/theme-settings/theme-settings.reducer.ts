import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { Color } from 'src/app/models/color.model';

import { ThemeSettingsActions } from './theme-settings.actions';
import { ThemeSettingsState } from './theme-settings.model';

const primaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--primary-font-family');
const secondaryFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--secondary-font-family');
const alternativeFontFamily = getComputedStyle(document.documentElement).getPropertyValue('--alternative-font-family');

const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') as Color;
const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color') as Color;
const tertiaryColor = getComputedStyle(document.documentElement).getPropertyValue('--tertiary-color') as Color;

export const themeSettingsFeatureKey = 'themeSettings';

export const initialState: ThemeSettingsState = {
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    tertiary: tertiaryColor,
  },
  fonts: {
    primary: primaryFontFamily,
    secondary: secondaryFontFamily,
    alternative: alternativeFontFamily,
  },
};

export const reducer = createReducer(
  initialState,
  on(ThemeSettingsActions.setColor, (state, { key, color }) => {
    if (state.colors[key as keyof typeof state.colors] !== color) {
      return { ...state, colors: { ...state.colors, [key as keyof typeof state.colors]: color } };
    }
    return state;
  })
);

export const themeSettingsFeature = createFeature({
  name: themeSettingsFeatureKey,
  reducer,
  extraSelectors: ({ selectColors }) => ({
    selectPrimaryColor: createSelector(selectColors, colors => colors.primary),
  }),
});

export const { selectThemeSettingsState, selectColors, selectFonts, selectPrimaryColor } = themeSettingsFeature;