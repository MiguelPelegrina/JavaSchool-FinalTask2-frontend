import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { Book } from 'src/app/shared/domain/book/book';
import { BoughtBook } from 'src/app/shared/domain/book/bought-book/bought-book';
import { Cart } from 'src/app/shared/domain/cart/cart';

/**
 * A service for managing the shopping cart.
 * Handles operations such as adding, removing, and updating items in the cart.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Fields
  cartSubject = new BehaviorSubject<Cart>({boughtBooks: []});

  cart: BoughtBook[] = [];

  /**
   * Constructor for the CartService.
   * @param snackbar - Angular Material's MatSnackBar for displaying notifications.
   */
  constructor(private snackbar: MatSnackBar){}

  /**
   * Adds a new item to the cart.
   *
   * @param newItem - The item to be added to the cart.
   */
  public addToCart(newItem: BoughtBook): void {
    this.loadCart();

    const itemInCart = this.cart.find(item => item.id === newItem.id);

    if (itemInCart) {
      itemInCart.quantity++;
    } else {
      this.cart.push(newItem);
    }

    this.saveCart();

    this.snackbar.open(`${newItem.title} added to cart`, 'Ok', { duration: 3000 });
  }

  /**
   * Clears the cart.
   */
  public clearCart(): void {
    this.cartSubject.next({ boughtBooks: [] });

    this.cart = [];

    localStorage.removeItem('cart_items');

    this.snackbar.open('Cart is cleared', 'Ok', { duration: 3000 });
  }

  /**
   * Checks if there is enough stock for a given book.
   * @param book - The book to check for stock availability.
   * @returns True if there is enough stock, false otherwise.
   */
  public enoughStock(book: Book): boolean {
    const bookInCart = this.cart.find(_book => _book.id === book?.id);

    return !(bookInCart && bookInCart.quantity + 1 > book.stock);
  }

  /**
   * Retrieves the books in the cart.
   * @returns An array of bought books in the cart.
   */
  public getBooks(): BoughtBook[] {
    return this.cart;
  }

  /**
   * Calculates the total price of bought books in the cart.
   * @param boughtBooks - The array of bought books in the cart.
   * @returns The total price of bought books.
   */
  public getTotal(boughtBooks: BoughtBook[]): number {
    return boughtBooks.map((boughtBook) => boughtBook.price * boughtBook.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  /**
   * Loads the cart from local storage.
   */
  public loadCart(): void {
    if (localStorage.getItem('cart_items')) {
      this.cart = JSON.parse(localStorage.getItem('cart_items')!) || [];
    } else {
      this.cart = [];
    }

    this.saveCart();
  }

  /**
   * Removes a bought book from the cart.
   * @param boughtBook - The bought book to be removed.
   * @param update - Whether to display a snackbar message.
   * @returns The updated array of bought books in the cart.
   */
  public removeFromCart(boughtBook: BoughtBook, update = true): BoughtBook[] {
    this.cart = this.cart.filter((book) => book.id !== boughtBook.id);

    if (update) {
      this.snackbar.open(`${boughtBook.title} removed from cart`, 'Ok', { duration: 3000 });
    }

    this.saveCart();

    return this.cart;
  }

  /**
   * Removes one quantity from a bought book in the cart.
   *
   * @param updatedBook - The bought book to be updated.
   */
  public removeQuantity(updatedBook: BoughtBook): void {
    let bookForRemoval: BoughtBook | undefined;

    this.cart = this.cart.map((book) => {
      if (book.id === updatedBook.id) {
        book.quantity--;

        if (book.quantity === 0) {
          bookForRemoval = book;
        }
      }

      return book;
    });

    if (bookForRemoval) {
      this.cart = this.removeFromCart(bookForRemoval, false);
    }

    this.saveCart();

    this.snackbar.open('1 item removed from cart', 'Ok', { duration: 3000 });
  }

  // Private methods
  /**
   * Saves the current cart state to local storage and notifies subscribers.
   */
  private saveCart(): void {
    this.cartSubject.next({ boughtBooks: this.cart });
    localStorage.setItem('cart_items', JSON.stringify(this.cart));
  }
}
