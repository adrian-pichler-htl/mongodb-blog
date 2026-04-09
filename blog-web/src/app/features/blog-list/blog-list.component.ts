import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, BlogEntry } from '../../core/services/blog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css'
})
export class BlogListComponent implements OnInit {
  entries$: Observable<BlogEntry[]> | undefined;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.entries$ = this.blogService.getEntries();
  }
}
