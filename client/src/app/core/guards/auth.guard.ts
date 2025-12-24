import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // TODO: Implement authentication check
  // if (authService.isAuthenticated()) {
  //   return true;
  // }
  // return router.createUrlTree(['/auth/login']);

  return true; // Placeholder - allow all for now
};
