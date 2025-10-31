// ng generate interface models/plan
export interface IPlan {
  planId: number;
  planName: string;
  description: string;
  baseAmt: number; // Base amount of the premium
  validity: number; // Duration in days/months, as seen in db.json
}