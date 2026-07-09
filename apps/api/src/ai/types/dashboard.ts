export interface DashboardAIResponse {

  businessHealth:number;

  businessScore:number;

  businessStatus:string;

  executiveSummary:string;

  insights:any[];

  financialInsights:any[];

  predictions:any[];

  riskAlerts:any[];

  smartNotifications:any[];
}