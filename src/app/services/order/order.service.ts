import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/domain/order/order';
import { AbstractService } from 'src/app/shared/service/abstract.service';
import { StringValues } from 'src/app/shared/utils/string-values';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends AbstractService<Order, number>{
  constructor(protected override httpClient: HttpClient) {
    super(StringValues.BASE_ORDER_URL, httpClient);
  }
}
