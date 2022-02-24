import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'bypassHTMLsanitization'
})
export class BypassHTMLsanitizationPipe implements PipeTransform {

  constructor(private sanitizer:DomSanitizer){}

  transform(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}
