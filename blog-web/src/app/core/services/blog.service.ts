import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Comment {
  author: string;
  text: string;
  date: Date;
}

export interface BlogEntry {
  id: string;
  title: string;
  author: any;
  description: string;
  creationDate: Date;
  editDates: Date[];
  impressionCount: number;
  content: any;
  commentsAllowed: boolean;
  imagesCount?: number;
  comments: Comment[];
  category: string;
  hashtag?: string;
  hasAdditionalFields?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:3000/api/entries';

  constructor(private http: HttpClient) { }

  // Helper mapping to ensure content is an HTML string and author is a string
  // This allows the existing Component templates to work flawlessly
  private mapEntryForFrontend(e: any): BlogEntry {
    let htmlContent = '';
    
    if (typeof e.content === 'object' && e.content !== null) {
      htmlContent = e.content.text || '';
      if (e.content.links && e.content.links.length > 0) {
        htmlContent += '<br/><br/>Links:<br/>' + e.content.links.map((l: string) => `<a href="${l}" target="_blank">${l}</a>`).join('<br/>');
      }
      if (e.content.images && e.content.images.length > 0) {
        htmlContent += '<br/><br/>' + e.content.images.map((img: string) => `<img src="${img}" style="max-width:100%; border-radius: 8px; margin-top: 5px;" alt="Attached image"/>`).join('');
      }
    } else {
      htmlContent = e.content;
    }

    const authorDisplay = typeof e.author === 'object' && e.author !== null 
      ? e.author.username // Use username for display
      : e.author;

    return { ...e, content: htmlContent, author: authorDisplay };
  }

  getEntries(): Observable<BlogEntry[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(entries => entries.map(e => this.mapEntryForFrontend(e)))
    );
  }

  getEntry(id: string): Observable<BlogEntry | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(e => this.mapEntryForFrontend(e))
    );
  }

  addOrUpdateEntry(entry: BlogEntry): void {
    // For this exercise, we keep it simple by posting to the API.
    // Observable must be subscribed to execute the request.
    this.http.post<any>(this.apiUrl, entry).subscribe({
      next: () => console.log('Entry saved successfully'),
      error: err => console.error('Failed to save entry', err)
    });
  }

  addComment(entryId: string, comment: Comment): void {
    this.http.post<any>(`${this.apiUrl}/${entryId}/comments`, comment).subscribe({
      next: () => console.log('Comment saved successfully'),
      error: err => console.error('Failed to save comment', err)
    });
  }
}
