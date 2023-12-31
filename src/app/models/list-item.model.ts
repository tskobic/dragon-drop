import { Type } from '@angular/core';

export interface ListItem {
  label: string;
  icon: string;
  component: Type<unknown>;
}
