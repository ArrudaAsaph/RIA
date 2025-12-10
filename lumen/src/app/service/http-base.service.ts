import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results: T[];
}

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status === 400) {
        errorMessage = 'Dados inválidos enviados.';
      } else if (error.status === 401) {
        errorMessage = 'Não autorizado. Faça login novamente.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor.';
      } else {
        errorMessage = `Erro ${error.status}: ${error.message}`;
      }
      
      if (error.error && error.error.detail) {
        errorMessage = error.error.detail;
      } else if (error.error && typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error && error.error.non_field_errors) {
        errorMessage = error.error.non_field_errors.join(', ');
      }
    }
    
    console.error('Erro HTTP:', error);
    return throwError(() => new Error(errorMessage));
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    const options = {
      headers: this.getHeaders(),
      params: params ? new HttpParams({ fromObject: params }) : undefined
    };
    
    return this.http.get<T>(`${this.apiUrl}/${endpoint}/`, options)
      .pipe(catchError(this.handleError));
  }

  getList<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    const options = {
      headers: this.getHeaders(),
      params: params ? new HttpParams({ fromObject: params }) : undefined
    };
    
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}/`, options)
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}/`, data, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, id: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}/`, data, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  patch<T>(endpoint: string, id: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}/${id}/`, data, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  delete(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}/${id}/`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }
}