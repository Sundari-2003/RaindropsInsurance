import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AboutUs } from './pages/about-us/about-us';
import { BookingForm } from './pages/plans/booking-form/booking-form';
import { SelectPlanDetail } from './pages/plans/select-plan-detail/select-plan-detail';
import { ViewPlans } from './pages/plans/view-plans/view-plans';

export const routes: Routes = [

    // Default route redirects to Home
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // Primary Navigation Routes
  { path: 'home', component: Home },
  { path: 'about-us', component: AboutUs },
  { path: 'plans', component: ViewPlans },

  // Booking/Transaction Flow Routes
  // The 'select-plan' path can take a plan ID as a parameter
  { path: 'view-plans', component: ViewPlans },
  { path: 'select-plan/:planId', component: SelectPlanDetail },
  { path: 'book-plan/:planId', component: BookingForm },

  // Wildcard route for any unhandled paths
  { path: '**', redirectTo: '/home' }

];
