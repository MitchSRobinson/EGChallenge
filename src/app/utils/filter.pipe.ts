import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if(!items) return [];
        if(!searchText) return items;
        searchText = searchText.toLowerCase();
        return items.filter( it => {
            return it.company_name.toLowerCase().includes(searchText) 
            || it.symbol.toLowerCase().includes(searchText)
            || it.industry.toLowerCase().includes(searchText);
        });
    }
}