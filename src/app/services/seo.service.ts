import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly defaultData: SEOData = {
    title: 'AMSA - Association of Mongolian Students in America',
    description: 'Connecting over 600 Mongolian students pursuing higher education in the US. Join our community, explore opportunities, and build lasting connections.',
    keywords: 'Mongolian students, AMSA, higher education, USA, community, networking, opportunities',
    image: '/assets/images/AMSA_logo_1024.png',
    url: 'https://amsa.org',
    type: 'website',
    author: 'AMSA',
    siteName: 'AMSA',
    locale: 'en_US',
    twitterCard: 'summary_large_image',
    twitterSite: '@AMSA_Official'
  };

  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateSEO(data: Partial<SEOData> = {}): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const seoData = { ...this.defaultData, ...data };
    
    // Update title
    this.title.setTitle(seoData.title!);
    
    // Update meta tags
    this.updateMetaTags(seoData);
    
    // Update Open Graph tags
    this.updateOpenGraphTags(seoData);
    
    // Update Twitter Card tags
    this.updateTwitterCardTags(seoData);
    
    // Add structured data
    this.addStructuredData(seoData);
  }

  private updateMetaTags(data: SEOData): void {
    this.meta.updateTag({ name: 'description', content: data.description! });
    this.meta.updateTag({ name: 'keywords', content: data.keywords! });
    this.meta.updateTag({ name: 'author', content: data.author! });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    this.meta.updateTag({ name: 'theme-color', content: '#d84315' });
    this.meta.updateTag({ name: 'msapplication-TileColor', content: '#d84315' });
  }

  private updateOpenGraphTags(data: SEOData): void {
    this.meta.updateTag({ property: 'og:title', content: data.title! });
    this.meta.updateTag({ property: 'og:description', content: data.description! });
    this.meta.updateTag({ property: 'og:image', content: data.image! });
    this.meta.updateTag({ property: 'og:url', content: data.url! });
    this.meta.updateTag({ property: 'og:type', content: data.type! });
    this.meta.updateTag({ property: 'og:site_name', content: data.siteName! });
    this.meta.updateTag({ property: 'og:locale', content: data.locale! });
    
    if (data.publishedTime) {
      this.meta.updateTag({ property: 'article:published_time', content: data.publishedTime });
    }
    if (data.modifiedTime) {
      this.meta.updateTag({ property: 'article:modified_time', content: data.modifiedTime });
    }
    if (data.section) {
      this.meta.updateTag({ property: 'article:section', content: data.section });
    }
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => {
        this.meta.updateTag({ property: 'article:tag', content: tag });
      });
    }
  }

  private updateTwitterCardTags(data: SEOData): void {
    this.meta.updateTag({ name: 'twitter:card', content: data.twitterCard! });
    this.meta.updateTag({ name: 'twitter:title', content: data.title! });
    this.meta.updateTag({ name: 'twitter:description', content: data.description! });
    this.meta.updateTag({ name: 'twitter:image', content: data.image! });
    this.meta.updateTag({ name: 'twitter:site', content: data.twitterSite! });
    if (data.twitterCreator) {
      this.meta.updateTag({ name: 'twitter:creator', content: data.twitterCreator });
    }
  }

  private addStructuredData(data: SEOData): void {
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": data.type === 'article' ? 'Article' : 'Organization',
      "name": data.title,
      "description": data.description,
      "url": data.url,
      "logo": data.image,
      "sameAs": [
        "https://www.facebook.com/AMSA.Official",
        "https://www.instagram.com/amsa_official",
        "https://www.linkedin.com/company/amsa-official"
      ]
    };

    if (data.type === 'article') {
      structuredData['@type'] = 'Article';
      structuredData['author'] = {
        "@type": "Person",
        "name": data.author
      };
      structuredData['publisher'] = {
        "@type": "Organization",
        "name": data.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": data.image
        }
      };
      if (data.publishedTime) {
        structuredData['datePublished'] = data.publishedTime;
      }
      if (data.modifiedTime) {
        structuredData['dateModified'] = data.modifiedTime;
      }
    }

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }

  // Page-specific SEO methods
  setHomePageSEO(): void {
    this.updateSEO({
      title: 'AMSA - Association of Mongolian Students in America',
      description: 'Connecting over 600 Mongolian students pursuing higher education in the US. Join our community, explore opportunities, and build lasting connections.',
      keywords: 'Mongolian students, AMSA, higher education, USA, community, networking, opportunities, mentorship, AGM, BUOP',
      type: 'website'
    });
  }

  setAboutPageSEO(): void {
    this.updateSEO({
      title: 'About AMSA - Our Mission and Vision',
      description: 'Learn about AMSA\'s mission to connect Mongolian students in America, our programs, and how we support academic and professional growth.',
      keywords: 'about AMSA, mission, vision, Mongolian students, community, programs, support',
      type: 'website'
    });
  }

  setTeamPageSEO(): void {
    this.updateSEO({
      title: 'AMSA Team - Meet Our Leadership',
      description: 'Meet the dedicated AMSA team members who work to support and connect Mongolian students across America.',
      keywords: 'AMSA team, leadership, board members, staff, Mongolian students, community leaders',
      type: 'website'
    });
  }

  setPostSEO(post: any): void {
    this.updateSEO({
      title: `${post.title} - AMSA`,
      description: post.content ? post.content.substring(0, 160) + '...' : 'Read this AMSA post',
      keywords: post.tags ? post.tags.join(', ') : 'AMSA, post, news, update',
      image: post.picUrl ? `https://amsa.org${post.picUrl}` : this.defaultData.image,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      section: 'News',
      tags: post.tags || []
    });
  }

  setProjectSEO(project: string): void {
    const projectData: { [key: string]: { title: string; description: string; keywords: string } } = {
      'agm': {
        title: 'AGM - Annual General Meeting - AMSA',
        description: 'Join us for AMSA\'s Annual General Meeting, our flagship event bringing together Mongolian students from across America.',
        keywords: 'AGM, Annual General Meeting, AMSA, conference, networking, Mongolian students'
      },
      'buop': {
        title: 'BUOP - Best University Opportunity Program - AMSA',
        description: 'Discover BUOP, AMSA\'s program helping Mongolian students find the best university opportunities in America.',
        keywords: 'BUOP, university opportunities, college guidance, AMSA, education, Mongolian students'
      },
      'podcast': {
        title: 'AMSA Podcasts - Stories and Insights',
        description: 'Listen to AMSA podcasts featuring inspiring stories, interviews, and insights from Mongolian students and professionals.',
        keywords: 'AMSA podcasts, stories, interviews, insights, Mongolian students, audio content'
      }
    };

    const data = projectData[project] || projectData['agm'];
    this.updateSEO({
      ...data,
      type: 'website'
    });
  }
}
