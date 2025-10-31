// src/app/services/insurance-data.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPlan } from '../models/plan';
import { IBooking } from '../models/booking';

@Injectable({
  providedIn: 'root'
})
export class InsuranceDataService {
  private apiUrl = 'http://localhost:3333';

  // Use BehaviorSubject to store and share the quote data across components
  private quoteDataSource = new BehaviorSubject<any | null>(null); 
  currentQuoteData = this.quoteDataSource.asObservable();

  constructor(private http: HttpClient) { }
  
  // New method to set the quote data from the modal
  setQuoteData(data: any): void {
    this.quoteDataSource.next(data);
  }

  /**
   * Task 3.3: View all Plans
   * Endpoint: GET http://localhost:3333/plans
   */
  getAllPlans(): Observable<IPlan[]> {
    // The JSON Server base path for plans is /plans
    return this.http.get<IPlan[]>(`${this.apiUrl}/plans`);
  }

  /**
   * Task 3.4: View By Plan Id
   * Endpoint: GET http://localhost:3333/plans?planId=1
   */
 getPlanById(planId: number): Observable<IPlan[]> { // <--- Explicitly return IPlan[]
  // JSON server uses query parameter for filtering
  const url = `${this.apiUrl}/plans?planId=${planId}`;
  return this.http.get<IPlan[]>(url); // <--- Cast the response as IPlan[]
}

  /**
   * Task 4.7: Book Now (Will be used later)
   * Endpoint: POST http://localhost:3333/bookings
   */
  bookPlan(bookingDetails: IBooking): Observable<IBooking> {
    return this.http.post<IBooking>(`${this.apiUrl}/bookings`, bookingDetails);
  }

  // --- Premium Calculation Logic Placeholder (Task 3.6) ---
  // A simple function to estimate the premium based on user input
  calculatePremium(baseAmt: number, age: number, healthFactor: number = 1): number {
    // Base Premium Calculation Logic (simplified)
    // 1. Base Amount
    // 2. Age Factor: Add 10% for every 10 years over age 30
    // 3. Health Factor: Add a surcharge (e.g., 20%) for poor health (healthFactor = 1.2)

    let premium = baseAmt;

    // Age Surcharge
    if (age > 30) {
      const ageSurchargeFactor = Math.floor((age - 30) / 10) * 0.10; // 10% for every 10 years
      premium += premium * ageSurchargeFactor;
    }

    // Health Surcharge
    premium *= healthFactor;

    // Round to nearest integer for clean display
    return Math.round(premium);
  }
}