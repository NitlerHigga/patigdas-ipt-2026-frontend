import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ standalone: false, templateUrl: 'home.component.html' })
export class HomeComponent {
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) { }
}
