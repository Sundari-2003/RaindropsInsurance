import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core'; // <-- Import AfterViewInit
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceDataService } from '../../services/insurance-data';

@Component({
  selector: 'app-quote-modal',
  imports: [CommonModule , ReactiveFormsModule],
  standalone: true,
  templateUrl: './quote-modal.html',
  styleUrl: './quote-modal.css',
})
// Implement AfterViewInit
export class QuoteModal implements AfterViewInit { 
  quoteForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private insuranceService: InsuranceDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.quoteForm = this.fb.group({
      age: ['', [
        Validators.required, 
        Validators.min(18),
        Validators.max(99)
      ]],
      earnings: ['', [
        Validators.required, 
        Validators.min(1000)
      ]],
      healthStatus: ['good', Validators.required]
    });
  }

  // Lifecycle hook called after component's view has been initialized
  ngAfterViewInit(): void {
    this.setupModalReset();
  }

  /**
   * Listens for the Bootstrap modal 'shown' event and resets the form.
   */
  setupModalReset(): void {
    // Guarding the DOM manipulation with isPlatformBrowser for SSR safety
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('quoteModal');
      
      if (modalElement) {
        // Add listener for the event fired when the modal is fully shown
        modalElement.addEventListener('shown.bs.modal', () => {
          // 1. Reset the form values to null/empty state
          this.quoteForm.reset({
            // Optionally set default values on reset
            healthStatus: 'good' 
          }); 
          
          // 2. Reset the submission state
          this.isFormSubmitted = false;
        });
      }
    }
  }

  get f() {
    return this.quoteForm.controls;
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.quoteForm.invalid) {
      return; 
    }

    const userData = this.quoteForm.value;
    this.insuranceService.setQuoteData(userData);

    // VITAL FIX: Guarding the DOM manipulation with isPlatformBrowser
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('quoteModal');
      
      // Check if Bootstrap's JS object is available on the global window object
      if (modalElement && (window as any).bootstrap) {
        // Access Bootstrap's Modal functionality through the window object
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }

    // Navigate to the plans page to show results
    this.router.navigate(['/plans']);
  }
}

// import { CommonModule, isPlatformBrowser } from '@angular/common'; // <-- Import isPlatformBrowser
// import { Component, Inject, PLATFORM_ID } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { InsuranceDataService } from '../../services/insurance-data';
// // Removed: import * as bootstrap from 'bootstrap'; // This caused the issue

// @Component({
//   selector: 'app-quote-modal',
//   imports: [CommonModule , ReactiveFormsModule],
//   standalone: true,
//   templateUrl: './quote-modal.html',
//   styleUrl: './quote-modal.css',
// })
// export class QuoteModal {
//   quoteForm: FormGroup;
//   isFormSubmitted: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router,
//     private insuranceService: InsuranceDataService,
//     @Inject(PLATFORM_ID) private platformId: Object // PLATFORM_ID is correctly injected
//   ) {
//     this.quoteForm = this.fb.group({
//       age: ['', [
//         Validators.required, 
//         Validators.min(18),
//         Validators.max(99)
//       ]],
//       earnings: ['', [
//         Validators.required, 
//         Validators.min(1000)
//       ]],
//       healthStatus: ['good', Validators.required]
//     });
//   }

//   get f() {
//     return this.quoteForm.controls;
//   }

//   onSubmit(): void {
//     this.isFormSubmitted = true;

//     if (this.quoteForm.invalid) {
//       return; 
//     }

//     const userData = this.quoteForm.value;
//     this.insuranceService.setQuoteData(userData);

//     // VITAL FIX: Guarding the DOM manipulation with isPlatformBrowser
//     if (isPlatformBrowser(this.platformId)) {
//       const modalElement = document.getElementById('quoteModal');
      
//       // Check if Bootstrap's JS object is available on the global window object
//       if (modalElement && (window as any).bootstrap) {
//         // Access Bootstrap's Modal functionality through the window object
//         const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
//         if (modal) {
//           modal.hide();
//         }
//       }
//     }

//     // Navigate to the plans page to show results
//     this.router.navigate(['/plans']);
//   }
// }