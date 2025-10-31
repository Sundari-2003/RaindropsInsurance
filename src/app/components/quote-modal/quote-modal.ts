import { CommonModule, isPlatformBrowser } from '@angular/common'; // <-- Import isPlatformBrowser
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InsuranceDataService } from '../../services/insurance-data';
// Removed: import * as bootstrap from 'bootstrap'; // This caused the issue

@Component({
  selector: 'app-quote-modal',
  imports: [CommonModule , ReactiveFormsModule],
  standalone: true,
  templateUrl: './quote-modal.html',
  styleUrl: './quote-modal.css',
})
export class QuoteModal {
  quoteForm: FormGroup;
  isFormSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private insuranceService: InsuranceDataService,
    @Inject(PLATFORM_ID) private platformId: Object // PLATFORM_ID is correctly injected
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