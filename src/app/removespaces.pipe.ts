import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removespaces'
})
export class RemovespacesPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/&nbsp;/g," ");
    // return value.replace(/&nbsp;/g,' ')
    // return value.replace(/\s/g, "&nbsp;")
  }

}
