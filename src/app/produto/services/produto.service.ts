import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Produto, Fornecedor, ProdutosResponse} from '../models/produto';
import { environment } from "src/environments/environment";
import { ApiResponse, Pagina } from "src/app/models/ApiResponce";

@Injectable()
export class ProdutoService extends BaseService {

    public UrlServiceV1 = environment.apiURL + "/api/";
    constructor(private http: HttpClient) { super() }

    // obterTodos2(): Observable<Produto[]> {
    //     return this.http
    //         .get<Produto[]>("http://localhost:5001/api/Produto/ObterTodos?Quantidade=5&Pagina=2", super.ObterAuthHeaderJson())
    //         .pipe(catchError(super.serviceError));
    // }

    obterTodos(pagina: any): Observable<ApiResponse<ProdutosResponse>> {
        const params = new HttpParams()
            .set('QuantidadeItens', pagina.quantidade.toString())
            .set('Pagina', pagina.pagina.toString())
            .set('Pesquisa', pagina.pesquisa.toString())
            .set('OrdenacaoCamposProdutosDto', pagina.campo)
            .set('Ordenacao', pagina.ordem)
            ;
    
        return this.http
            .get<ApiResponse<ProdutosResponse>>(`${this.UrlServiceV1}produto/obter-todos`, {
                headers: this.ObterAuthHeaderJson(),
                params: params
            })
            .pipe(
                catchError(super.serviceError)
            );
    }

    listarOrdenacaoCampos(): Observable<string[]> {
        
        return this.http
            .get<string[]>(`${this.UrlServiceV1}produto/listar-ordenacao-campos-produto`, {
                headers: this.ObterAuthHeaderJson(),
            })
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
            .put(this.UrlServiceV1 + "produto/" + produto.id, produto,)
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

