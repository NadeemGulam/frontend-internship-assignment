import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import * as _ from 'underscore';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearchText: string = '';
  bookSearch: FormControl;
  searchResults: any[] = [];
  displayedColumns: string[] = ['title', 'author', 'published', 'isbn'];
  isLoading: boolean = false;
  totalRecords!: number;
  pageNo: number = 0;
  pagin!: number;
  pages: any[] = [];
  PaginatedArray: any[] = [];
  firstIndex: number = 0;
  lastIndex: number = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  constructor(private http: HttpClient) {
    this.bookSearch = new FormControl('');
    console.log(this.dataSource);
  }
  ngOnInit(): void {
    this.getList();
  }
  getList() {
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value: string) => value.trim().length >= 3),
        switchMap((value: string) => {
          const params = new HttpParams().set('q', value);
          return this.http.get('http://openlibrary.org/search.json', {
            params,
          });
        })
      )
      .subscribe((response: any) => {
        if (response) {
          // this.isLoading = true;
          this.searchResults = response.docs;
          this.setPage(this.pageNo);
          console.log(this.searchResults, 'search result');

          this.totalRecords = this.searchResults?.length;
          this.pagin = Math.ceil(this.totalRecords / 10);
          this.pages = _.range(this.pagin);
          console.log(this.pagin, 'pagin');
          console.log(this.pages, 'pages');
        } else {
          this.isLoading = false;
        }
      });
  }
  /**
   * updating data source value
   */
  dataSource = new MatTableDataSource<any>(this.searchResults);

  /**
   * list of subjects in navbar
   */
  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];

  /**
   * on click close icon in search bar
   */
  removeSearch() {
    this.bookSearch.setValue('');
  }
  setPage(page: number) {
    this.PaginatedArray = [];
    console.log(page);

    this.pageNo = page;
    this.firstIndex = this.pageNo * 10;
    this.lastIndex = this.firstIndex + 10;
    console.log(this.firstIndex, 'f');
    console.log(this.lastIndex, 'l');
    this.PaginatedArray = this.searchResults.slice(
      this.firstIndex,
      this.lastIndex
    );
    window.scroll(0, 0);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
