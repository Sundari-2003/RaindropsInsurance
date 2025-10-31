import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router'; // 👈 Import this
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [
    RouterModule , CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

}
