import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  describe('Browser Platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          LocalStorageService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });
      service = TestBed.inject(LocalStorageService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set item in localStorage', () => {
      spyOn(localStorage, 'setItem');
      service.setItem('testKey', 'testValue');
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', 'testValue');
    });

    it('should get item from localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('testValue');
      const result = service.getItem('testKey');
      expect(result).toBe('testValue');
      expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
    });

    it('should remove item from localStorage', () => {
      spyOn(localStorage, 'removeItem');
      service.removeItem('testKey');
      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
    });
  });

  describe('Server Platform', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          LocalStorageService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      service = TestBed.inject(LocalStorageService);
    });

    it('should not set item on server', () => {
      // Should not throw error
      expect(() => service.setItem('testKey', 'testValue')).not.toThrow();
    });

    it('should return undefined when getting item on server', () => {
      const result = service.getItem('testKey');
      expect(result).toBeUndefined();
    });

    it('should not remove item on server', () => {
      // Should not throw error
      expect(() => service.removeItem('testKey')).not.toThrow();
    });
  });
});

