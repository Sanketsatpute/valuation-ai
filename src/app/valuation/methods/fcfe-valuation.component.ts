import { Component } from '@angular/core';

@Component({
  selector: 'app-fcfe-valuation',
  templateUrl: './fcfe-valuation.component.html',
  styleUrls: ['./fcfe-valuation.component.scss']
})
export class FcfeValuationComponent {
  model: any = { company: '', date: '', latestFcf: null, growth: 0.02, discount: 0.08, sharesOutstanding: null };

  get terminalValue(): number {
    const fcf = Number(this.model.latestFcf) || 0;
    const g = Number(this.model.growth) || 0;
    const r = Number(this.model.discount) || 0.000001;
    return fcf * (1 + g) / (r - g);
  }

  get perShare(): number | null {
    const s = Number(this.model.sharesOutstanding) || 0;
    if (s <= 0) return null;
    return this.terminalValue / s;
  }

  formatted(v: number) { return v.toLocaleString(undefined, {maximumFractionDigits:2}); }
}
