import { Component } from '@angular/core';

@Component({
  selector: 'app-valuation-create',
  templateUrl: './valuation-create.component.html',
  styleUrls: ['./valuation-create.component.scss']
})
export class ValuationCreateComponent {
  methods = [
    // { key: 'fcfe', label: 'FCFE' },
    // { key: 'fcff', label: 'FCFF' },
    { key: 'nav', label: 'NAV' }
  ];
}
