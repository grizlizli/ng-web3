import { SmartContractsService } from './services/smart-contracts.service';
import { Component } from '@angular/core';

@Component({
  selector: 'ng-web3-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-web3';

  constructor(private smartContractsService: SmartContractsService) {}

  handleWeb3() {
    this.smartContractsService.connectAccount();
  }
}
