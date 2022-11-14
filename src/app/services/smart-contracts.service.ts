import { wbAbis, wbAddress } from './smart-contracts.abis';
import { Injectable } from '@angular/core';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Subject } from 'rxjs';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: 'INFURA_ID', // required
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class SmartContractsService {
  private web3js: any;
  private provider: any;
  private accounts: any;

  uDonate: any;

  web3Modal: any;

  private accountStatusSource = new Subject<any>();
  accountStatus$ = this.accountStatusSource.asObservable();

  private newOrganization = new Subject<any>();
  newOrganization$ = this.newOrganization.asObservable();

  constructor() {
    this.web3Modal = new Web3Modal({
      network: 'mainnet', // optional
      cacheProvider: true, // optional
      providerOptions, // required
      theme: {
        background: 'rgb(39, 49, 56)',
        main: 'rgb(199, 199, 199)',
        secondary: 'rgb(136, 136, 136)',
        border: 'rgba(195, 195, 195, 0.14)',
        hover: 'rgb(16, 26, 32)',
      },
    });
  }

  async connectAccount() {
    this.web3Modal.clearCachedProvider();

    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();
    this.accountStatusSource.next(this.accounts);
  }

  async createOrganization(
    orgID: string,
    payableWallet: string,
    orgName: string,
    tokenAddress: string
  ) {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    this.uDonate = new this.web3js.eth.Contract(wbAbis, wbAddress);

    const create = await this.uDonate.methods
      .createOrganization(orgID, payableWallet, orgName, tokenAddress)
      .send({ from: this.accounts[0] });
    return create;
  }

  async getOrganization(orgID: string) {
    this.provider = await this.web3Modal.connect(); // set provider
    this.web3js = new Web3(this.provider); // create web3 instance
    this.accounts = await this.web3js.eth.getAccounts();

    this.uDonate = new this.web3js.eth.Contract(wbAbis, wbAddress);

    const org = await this.uDonate.methods
      .getOrganization(orgID)
      .call({ from: this.accounts[0] });

    const organization = org;
    const walletAddress = organization[1];
    const balence = await this.web3js.eth.getBalance(walletAddress);

    const orgWithBalence = {
      id: organization[0],
      payableWallet: organization[1],
      paused: organization[2],
      ended: organization[3],
      causesIDs: organization[4],
      balence: balence,
    };

    return orgWithBalence;
  }
}
