import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMPANIES, NavValuationPayload } from 'src/app/constants/constant';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-nav-valuation',
  templateUrl: './nav-valuation.component.html',
  styleUrls: ['./nav-valuation.component.scss']
})
export class NavValuationComponent implements OnInit{

    companies = COMPANIES;

    filteredCompanies:any = [];

    selectedCompany:any = null;
    aiLoading = false;

    aiResponse: any = null;

    aiReasoning: any = null;

    showResults = false;

    navForm!: FormGroup;

    submittedPayload: NavValuationPayload | null = null;
    constructor(private fb: FormBuilder, private aiService: HttpService){

    }


ngOnInit(): void {

    this.navForm = this.fb.group({

      company: this.fb.group({

        name: [
            '',
            Validators.required
        ],

        ticker: [
            '',
            Validators.required
        ],

        exchange: [
            '',
            Validators.required
        ]

        }),


      valuationContext: this.fb.group({

        valuationDate: [
          '2026-08-20',
          Validators.required
        ],

        currency: [
          'INR — Indian Rupee',
          Validators.required
        ],

        valuationPurpose: [
          'Investment Analysis',
          Validators.required
        ],

        valuationBasis: [
          'Going Concern',
          Validators.required
        ]

      }),


      financialInputs: this.fb.group({

        totalAssets: [
          12500,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        totalLiabilities: [
          4800,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        sharesOutstanding: [
          27.70,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        marketPrice: [
          265.40,
          [
            Validators.required,
            Validators.min(0)
          ]
        ]

      })

    });

    const defaultCompany = COMPANIES[0];

    this.selectCompany(defaultCompany);
    this.selectedCompany = defaultCompany

  }


  submit(): void {
    

    if (this.navForm.invalid) {

      this.navForm.markAllAsTouched();

      console.warn(
        'NAV form is invalid',
        this.navForm.value
      );

      return;
    }


    const formValue = this.navForm.getRawValue();


    const payload: NavValuationPayload = {

      method: 'NAV',

      company: {
        name: formValue.company.name,
        ticker: formValue.company.ticker,
        exchange: formValue.company.exchange
      },

      valuationContext: {
        valuationDate:
          formValue.valuationContext.valuationDate,

        currency:
          formValue.valuationContext.currency,

        valuationPurpose:
          formValue.valuationContext.valuationPurpose,

        valuationBasis:
          formValue.valuationContext.valuationBasis
      },

      financialInputs: {

        totalAssets:
          Number(formValue.financialInputs.totalAssets),

        totalLiabilities:
          Number(formValue.financialInputs.totalLiabilities),

        sharesOutstanding:
          Number(formValue.financialInputs.sharesOutstanding),

        marketPrice:
          Number(formValue.financialInputs.marketPrice)

      },

      metadata: {

        source: 'ValuAI v0.1',

        submittedAt:
          new Date().toISOString()

      }

    };


    // Store the complete payload
    this.submittedPayload = payload;


    // IMPORTANT:
    // For now we are NOT calling the AI API.
    console.log(
      '========== NAV VALUATION PAYLOAD =========='
    );

    console.log(
      JSON.stringify(payload, null, 2)
    );

    console.log(
      '=========================================='
    );

    this.aiLoading = true;
    this.aiService
    .analyzeValuation(payload)
    .subscribe({

      next: (response:any) => {

        console.log(
          '========== OPENROUTER RESPONSE =========='
        );

        console.log(response);

        console.log(
          '=========================================='
        );


        this.aiLoading = false;


        const message =
          response?.choices?.[0]?.message;


        if (!message) {

          console.error(
            'No assistant message received'
          );

          return;
        }


        console.log(
          'AI CONTENT:',
          message.content
        );


        console.log(
          'REASONING DETAILS:',
          message.reasoning_details
        );


        this.aiResponse =
          typeof message.content === 'string'
            ? JSON.parse(message.content)
            : message.content;


        this.aiReasoning =
          message.reasoning_details;


        this.aiLoading = false;

        this.showResults = true

      },


      error: (error:any) => {

        this.aiLoading = false;

        console.error(
          'OpenRouter API Error:',
          error
        );

      }

    });
  }

editInputs(): void {
    this.showResults = false;
}


searchCompany(event: Event): void {

  const input =
    (event.target as HTMLInputElement)
      .value
      .trim()
      .toLowerCase();


  if (!input) {

    this.filteredCompanies = [];

    return;
  }


  this.filteredCompanies =
    this.companies
      .filter(company =>
        company.name.toLowerCase().includes(input) ||
        company.ticker.toLowerCase().includes(input)
      )
      .slice(0, 6);

}

selectCompany(company: any): void {

  this.selectedCompany = company;

  this.navForm.patchValue({

    company: {

      name: company.name,

      ticker: company.ticker,

      exchange: company.exchange

    }

  });


  this.filteredCompanies = [];

}

getScalePosition(
  value: number,
  min: number,
  max: number
): number {

  if (max === min) {
    return 50;
  }

  const range = max - min;

  const position =
    ((value - min) / range) * 100;

  // Keep marker inside the visual scale
  return Math.max(
    5,
    Math.min(95, position)
  );
}


getScaleMin(): number {

  const market =
    Number(this.aiResponse?.calculation?.marketPrice);

  const nav =
    Number(this.aiResponse?.calculation?.navPerShare);

  if (!market || !nav) {
    return 0;
  }

  const lower =
    Math.min(market, nav);

  const upper =
    Math.max(market, nav);

  const padding =
    (upper - lower) * 0.35;

  return Math.max(
    0,
    lower - padding
  );
}


getScaleMax(): number {

  const market =
    Number(this.aiResponse?.calculation?.marketPrice);

  const nav =
    Number(this.aiResponse?.calculation?.navPerShare);

  if (!market || !nav) {
    return 100;
  }

  const lower =
    Math.min(market, nav);

  const upper =
    Math.max(market, nav);

  const padding =
    (upper - lower) * 0.35;

  return upper + padding;
}

getMarketPosition(): number {

  const market =
    Number(this.aiResponse?.calculation?.marketPrice);

  return this.getScalePosition(
    market,
    this.getScaleMin(),
    this.getScaleMax()
  );
}


getNavPosition(): number {

  const nav =
    Number(this.aiResponse?.calculation?.navPerShare);

  return this.getScalePosition(
    nav,
    this.getScaleMin(),
    this.getScaleMax()
  );
}

abs(value: number): number {
  return Math.abs(value);
}

formatCurrency(value: number): string {
  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return '₹0.00';
  }

  const sign = numericValue < 0 ? '−' : '';

  return `${sign}₹${Math.abs(numericValue).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}


formatNumber(value: number): string {
  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return '0';
  }

  const sign = numericValue < 0 ? '−' : '';

  return `${sign}${Math.abs(numericValue).toLocaleString('en-IN', {
    maximumFractionDigits: 2
  })}`;
}


formatPercentage(value: number): string {
  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return 'N/A';
  }

  const sign = numericValue > 0
    ? '+'
    : numericValue < 0
      ? '−'
      : '';

  return `${sign}${Math.abs(numericValue).toFixed(2)}%`;
}
getMarketComparisonText(): string {

  const marketPrice =
    Number(this.aiResponse?.calculation?.marketPrice);

  const navPerShare =
    Number(this.aiResponse?.calculation?.navPerShare);


  if (!marketPrice || !navPerShare) {
    return 'Market comparison unavailable';
  }


  if (navPerShare <= 0) {
    return 'NAV comparison is not meaningful';
  }


  if (marketPrice > navPerShare) {
    return 'Market trades above calculated NAV';
  }


  if (marketPrice < navPerShare) {
    return 'Market trades below calculated NAV';
  }


  return 'Market price is equal to calculated NAV';
}

getMarketStatus(): 'premium' | 'discount' | 'fair' | 'negative-nav' {

  const marketPrice =
    Number(this.aiResponse?.calculation?.marketPrice);

  const nav =
    Number(this.aiResponse?.calculation?.navPerShare);


  if (nav <= 0) {
    return 'negative-nav';
  }


  if (marketPrice > nav) {
    return 'premium';
  }


  if (marketPrice < nav) {
    return 'discount';
  }


  return 'fair';
}

getValuationSignalPosition(): number {

  const premiumDiscount = Number(
    this.aiResponse?.calculation?.premiumDiscountPercent
  );

  if (isNaN(premiumDiscount)) {
    return 50;
  }

  // Fair value = center
  if (premiumDiscount === 0) {
    return 50;
  }

  /*
   * Compress large percentages so that
   * extremely high premiums don't push
   * the marker outside the bar.
   *
   * Examples:
   * -100%  -> ~5%
   * -50%   -> ~20%
   *   0%   -> 50%
   * +50%   -> ~80%
   * +100%  -> ~95%
   * +5000% -> ~95%
   */

  const maxVisualPercentage = 100;

  const normalized =
    premiumDiscount /
    (Math.abs(premiumDiscount) + maxVisualPercentage);

  const position =
    50 + (normalized * 50);

  return Math.max(
    5,
    Math.min(95, position)
  );
}

getValuationSignalFill(): number {
  return this.getValuationSignalPosition();
}

getDataQualityScore(): number {

  const financial =
    this.navForm?.get('financialInputs')?.value;

  const company =
    this.navForm?.get('company')?.value;

  const context =
    this.navForm?.get('valuationContext')?.value;


  let score = 0;


  // Company information
  if (
    company?.name &&
    company?.ticker &&
    company?.exchange
  ) {
    score += 10;
  }


  // Valuation date
  if (context?.valuationDate) {
    score += 10;
  }


  // Currency
  if (context?.currency) {
    score += 5;
  }


  // Total assets
  if (
    financial?.totalAssets !== null &&
    financial?.totalAssets !== undefined &&
    Number(financial.totalAssets) > 0
  ) {
    score += 25;
  }


  // Total liabilities
  if (
    financial?.totalLiabilities !== null &&
    financial?.totalLiabilities !== undefined &&
    Number(financial.totalLiabilities) >= 0
  ) {
    score += 20;
  }


  // Shares outstanding
  if (
    financial?.sharesOutstanding !== null &&
    financial?.sharesOutstanding !== undefined &&
    Number(financial.sharesOutstanding) > 0
  ) {
    score += 15;
  }


  // Market price
  if (
    financial?.marketPrice !== null &&
    financial?.marketPrice !== undefined &&
    Number(financial.marketPrice) >= 0
  ) {
    score += 15;
  }


  return score;
}

getDataQualityLabel(): string {

  const score = this.getDataQualityScore();


  if (score >= 90) {
    return 'EXCELLENT';
  }


  if (score >= 75) {
    return 'GOOD';
  }


  if (score >= 50) {
    return 'FAIR';
  }


  return 'LIMITED';
}
getDataQualityDescription(): string {

  const score = this.getDataQualityScore();


  if (score >= 90) {

    return 'All core valuation inputs are available and ready for analysis.';
  }


  if (score >= 75) {

    return 'Core valuation inputs are available. Additional asset-level detail could improve reliability.';
  }


  if (score >= 50) {

    return 'Some important valuation inputs are missing. Results should be treated as indicative.';
  }


  return 'Insufficient data is available for a reliable NAV assessment.';
}
}
