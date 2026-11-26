const KEY="sebas-pos-businesses-v1",ACTIVE="sebas-pos-active-v1";
const uid=()=>crypto.randomUUID();
const all=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}};
const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
const fresh=(name="Mi negocio")=>({id:uid(),settings:{name,owner:"",phone:"",currency:"MXN"},products:[],customers:[],sales:[],suppliers:[],purchases:[],stockMovements:[],cashClosures:[]});
export function init(){let a=all();if(!a.length){a=[fresh()];write(a)}if(!a.some(x=>x.id===localStorage.getItem(ACTIVE)))localStorage.setItem(ACTIVE,a[0].id);return get()}
export function get(){const x=all().find(x=>x.id===localStorage.getItem(ACTIVE));if(!x)throw Error("Negocio no encontrado");return structuredClone({...x,suppliers:x.suppliers||[],purchases:x.purchases||[],stockMovements:x.stockMovements||[],cashClosures:x.cashClosures||[]})}
export function save(x){const a=all(),i=a.findIndex(y=>y.id===x.id);if(i<0)throw Error("Negocio no encontrado");a[i]=x;write(a)}
export function list(){return all().map(x=>({id:x.id,name:x.settings.name}))}
export function activate(id){if(!all().some(x=>x.id===id))throw Error("Negocio no encontrado");localStorage.setItem(ACTIVE,id)}
export function addBusiness(name){const a=all(),x=fresh(name);a.push(x);write(a);activate(x.id);return x}
export function backup(){return JSON.stringify({application:"SEBAS PUNTO DE VENTA",version:1,createdAt:new Date().toISOString(),businesses:all()},null,2)}