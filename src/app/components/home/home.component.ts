// import { Component, OnInit } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { debounceTime, filter } from 'rxjs';

// @Component({
//   selector: 'front-end-internship-assignment-home',
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss'],
// })
// export class HomeComponent implements OnInit {
//   bookSearch: FormControl;

//   constructor() {
//     this.bookSearch = new FormControl('');
//   }

//   trendingSubjects: Array<any> = [
//     { name: 'JavaScript' },
//     { name: 'CSS' },
//     { name: 'HTML' },
//     { name: 'Harry Potter' },
//     { name: 'Crypto' },
//   ];

//   ngOnInit(): void {
//     this.bookSearch.valueChanges
//       .pipe(
//         debounceTime(300),
//       ).
//       subscribe((value: string) => {
//       });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchResults: any[] = [];
  displayedColumns: string[] = ['title', 'author', 'published', 'isbn'];

  constructor(private http: HttpClient) {
    this.bookSearch = new FormControl('');
  }
    trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  ngOnInit(): void {
    this.bookSearch.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value: string) => value.trim().length >= 3),
      switchMap((value: string) => {
        const params = new HttpParams().set('q', value);
        return this.http.get('http://openlibrary.org/search.json', { params });
      })
    ).subscribe((response: any) => {
      this.searchResults = response.docs;
    });
  }

}

