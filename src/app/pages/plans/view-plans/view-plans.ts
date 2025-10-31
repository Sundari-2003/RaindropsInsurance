import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { InsuranceDataService } from '../../../services/insurance-data';
import { CommonModule } from '@angular/common';
import { IPlan } from '../../../models/plan';

interface IDisplayPlan extends IPlan {
  calculatedPremium: number;
}
@Component({
  selector: 'app-view-plans',
  imports: [CommonModule , RouterModule],
  templateUrl: './view-plans.html',
  styleUrl: './view-plans.css',
})
export class ViewPlans implements OnInit{
 // Observable to hold the plans combined with the calculated premium
  plansWithPremium$!: Observable<IDisplayPlan[]>;
  private userData: any = null; // To store the most recent quote data

  constructor(
    private insuranceService: InsuranceDataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to the quote data to ensure we have user details for calculation
    this.insuranceService.currentQuoteData.subscribe(data => {
      this.userData = data;
      // If no quote data is present, redirect the user to prompt them to get one
      if (!this.userData) {
         // Optionally, trigger the modal here, but navigating home is safer
         console.warn("No quote data found. Please complete the quote form first.");
         // Note: For a smoother UX, you might want to automatically show the modal here.
      }
    });

    // Combine plans data stream with the user data for premium calculation
    this.plansWithPremium$ = combineLatest([
      this.insuranceService.getAllPlans(), // Stream 1: All plans from API
      this.insuranceService.currentQuoteData // Stream 2: User data from modal
    ]).pipe(
      map(([plans, userData]) => {
        // If userData is null (user skipped the quote), use default values
        const age = userData?.age || 30; // Default age
        const healthStatus = userData?.healthStatus || 'good';

        // Convert health status to a numerical factor for the calculation
        let healthFactor = 1.0;
        if (healthStatus === 'moderate') healthFactor = 1.1; // 10% surcharge
        if (healthStatus === 'poor') healthFactor = 1.3; // 30% surcharge

        // Calculate premium for each plan
        return plans.map(plan => ({
          ...plan,
          // Task 4.2: Use the service method to calculate the premium
          calculatedPremium: this.insuranceService.calculatePremium(
            plan.baseAmt, 
            age, 
            healthFactor
          )
        }));
      })
    );
  }

  // Task 4.3: Navigation to the booking form
  selectPlan(planId: number): void {
    // Navigate to the 'select-plan' route, passing the plan ID
    this.router.navigate(['/book-plan', planId]);
  }

}
