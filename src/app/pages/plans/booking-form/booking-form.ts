import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { IBooking } from '../../../models/booking';
import { IPlan } from '../../../models/plan';
import { InsuranceDataService } from '../../../services/insurance-data';

@Component({
  selector: 'app-booking-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingForm implements OnInit {
  bookingForm!: FormGroup;
  selectedPlan!: IPlan;
  finalPremium: number = 0;
  isSubmitting: boolean = false;
  bookingSuccess: boolean = false;

  // Data from the quote form (age, healthStatus)
  private userData: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceDataService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const planId = Number(params.get('planId'));
        if (!planId) {
          this.router.navigate(['/plans']);
          // Return an observable error or empty observable to stop the stream
          // Using switchMap here means we should return the expected Observable type:
          return this.insuranceService.getPlanById(0); // Return empty observable for planId 0, or throw
        }
        return this.insuranceService.getPlanById(planId);
      })
    ).subscribe({
      // FIX HERE: Explicitly type 'plans' as IPlan[]
      next: (plans: IPlan[]) => {

        if (plans.length === 0) {
          console.error('Plan not found for ID.');
          this.router.navigate(['/plans']);
          return;
        }

        // Now TypeScript knows 'plans' is an array, and accessing index [0] is valid.
        this.selectedPlan = plans[0]; // <-- This line is now correctly typed!

        // 2. Get User Quote Data for Premium Recalculation/Confirmation
        this.insuranceService.currentQuoteData.subscribe(data => {
          this.userData = data;

          // Recalculate/Confirm Premium (logic unchanged)
          const age = this.userData?.age || 30;
          const healthStatus = this.userData?.healthStatus || 'good';

          let healthFactor = 1.0;
          if (healthStatus === 'moderate') healthFactor = 1.1;
          if (healthStatus === 'poor') healthFactor = 1.3;

          this.finalPremium = this.insuranceService.calculatePremium(
            this.selectedPlan.baseAmt, age, healthFactor
          );

          this.initializeForm();
        });
      },
      error: (err) => {
        console.error('Error fetching plan details:', err);
        this.router.navigate(['/plans']);
      }
    });
  }

  // Task 4.5: Initialize the form with all required validations
  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      // 10-digit phone number validation
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]], // Email validation

      // Payment details
      paymentMode: ['credit card', Validators.required],
      // Simple card number pattern (dashes optional)
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9\-\s]{13,19}$/)]],
      paymentFreq: ['yearly', Validators.required]
    });
  }

  get f() {
    return this.bookingForm.controls;
  }

  // Task 4.7 & 4.8: Submission Logic
  onSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched(); // Show validation errors
      return;
    }

    this.isSubmitting = true;

    // Construct the final booking object (Request Body 3)
    const formValues = this.bookingForm.value;
    const finalBooking: IBooking = {
      ...formValues,
      age: this.userData?.age || 30, // Include user data from quote
      planId: this.selectedPlan.planId,
      planName: this.selectedPlan.planName,
      validity: this.selectedPlan.validity, // Use validity from the plan
      premiumAmt: this.finalPremium, // Use the calculated premium
    };

    // Perform POST request to /bookings
    this.insuranceService.bookPlan(finalBooking).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.bookingSuccess = true; // Task 4.8: Display success message
        console.log('Booking successful:', response);
        this.bookingForm.reset(); // Clear form

        // Redirect after a delay
        setTimeout(() => this.router.navigate(['/home']), 3000);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert('Booking Failed. Please try again.');
        console.error('Booking failed:', err);
      }
    });
  }

}
