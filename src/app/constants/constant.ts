export interface NavValuationPayload {
  method: string;

  company: {
    name: string;
    ticker: string;
    exchange: string;
  };

  valuationContext: {
    valuationDate: string;
    currency: string;
    valuationPurpose: string;
    valuationBasis: string;
  };

  financialInputs: {
    totalAssets: number | null;
    totalLiabilities: number | null;
    sharesOutstanding: number | null;
    marketPrice: number | null;
  };

  metadata: {
    source: string;
    submittedAt: string;
  };
}



export const COMPANIES = [

  {
    name: 'HBL Engineering Limited',
    ticker: 'HBLENGINE',
    exchange: 'NSE',
    sector: 'Industrials',
    industry: 'Electrical Equipment'
  },

  {
    name: 'Tata Consultancy Services Limited',
    ticker: 'TCS',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services'
  },

  {
    name: 'Reliance Industries Limited',
    ticker: 'RELIANCE',
    exchange: 'NSE',
    sector: 'Energy',
    industry: 'Oil & Gas'
  },

  {
    name: 'Infosys Limited',
    ticker: 'INFY',
    exchange: 'NSE',
    sector: 'Information Technology',
    industry: 'IT Services'
  },

  {
    name: 'HDFC Bank Limited',
    ticker: 'HDFCBANK',
    exchange: 'NSE',
    sector: 'Financials',
    industry: 'Banks'
  },

  {
    name: 'Larsen & Toubro Limited',
    ticker: 'LT',
    exchange: 'NSE',
    sector: 'Industrials',
    industry: 'Construction & Engineering'
  }

];