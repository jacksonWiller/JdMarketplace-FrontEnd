import { Component, OnInit } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  public produtos: Produto[];
  errorMessage: string;

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.obterTodos()
      .subscribe(
        produtos => {
          if (produtos) {
            this.produtos = produtos;
          } else {
            this.errorMessage = 'Nenhum produto encontrado';
          }
        },
        error => {
          if (error) {
            this.errorMessage = error;
          }
        }
      );
}
  
}
