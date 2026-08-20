import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Valuation Dashboard';

  metrics = [
    { label: 'Total Value', value: '$12.4M', change: '+4.3%' },
    { label: 'Properties', value: '128', change: '+2' },
    { label: 'Avg Valuation', value: '$96.8k', change: '-1.2%' },
    { label: 'Alerts', value: '3', change: '+1' }
  ];

  recentValuations = [
    { id: 'PROP-001', address: '123 Main St', value: '$240,000' },
    { id: 'PROP-042', address: '88 River Rd', value: '$325,000' },
    { id: 'PROP-089', address: '10 Oak Ave', value: '$410,000' }
  ];
}
