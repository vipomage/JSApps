let myDate = new Date(2018,3,15);

let dd = '8';
if ( dd.length!==2 ){
  dd = '0'+dd
}

console.log(`${myDate.getFullYear()}-${dd }-${myDate.getDate()}`);
console.log();