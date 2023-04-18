import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient,
    private router: Router) { }


  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page)
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401) {
          this.router.navigate(['/clientes']);
        }
        return throwError(() => e);
      })
    )
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if (e.status === 400) {
          return throwError(() => e);
        }
        return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes/form'])
        return throwError(() => e);

      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {

    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }

}
