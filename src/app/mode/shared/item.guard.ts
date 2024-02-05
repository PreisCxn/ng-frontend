import { CanActivateFn } from '@angular/router';

export const itemGuard: CanActivateFn = (route, state) => {
  return true;
};
