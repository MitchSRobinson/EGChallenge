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
            for (let key in it) {
                let value = String(it[key])
                if (typeof value != 'undefined') {
                    if (value.toLowerCase().includes(searchText)) {
                        return true;
                    }
                }
            }
        });
    }
}