import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { QuoteModal } from "./components/quote-modal/quote-modal";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, QuoteModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title ='RaindropInsurance';
}
