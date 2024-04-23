import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Produto, Fornecedor, ApiResponse, ProdutosResponse } from '../models/produto';

@Injectable()
export class ProdutoService extends BaseService {


    //http://localhost:5001/api/Produto/ObterProdutos?Quantidade=1&Pagina=0
    constructor(private http: HttpClient) { super() }

    public UrlServiceV1: "http://localhost:5001/api/";

    obterTodos2(): Observable<Produto[]> {
        return this.http
            .get<Produto[]>("http://localhost:5001/api/Produto/ObterTodos?Quantidade=5&Pagina=2", super.ObterAuthHeaderJson())
            .pipe(catchError(super.serviceError));
    }

    obterTodos(): Observable<ApiResponse<ProdutosResponse>> {
        return this.http
            .get<ApiResponse<ProdutosResponse>>("http://localhost:5001/api/Produto/ObterTodos?Quantidade=5&Pagina=2", super.ObterAuthHeaderJson())
            .pipe(
                catchError(super.serviceError)
            );
    }

    obterPorId(id: string): Observable<Produto> {
        return this.http
            .get<Produto>(this.UrlServiceV1 + "produto/" + id)
            .pipe(catchError(super.serviceError));
    }

    novoProduto(produto: Produto): Observable<Produto> {
        return this.http
            .post("http://localhost:5001/api/produto/criar", produto)
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    atualizarProduto(produto: Produto): Observable<Produto> {
        return this.http
            .put(this.UrlServiceV1 + "produto/" + produto.id, produto, super.ObterAuthHeaderJson())
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }

    excluirProduto(id: string): Observable<Produto> {
        return this.http
            .delete(this.UrlServiceV1 + "produto/" + id,)
            .pipe(
                map(super.extractData),
                catchError(super.serviceError));
    }    

    obterFornecedores(): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.UrlServiceV1 + "fornecedores")
            .pipe(catchError(super.serviceError));
    }
}