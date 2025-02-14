import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickMortyService, Character } from '@services/rick-morty.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger';

@Component({
  selector: 'app-api-test',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, TagModule],
  template: `
    <div class="container mx-4">
      <h1 class="text-4xl font-bold mb-4">Rick & Morty Characters</h1>
      <p-divider></p-divider>
      
      <div class="grid">
        <div *ngFor="let character of characters" 
             class="col-12 md:col-6 lg:col-4 p-2">
          <p-card>
            <ng-template pTemplate="header">
              <img [src]="character.image" 
                   [alt]="character.name" 
                   class="w-full border-round-top">
            </ng-template>

            <h2 class="text-xl font-bold mb-2">{{character.name}}</h2>
            
            <div class="flex flex-column gap-2">
              <div class="flex align-items-center gap-2">
                <p-tag [severity]="getStatusSeverity(character.status)">
                  {{character.status}}
                </p-tag>
                <span class="text-gray-600">{{character.species}}</span>
              </div>
              
              <div class="flex flex-column gap-1">
                <small class="text-gray-500">Last known location:</small>
                <span>{{character.location.name}}</span>
              </div>
              
              <div class="flex flex-column gap-1">
                <small class="text-gray-500">Origin:</small>
                <span>{{character.origin.name}}</span>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <p-divider></p-divider>
      
      <div class="flex justify-content-center gap-2 mb-4">
        <p-button 
          *ngIf="currentPage > 1"
          (onClick)="loadPage(currentPage - 1)"
          icon="pi pi-chevron-left" 
          label="Previous"
          [outlined]="true">
        </p-button>
        <p-button 
          *ngIf="hasNextPage"
          (onClick)="loadPage(currentPage + 1)"
          icon="pi pi-chevron-right" 
          label="Next"
          iconPos="right"
          [outlined]="true">
        </p-button>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep {
        .p-card {
          height: 100%;
        }

        .p-card-content {
          padding-top: 1rem;
        }
      }
    `
  ]
})
export class ApiTestComponent implements OnInit {
  characters: Character[] = [];
  currentPage = 1;
  hasNextPage = false;

  constructor(private rickMortyService: RickMortyService) {}

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.rickMortyService.getCharacters(page).subscribe(response => {
      this.characters = response.results;
      this.currentPage = page;
      this.hasNextPage = !!response.info.next;
    });
  }

  getStatusSeverity(status: string): TagSeverity {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'success';
      case 'dead':
        return 'danger';
      default:
        return 'warn';
    }
  }
} 