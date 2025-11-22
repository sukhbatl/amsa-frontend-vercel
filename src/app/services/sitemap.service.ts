import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private readonly baseUrl = 'https://amsa.org';
  private readonly staticUrls: SitemapUrl[] = [
    { loc: '/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 1.0 },
    { loc: '/about', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: '/members', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.7 },
    { loc: '/work/agm', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: '/work/buop', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.8 },
    { loc: '/work/podcast', lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.7 },
    { loc: '/donation', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.6 }
  ];

  constructor(private http: HttpClient) {}

  generateSitemap(): Observable<string> {
    return this.getDynamicUrls().pipe(
      map(dynamicUrls => {
        const allUrls = [...this.staticUrls, ...dynamicUrls];
        return this.buildSitemapXML(allUrls);
      }),
      catchError(error => {
        console.error('Error generating sitemap:', error);
        return of(this.buildSitemapXML(this.staticUrls));
      })
    );
  }

  private getDynamicUrls(): Observable<SitemapUrl[]> {
    // In a real implementation, you would fetch posts and user profiles from your API
    // For now, we'll return a mock structure
    const mockDynamicUrls: SitemapUrl[] = [
      // Mock posts - in real implementation, fetch from API
      { loc: '/post/1', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.6 },
      { loc: '/post/2', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.6 },
      // Mock user profiles - in real implementation, fetch from API
      { loc: '/profile/user/1', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.5 },
      { loc: '/profile/user/2', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.5 }
    ];

    return of(mockDynamicUrls);
  }

  private buildSitemapXML(urls: SitemapUrl[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetClose = '</urlset>';

    const urlEntries = urls.map(url => {
      let urlXml = `  <url>
    <loc>${this.baseUrl}${url.loc}</loc>`;
      
      if (url.lastmod) {
        urlXml += `
    <lastmod>${url.lastmod}</lastmod>`;
      }
      
      if (url.changefreq) {
        urlXml += `
    <changefreq>${url.changefreq}</changefreq>`;
      }
      
      if (url.priority) {
        urlXml += `
    <priority>${url.priority}</priority>`;
      }
      
      urlXml += `
  </url>`;
      
      return urlXml;
    }).join('\n');

    return `${xmlHeader}
${urlsetOpen}
${urlEntries}
${urlsetClose}`;
  }

  // Method to generate robots.txt content
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Allow all other content
Allow: /about
Allow: /members
Allow: /work/
Allow: /post/
Allow: /profile/`;
  }
}
