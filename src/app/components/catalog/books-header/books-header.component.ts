import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-books-header',
  templateUrl: './books-header.component.html',
  styleUrls: ['./books-header.component.css']
})
export class BooksHeaderComponent{
  // Fields
  @Output()
  columnsCountChange = new EventEmitter<number>();

  @Output()
  itemsCountChange = new EventEmitter<number>();

  @Output()
  sortChange = new EventEmitter<string>();

  protected sort = 'descending';

  protected itemsShowCount = 12;

  // Public methods

  // Protected methods
  protected onColumnsUpdated(colsNum: number): void{
    this.columnsCountChange.emit(colsNum);
  }

  protected onItemsUpdated(count: number): void{
    this.itemsShowCount = count;
    this.itemsCountChange.emit(count)
  }

  protected onSortUpdated(newSort: string): void{
    this.sort = newSort;
    this.sortChange.emit(newSort);
  }
}
