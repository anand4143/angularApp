import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ssn'
})
export class SsnPipe implements PipeTransform {

  transform(value, args) {
      if (!value) { return ''; }
      else{
        var value = value.toString().trim().replace(/^\+/, '');        
        if (value.match(/[^0-9]/)) {
            return value;
        }

        console.log(value.length);
        var aaa, gg, cccc;

        if(value.length == 9) {                      
          aaa = value.slice(0, 3);console.log('aaa',aaa);console.log('value',value);
          gg = value.slice(3, 5);console.log('gg',gg);
          cccc = value.slice(5,9);console.log('cccc',cccc);
          console.log(((aaa + '-' + gg + '-' + cccc).trim()).length)  
          return (aaa + '-' + gg + '-' + cccc).trim();                    
        }
        else{
          return value;
        }    
      }      
      
  }
  
}
