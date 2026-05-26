import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'login.component.html', standalone: false })
export class LoginComponent implements OnInit {
    form!: FormGroup;
    submitting = false;
    submitted = false;  
    error: any; // Connected directly to *ngIf="error" in your HTML template

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        // private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.error = ''; // Instantly wipes away old error text on a new click
        

        if (this.form.invalid) {
            return;
        }

        this.submitting = true;
        this.cdr.detectChanges();

        this.accountService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigateByUrl(returnUrl);
                },
                error: error => {
                    setTimeout(() => {
                        // 🌟 FIXED: Store the error string so your *ngIf="error" block reveals itself!
                        this.error = error; 
                        
                        this.submitting = false; // Stops the spinner animation loop
                        this.cdr.detectChanges(); // Forces UI update
                    });
                }
            });
    }
}