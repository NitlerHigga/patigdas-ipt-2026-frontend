import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private accountService: AccountService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            // 🌟 Check if the user is currently on the password reset page
            const isResetPage = this.router.url.includes('/account/reset-password');

            // Only auto-logout if it's a 401/403, a session exists, AND we aren't on the public reset page
            if ([401, 403].includes(err.status) && this.accountService.accountValue && !isResetPage) {
                // auto logout if 401 or 403 response returned from api
                this.accountService.logout();
            }

            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(err);
            return throwError(() => error);
        }))
    }
}