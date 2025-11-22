import { Component } from '@angular/core';
import { Sidebar } from './sidebar/sidebar';
import { TopNav } from './top-nav/top-nav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar, TopNav],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
