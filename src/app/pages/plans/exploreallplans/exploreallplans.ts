import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Observable, of } from 'rxjs'; // Using 'of' for a mock Observable
import { IPlan } from '../../../models/plan';
import { InsuranceDataService } from '../../../services/insurance-data';

// 1. Define the Plan interface (assuming this is shared)
interface Plan {
  planId: number;
  planName: string;
  description: string;
  baseAmt: number;
  validity: number;
  id: string;
}



@Component({
  selector: 'app-exploreallplans',
  imports: [CommonModule,DecimalPipe],
  templateUrl: './exploreallplans.html',
  styleUrl: './exploreallplans.css',
})

export class Exploreallplans implements OnInit {
  // Observable to hold all available plans
  allPlans$!: Observable<IPlan[]>;

  constructor(
    private insuranceService: InsuranceDataService
  ) { }

  ngOnInit(): void {
    // Fetch all plans directly from the service
    this.allPlans$ = this.insuranceService.getAllPlans();
  }

  // Task 4.3: Add a method for navigating to the booking form for consistency
  // Although this component is for display, providing a navigation option is useful.
  selectPlan(planId: number): void {
    // Navigate to the 'select-plan' route, passing the plan ID
    // Note: Users should ideally complete the quote first, but we navigate them for now.
    console.log(`Navigating to book plan ID: ${planId}`);
    // this.router.navigate(['/book-plan', planId]); // Uncomment and inject Router if navigation is desired
  }
}
