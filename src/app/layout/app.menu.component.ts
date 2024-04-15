import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Meus Produtos',
                items: [
                    { label: 'Listar Produtos', icon: 'pi pi-fw pi-home', routerLink: ['/produtos/listar-todos'] },
                    { label: 'Listar Produtos', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                ]
            },
           
        ]
           
    }
}
