import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EstadoBr } from './../models/estado-br';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {
  getEstadosBr(): any {
    return this.http.get<EstadoBr>('assets/dados/estadosbr.json');
  }
  constructor(private http: HttpClient) { }
}
