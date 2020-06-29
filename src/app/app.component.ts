import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, withLatestFrom } from 'rxjs/operators';

import { NameService } from './name.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  myControl = new FormControl();
  allOptions: Observable<string[]>;
  filteredOptions: Observable<string[]>;

  constructor(nameService: NameService) {
    this.allOptions = nameService.getNames();
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      withLatestFrom(this.allOptions),
      map(([value, allOptions]) => this.filterNames(value, allOptions))
    );
  }

  private filterNames(value: string, allOptions: string[]): string[] {
    const filterValue = value.toLowerCase();

    return allOptions.filter(option => {
      // Do not include empty strings.
      if (value.trim().length === 0) {
        return false;
      }

      return option.toLowerCase().indexOf(filterValue) !== -1;
    });
  }
}
