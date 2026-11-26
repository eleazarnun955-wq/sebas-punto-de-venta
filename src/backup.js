const REQUIRED_ARRAYS=["products","customers","sales"];
const OPTIONAL_ARRAYS=["suppliers","purchases","stockMovements","cashClosures"];
const isObject=value=>value!==null&&typeof value==="object"&&!Array.isArray(value);

export function validateBackup(data){
  if(!isObject(data)||data.application!=="SEBAS PUNTO DE VENTA"||!Array.isArray(data.businesses)||data.businesses.length===0)throw Error("El archivo no es un respaldo válido de SEBAS PUNTO DE VENTA.");
  const seenBusinesses=new Set();
  return data.businesses.map((source,index)=>{
    if(!isObject(source)||typeof source.id!=="string"||!source.id.trim()||seenBusinesses.has(source.id))throw Error("El respaldo contiene un negocio inválido o duplicado (registro "+(index+1)+").");
    seenBusinesses.add(source.id);
    if(!isObject(source.settings)||typeof source.settings.name!=="string"||!source.settings.name.trim())throw Error("Falta el nombre de un negocio en el respaldo.");
    for(const key of REQUIRED_ARRAYS)if(!Array.isArray(source[key]))throw Error("El respaldo tiene una lista inválida: "+key+".");
    for(const key of OPTIONAL_ARRAYS)if(source[key]!==undefined&&!Array.isArray(source[key]))throw Error("El respaldo tiene una lista inválida: "+key+".");
    const business=structuredClone(source);
    for(const key of ["products","customers","sales"]){
      const ids=new Set();
      for(const row of business[key]){
        if(!isObject(row)||typeof row.id!=="string"||!row.id.trim()||ids.has(row.id))throw Error("Hay registros inválidos o identificadores duplicados en "+key+".");
        ids.add(row.id);
      }
    }
    for(const product of business.products){
      if(typeof product.name!=="string"||!product.name.trim()||!Number.isFinite(Number(product.price))||Number(product.price)<0||!Number.isFinite(Number(product.stock))||Number(product.stock)<0)throw Error("El respaldo contiene un producto con datos inválidos.");
    }
    for(const sale of business.sales){
      if(!Array.isArray(sale.items)||!Number.isFinite(Number(sale.total))||Number(sale.total)<0)throw Error("El respaldo contiene una venta incompleta o inválida.");
    }
    for(const key of OPTIONAL_ARRAYS)business[key]??=[];
    return business;
  });
}
