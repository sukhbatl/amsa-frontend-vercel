import {isPlatformBrowser} from '@angular/common';
import {Injectable, PLATFORM_ID, inject} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    private readonly isBrowser: boolean = false;
    private readonly platformId = inject(PLATFORM_ID);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.isBrowser = true;
        }
    }

    setItem(key: string, value: string) {
        if (this.isBrowser) {
            localStorage.setItem(key, value);
        }
    }

    getItem(key: string) {
        if (this.isBrowser) {
            return localStorage.getItem(key);
        }
        return undefined;
    }

    removeItem(key: string) {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }
}
