import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // 🌟 FIXED: Imported Router utilities
import { first, finalize } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'forgot-password.component.html', standalone: false })
export class ForgotPasswordComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    error = ''; 

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService,
        private router: Router,             
        private route: ActivatedRoute,      
        private cdr: ChangeDetectorRef       
    ){}

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.error = ''; 
    
        // reset alerts on submit
        this.alertService.clear();
    
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
    
        this.loading = true;
        this.cdr.detectChanges(); // Safe trigger after injection fixes

        this.accountService.forgotPassword(this.f.email.value)
            .pipe(
                first(),
                finalize(() => {
                    this.loading = false;
                    this.cdr.detectChanges();
                })
            )
            .subscribe({
                next: () => {
                    // Triggers the top-level green banner tracking parameters
                    this.alertService.success('Please check your email for password reset instructions', { keepAfterRouteChange: true });
                    
                    this.router.navigate(['../login'], { relativeTo: this.route });
                },
                error: error => {
                    setTimeout(() => {
                        // Triggers the template-level local card message banner layout inside the view bounds
                        this.error = error; 
                        this.cdr.detectChanges();
                    });
                }
            });
    }
}