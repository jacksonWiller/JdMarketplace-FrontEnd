import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormControlName, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


import { Observable, fromEvent, merge } from 'rxjs';


import { ProdutoService } from '../services/produto.service';
import { ProdutoBaseComponent } from '../produto-form.base.component';
import { Produto } from '../models/produto';
import { ApiResponse } from 'src/app/models/ApiResponce';


@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  formulario: FormGroup;
  produto: Produto;

  constructor(private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private messageService: MessageService,
  ){
    this.criarFormulario();
    
  }

  ngOnInit(): void {
    
  }

  criarFormulario() {
    this.formulario = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: [''],
      objetivo: [''],
      preco: ['']
    });
  }

  uploadedFiles: any[] = [];
  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}

    fileToUpload: any;
    imageUrl: any;
    handleFileInput(file: FileList) {
      this.fileToUpload = file.item(0);

    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  adicionarProduto() {
    if (this.formulario.dirty && this.formulario.valid) {
      const produtoParaCadastro = Object.assign({}, this.formulario.value);
  
      this.produtoService.novoProduto(produtoParaCadastro)
        .subscribe({
          next: (resposta: ApiResponse<Produto>) => {
            if (resposta.success) {
              const idProduto = resposta.result.id;
              this.adicionarImagem(idProduto);
            }
            this.messageService.add({ 
              severity: 'success', 
              summary: 'Produto Cadastrado', 
              detail: resposta.successMessage
            });
          },
        });
    }
  }
  
  adicionarImagem(idProduto: string) {
    if (this.fileToUpload) {
      this.produtoService.adicionarImagemProduto(this.fileToUpload, idProduto)
        .subscribe({
          next: (respostaImagem: ApiResponse<any>) => {
            if (respostaImagem.success) {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Imagem Adicionada', 
                detail: respostaImagem.successMessage
              });
            }
          },
        });
    }
  }

onSubmit() {
  if (this.formulario.valid) {
    console.log(this.formulario.value);
    this.adicionarProduto();
    // Aqui você pode tratar os dados, como enviar para um serviço
  } else {
    console.log('Formulário inválido');
    console.log(this.formulario.value)
    // Aqui você pode lidar com a situação de formulário inválido
  }
}

}

