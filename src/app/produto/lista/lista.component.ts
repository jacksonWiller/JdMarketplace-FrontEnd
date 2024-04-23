import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Produto } from '../models/produto';
import { ProdutoService } from '../services/produto.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { CurrencyUtils } from 'src/app/utils/currency-utils';
import { ProdutoBaseComponent } from '../produto-form.base.component';
import { MessageService } from 'primeng/api';


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

  closeDialog() {
    this.visible = false;
  } 

  ObterProdutos() {
    this.produtoService.obterTodos()
  .subscribe(
    response => {
      if (response && response.result && response.result.produtos) {
        this.produtos = response.result.produtos;
      } else {
        this.errorMessage = 'Nenhum produto encontrado';
      }
    },
    error => {
      this.errorMessage = error;
    }
  );
  } 

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  adicionarProduto() {
    if (this.pForm.dirty && this.pForm.valid) {
      this.produto = Object.assign({}, this.produto, this.pForm.value);
      this.produtoService.novoProduto(this.produto)
        .subscribe({
          next: (sucesso: any) => {
            this.closeDialog();
            this.reloadComponent();

          },
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

    this.ObterProdutos();
  
}
  
}
