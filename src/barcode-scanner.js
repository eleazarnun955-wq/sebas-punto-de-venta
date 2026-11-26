let stream=null,raf=0,detector=null,locked=false;
const $=s=>document.querySelector(s);
const panel=$("#scanner-panel"),video=$("#barcode-video"),status=$("#scanner-status");
function say(text){if(status)status.textContent=text}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}if(video)video.srcObject=null;locked=false;if(panel)panel.hidden=true}
async function start(target){if(!navigator.mediaDevices?.getUserMedia){say("Este navegador no permite usar la cámara. Puedes escribir el código manualmente.");panel.hidden=false;return}
if(!("BarcodeDetector" in window)){panel.hidden=false;say("El lector automático no está disponible en este navegador. Actualiza Chrome o escribe el código en el campo Código de barras / SKU.");return}
try{const supported=await BarcodeDetector.getSupportedFormats();const formats=["ean_13","ean_8","upc_a","upc_e","code_128","code_39","itf","codabar"].filter(x=>supported.includes(x));if(!formats.length)throw Error("No hay formatos de códigos compatibles.");detector=new BarcodeDetector({formats});panel.hidden=false;say("Solicitando permiso para usar la cámara…");stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:"environment"},width:{ideal:1280},height:{ideal:720}}});video.srcObject=stream;await video.play();say("Apunta la cámara al código de barras.");const scan=async()=>{if(!stream||locked)return;try{const codes=await detector.detect(video);if(codes.length){const value=codes[0].rawValue;locked=true;handleCode(value,target);return}}catch(e){}raf=requestAnimationFrame(scan)};scan()}catch(e){stop();panel.hidden=false;say(e.message==="Permission denied"?"Permite el acceso a la cámara en los ajustes del navegador.":"No se pudo iniciar la cámara: "+(e.message||"revisa los permisos del navegador."))}}
function handleCode(value,target){stop();if(target==="product"){const field=$("#product-form [name=sku]");if(field){field.value=value;field.focus()}say("Código leído: "+value+". Completa los datos y guarda el producto.");panel.hidden=false;return}
const search=$("#sale-search");search.value=value;search.dispatchEvent(new Event("input",{bubbles:true}));const match=[...$("#picker").querySelectorAll("[data-add]")].find(button=>(button.dataset.sku||"").trim().toLowerCase()===value.trim().toLowerCase());if(match){match.click();say("Producto agregado: "+value);panel.hidden=false;setTimeout(()=>{if(panel)panel.hidden=true},1300)}else{panel.hidden=false;say("No encontré una coincidencia exacta para "+value+". Revisa el código del producto o regístralo primero.")}}
$("#scan-sale")?.addEventListener("click",()=>start("sale"));
$("#scan-product")?.addEventListener("click",()=>start("product"));
$("#close-scanner")?.addEventListener("click",stop);
$("#stop-scanner")?.addEventListener("click",stop);
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop()});
window.addEventListener("pagehide",stop);
