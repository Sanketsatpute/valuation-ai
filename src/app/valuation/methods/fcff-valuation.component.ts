import { Component } from '@angular/core';

@Component({
  selector: 'app-fcff-valuation',
  templateUrl: './fcff-valuation.component.html',
  styleUrls: ['./fcff-valuation.component.scss']
})
export class FcffValuationComponent {
  model: any = { company: '', date: '', latestFcff: null, growth: 0.02, discount: 0.08, netDebt: 0, sharesOutstanding: null };

  get terminalValue(): number {
    const fcf = Number(this.model.latestFcff) || 0;
    const g = Number(this.model.growth) || 0;
    const r = Number(this.model.discount) || 0.000001;
    return fcf * (1 + g) / (r - g);
  }

  get equityValue(): number {
    const nd = Number(this.model.netDebt) || 0;
    return this.terminalValue - nd;
  }

  get perShare(): number | null {
    const s = Number(this.model.sharesOutstanding) || 0;
    if (s <= 0) return null;
    return this.equityValue / s;
  }

  formatted(v: number) { return v.toLocaleString(undefined, {maximumFractionDigits:2}); }
}
