import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { CurrencyUtils } from 'src/app/utils/currency-utils';
import { ProdutoBaseComponent } from '../produto-form.base.component';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html'
})
export class ListaComponent implements OnInit {

  public produtos: Produto[];
  public produto: Produto;
  errorMessage: string;

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  pForm: FormGroup;

  constructor(private fb: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router) { }

  visible: boolean = false;

  showDialog() {
      this.visible = true;
  }

  adicionarProduto() {
    if (this.pForm.dirty && this.pForm.valid) {
      this.produto = Object.assign({}, this.produto, this.pForm.value);

      this.produtoService.novoProduto(this.produto)
        .subscribe({
          next: (sucesso: any) => {  },
        });

    }
  }

  ngOnInit(): void {

    this.pForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      descricao: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      valor: ['', [Validators.required]],
      ativo: [true]
    });


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
