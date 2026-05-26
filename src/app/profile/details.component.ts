import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ standalone: false, templateUrl: 'details.component.html' })
export class DetailsComponent {
    account = this.accountService.accountValue;

    constructor(private accountService: AccountService) { }
}
