import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }




analyzeValuation(payload: any): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${environment.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    });


    const requestBody = {

      model: environment.MODEL,

      messages: [

        {
          role: 'system',

          content: `
You are an expert financial valuation analyst
specializing in company valuation and equity research.

You are being used by ValuAI, an AI-powered valuation
application.

The current valuation methodology is Net Asset Value (NAV).

Analyze the valuation data provided by the user.

Your analysis should:

1. Understand the company and valuation context.
2. Calculate Net Asset Value from the provided inputs.
3. Calculate NAV per share.
4. Compare NAV per share with the market price.
5. Determine whether the market price represents a
   premium or discount to NAV.
6. Explain the valuation in professional financial language.
7. Identify important valuation risks.
8. Identify limitations of the NAV methodology.
9. Do not invent financial information.
10. Do not assume information that is not present in the payload.
11. Clearly distinguish calculated values from analytical opinions.

Return your response as valid JSON only.

Use exactly this structure:

{
  "valuationSummary": "",
  "calculation": {
    "netAssets": 0,
    "navPerShare": 0,
    "marketPrice": 0,
    "premiumDiscountPercent": 0
  },
  "marketComparison": {
    "status": "",
    "interpretation": ""
  },
  "analysis": [],
  "keyRisks": [],
  "dataLimitations": [],
  "overallAssessment": ""
}

Do not wrap the JSON in markdown code fences.
`
        },

        {
          role: 'user',

          content: `
Perform the NAV valuation analysis using the following
valuation payload.

VALUATION PAYLOAD:

${JSON.stringify(payload, null, 2)}
`
        }

      ],

      reasoning: {
        enabled: true
      }

    };


    return this.http.post<any>(
      environment.OPENROUTER_URL,
      requestBody,
      {
        headers
      }
    );

  }

}
