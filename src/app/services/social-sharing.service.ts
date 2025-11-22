import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialSharingService {
  private readonly baseUrl = 'https://amsa.org';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Native Web Share API (if supported)
  async shareNative(data: ShareData): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId) || !navigator.share) {
      return false;
    }

    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      return false;
    }
  }

  // Facebook sharing
  shareFacebook(data: ShareData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.text)}`;
    this.openShareWindow(url, 'Facebook');
  }

  // Twitter sharing
  shareTwitter(data: ShareData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const text = `${data.title} - ${data.text}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}&hashtags=AMSA,MongolianStudents`;
    this.openShareWindow(url, 'Twitter');
  }

  // LinkedIn sharing
  shareLinkedIn(data: ShareData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}&summary=${encodeURIComponent(data.text)}`;
    this.openShareWindow(url, 'LinkedIn');
  }

  // WhatsApp sharing
  shareWhatsApp(data: ShareData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const text = `${data.title}\n\n${data.text}\n\n${data.url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    this.openShareWindow(url, 'WhatsApp');
  }

  // Email sharing
  shareEmail(data: ShareData): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const subject = data.title;
    const body = `${data.text}\n\nRead more: ${data.url}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  // Copy link to clipboard
  async copyLink(data: ShareData): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) return false;

    try {
      await navigator.clipboard.writeText(data.url);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  // Generate shareable content for posts
  generatePostShareData(post: any): ShareData {
    return {
      title: post.title,
      text: post.content ? post.content.substring(0, 200) + '...' : 'Check out this AMSA post',
      url: `${this.baseUrl}/post/${post.id}`,
      image: post.picUrl ? `${this.baseUrl}${post.picUrl}` : undefined
    };
  }

  // Generate shareable content for user profiles
  generateProfileShareData(user: any): ShareData {
    return {
      title: `${user.firstName} ${user.lastName} - AMSA Member`,
      text: `Meet ${user.firstName} ${user.lastName}, an AMSA member studying at ${user.schoolName}`,
      url: `${this.baseUrl}/profile/user/${user.id}`,
      image: user.profilePic ? `${this.baseUrl}${user.profilePic}` : undefined
    };
  }

  // Generate shareable content for projects
  generateProjectShareData(project: string): ShareData {
    const projectData = {
      'agm': {
        title: 'AMSA AGM - Annual General Meeting',
        text: 'Join us for AMSA\'s Annual General Meeting, our flagship event bringing together Mongolian students from across America.'
      },
      'buop': {
        title: 'AMSA BUOP - Best University Opportunity Program',
        text: 'Discover BUOP, AMSA\'s program helping Mongolian students find the best university opportunities in America.'
      },
      'podcast': {
        title: 'AMSA Podcasts - Stories and Insights',
        text: 'Listen to AMSA podcasts featuring inspiring stories, interviews, and insights from Mongolian students and professionals.'
      }
    };

    const data = projectData[project] || projectData['agm'];
    return {
      title: data.title,
      text: data.text,
      url: `${this.baseUrl}/work/${project}`
    };
  }

  private openShareWindow(url: string, platform: string): void {
    const width = 600;
    const height = 400;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    window.open(
      url,
      `${platform}Share`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  }
}
