import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { catchError, EMPTY, from, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { GoogleFontsService } from 'src/app/services/google-fonts.service';

import { AppActions } from '../app.actions';
import { AppState, selectHistory } from '../app.reducer';
import { FontsApiActions, ThemeSettingsActions } from './theme-settings.actions';

@Injectable()
export class ThemeSettingsEffects {
  colorChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeSettingsActions.setColor),
        tap(action => {
          document.documentElement.style.setProperty(`--${action.key}-color`, action.color);
        })
      ),
    { dispatch: false }
  );

  fontChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeSettingsActions.setFont),
        tap(action => {
          document.documentElement.style.setProperty(`--${action.key}-font-family`, action.font);
          if (action.key !== 'alternative') {
            let link = document.getElementById(`${action.key}-font`) as HTMLLinkElement | null;
            if (!link) {
              link = document.createElement('link');
              link.id = `${action.key}-font`;
              link.rel = 'stylesheet';
              link.href = `https://fonts.googleapis.com/css2?family=${action.font}:wght@300;400;500;600;700&display=swap`;
              document.head.appendChild(link);
            } else {
              link.href = `https://fonts.googleapis.com/css2?family=${action.font}:wght@300;400;500;600;700&display=swap`;
            }
          }
        })
      ),
    { dispatch: false }
  );

  loadFonts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeSettingsActions.loadFonts),
      switchMap(() =>
        from(this.googleFontsService.getAllFonts()).pipe(
          map(response => {
            const fonts = response.items.slice(0, 200);
            return FontsApiActions.fontsLoadedSuccess({ fontList: fonts });
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  undoRedo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AppActions.undo, AppActions.redo),
        withLatestFrom(this.store.select(selectHistory())),
        tap(([action, history]) => {
          if (!history) return;

          const historyProp = action.type === AppActions.undo.type ? 'undone' : 'undoable';
          const actionType = history[historyProp][0].actions[0].type;

          if (actionType === ThemeSettingsActions.setColor.type || actionType === ThemeSettingsActions.setFont.type) {
            const patch = action.type === AppActions.undo.type ? 'inversePatches' : 'patches';

            const patches = history[historyProp][0].patches[patch];
            const key = history[historyProp][0].actions[0]['key' as keyof Action];
            const value = patches[patches.length - 1].value as string;

            switch (actionType) {
              case ThemeSettingsActions.setColor.type: {
                document.documentElement.style.setProperty(`--${key}-color`, value);
                break;
              }
              case ThemeSettingsActions.setFont.type: {
                document.documentElement.style.setProperty(`--${key}-font-family`, value);
                if (key !== 'alternative') {
                  const link = document.getElementById(`${key}-font`) as HTMLLinkElement | null;

                  if (link) {
                    link.href = `https://fonts.googleapis.com/css2?family=${value}:wght@300;400;500;600;700&display=swap`;
                  }
                  break;
                }
              }
            }
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private googleFontsService: GoogleFontsService
  ) {}
}
