import { Component, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService, BlogEntry } from '../../core/services/blog.service';
import { Observable, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-blog-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './blog-view.component.html',
  styleUrl: './blog-view.component.css'
})
export class BlogViewComponent implements OnInit {
  entry$: Observable<BlogEntry | undefined> | undefined;
  newCommentText = '';
  newCommentAuthor = 'Guest';

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.entry$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        return this.blogService.getEntry(id || '');
      })
    );
  }

  getSafeHtml(content: string): SafeHtml {
    // Basic sanitization allowing images
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  submitComment(entryId: string): void {
    if (!this.newCommentText.trim()) return;
    
    this.blogService.addComment(entryId, {
      author: this.newCommentAuthor,
      text: this.newCommentText,
      date: new Date()
    });
    
    this.newCommentText = '';
  }
}
