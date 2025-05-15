import { Injectable, inject, signal, computed } from '@angular/core';
import { DataService } from './data.service';
import { catchError, Observable, tap } from 'rxjs';
import { environment } from '@src/environments/environment';

interface SkinState {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkinService extends DataService {
  dataService: DataService = inject(DataService);

  private skinState = signal<SkinState>({
    primaryColor: '#000',
    secondaryColor: '#fff'
  });

  constructor() {
    super();
    this.initializeSkin();
  }

  private initializeSkin() {
    // Check URL first
    const urlParams = new URLSearchParams(window.location.search);
    const domain = urlParams.get('domain');

    if (domain) {
      this.loadSkin(domain).subscribe();
    } else {
      // If no domain in URL, try localStorage
      const storedSkin = localStorage.getItem('client-skin');
      if (storedSkin) {
        const { primaryColor, secondaryColor } = JSON.parse(storedSkin);
        this.applySkinStyles(primaryColor, secondaryColor);
      }
    }
  }

  public primaryColor = computed(() => this.skinState().primaryColor);
  public secondaryColor = computed(() => this.skinState().secondaryColor);

  private applySkinStyles(primaryColor: string, secondaryColor: string) {
    // Update the class skinState instead of creating a new one
    this.skinState.set({ primaryColor, secondaryColor });
    
    let styleElement = document.getElementById('client-skin-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'client-skin-styles';
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .client-primary-color { color: ${primaryColor} !important; }
      .client-primary-bg { background-color: ${primaryColor} !important; }
      .client-secondary-color { color: ${secondaryColor} !important; }
      .client-secondary-bg { background-color: ${secondaryColor} !important; }
    `;
  }

  loadSkin(domain: string) {
    return this.dataService.httpFetch(`clients/skin?domain=${domain}`)
      .pipe(
        tap((res: any) => {
          const primaryColor = res.data.primary_color;
          const secondaryColor = res.data.secondary_color;
          
          // Store in localStorage
          localStorage.setItem('client-skin', JSON.stringify({
            primaryColor,
            secondaryColor
          }));

          this.applySkinStyles(primaryColor, secondaryColor);
          console.log('Client skin styles applied:', { primaryColor, secondaryColor });
        }),
        catchError((error) => {
          console.error('Error loading skin:', error);
          this.applySkinStyles('#007bff', '#6c757d');
          throw error;
        })
      );
  }
}