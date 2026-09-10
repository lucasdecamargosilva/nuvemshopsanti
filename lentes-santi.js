(function () {
    'use strict';

    if (window.__PL_SANTI_LENS_FLOW__) return;
    var preview = window.SANTI_LENTES_PREVIEW === true;
    if (!preview) return; // Somente prévia local, sem instalação em produção.
    var path = String(location.pathname || '').replace(/\/+$/, '').toLowerCase();
    if (!preview && !/^\/produtos\/[^/]+$/.test(path)) return;
    var productForm = document.querySelector('#product_form');
    var productName = '';
    try { productName = String(window.LS && window.LS.product && window.LS.product.name || ''); } catch (_) { }
    if (!productName) productName = String((document.querySelector('h1.product-name, h1.product__title, h1') || {}).textContent || '');
    var normalizedName = productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var hasPrescriptionOptions = productForm && [].slice.call(productForm.querySelectorAll('option')).some(function (option) {
        return /lente(s)? de grau|somente armacao|par de lentes com/.test(String(option.textContent || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
    });
    var isPrescriptionFrame = !!hasPrescriptionOptions || /armacao.*grau|oculos.*grau/.test(normalizedName);
    if (!preview && (!isPrescriptionFrame || /^par de lente/.test(normalizedName))) return;
    window.__PL_SANTI_LENS_FLOW__ = true;





    /* IDs e preços conferidos na loja em 09/09/2026. */
    var LENTES = [{"id": "352397182", "variantId": "1549128688", "nome": "Orgânicas + Antirreflexo Tradicional | Kodak", "preco": 256, "material": "Grau leve · Orgânicas", "visao": "simples", "solar": false, "semgrau": false, "blue": false, "foto": false, "ar": true, "neg": -3, "pos": 3, "cil": 2, "add": null, "img": ""}, {"id": "352397202", "variantId": "1549128791", "nome": "Orgânicas + Antirreflexo BLUE UV | Kodak", "preco": 299, "material": "Grau leve · Orgânicas", "visao": "simples", "solar": false, "semgrau": false, "blue": true, "foto": false, "ar": true, "neg": -3, "pos": 3, "cil": 2, "add": null, "img": ""}, {"id": "352607763", "variantId": "1549705758", "nome": "Orgânicas + Transitions BLUE UV | Kodak", "preco": 649, "material": "Grau leve · Orgânicas", "visao": "simples", "solar": false, "semgrau": false, "blue": true, "foto": true, "ar": true, "neg": -3, "pos": 3, "cil": 2, "add": null, "img": ""}, {"id": "352397222", "variantId": "1549128963", "nome": "Policarbonato + Antirreflexo Tradicional | Kodak", "preco": 379, "material": "Grau moderado · Policarbonato", "visao": "simples", "solar": false, "semgrau": false, "blue": false, "foto": false, "ar": true, "neg": -5, "pos": 4, "cil": 2, "add": null, "img": ""}, {"id": "352397229", "variantId": "1549128990", "nome": "Policarbonato + Antirreflexo BLUE UV | Kodak", "preco": 399, "material": "Grau moderado · Policarbonato", "visao": "simples", "solar": false, "semgrau": false, "blue": true, "foto": false, "ar": true, "neg": -5, "pos": 4, "cil": 2, "add": null, "img": ""}, {"id": "352397244", "variantId": "1549129212", "nome": "Policarbonato + Transitions BLUE UV | Kodak", "preco": 1449, "material": "Grau moderado · Policarbonato", "visao": "simples", "solar": false, "semgrau": false, "blue": true, "foto": true, "ar": true, "neg": -5, "pos": 4, "cil": 2, "add": null, "img": ""}, {"id": "352397253", "variantId": "1549129239", "nome": "1.67 Alto índice + Antirreflexo Tradicional | Kodak", "preco": 879, "material": "Grau alto · 1.67 Alto índice", "visao": "simples", "solar": false, "semgrau": false, "blue": false, "foto": false, "ar": true, "neg": -9, "pos": 6, "cil": 2, "add": null, "img": ""}, {"id": "352397261", "variantId": "1549129334", "nome": "1.67 Alto índice + Antirreflexo BLUE UV | Kodak", "preco": 989, "material": "Grau alto · 1.67 Alto índice", "visao": "simples", "solar": false, "semgrau": false, "blue": true, "foto": false, "ar": true, "neg": -9, "pos": 6, "cil": 2, "add": null, "img": ""}, {"id": "352397518", "variantId": "1549133026", "nome": "Lentes sem grau + filtro de luz azul", "preco": 120, "material": "Sem grau", "visao": "simples", "solar": false, "semgrau": true, "blue": true, "foto": false, "ar": true, "neg": 0, "pos": 0, "cil": 0, "add": null, "img": ""}];

    var state = { visao:null, trat:null, receita:null, lente:null, last:'abriu' };
    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };
    var brl = function (v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); };
    var esc = function (s) { var d=document.createElement('div'); d.textContent=String(s == null ? '' : s); return d.innerHTML; };

    function sid() {
        try { var s=localStorage.getItem('pl_sid'); if(!s){s='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,10);localStorage.setItem('pl_sid',s);} return s; }
        catch (_) { return 'nostore'; }
    }
    function phone() {
        var own = ($('#pls-phone') || {}).value || '';
        var existing = ($('#q-phone') || {}).value || '';
        var saved = ''; try { saved=localStorage.getItem('pl_last_phone') || ''; } catch (_) {}
        return (own || existing || saved).replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'');
    }
    function track(step, detail) { state.last=step; } // Sem envio de dados na prévia.
    function product() {
        var title=($('.product-name, .js-product-name, h1')||{}).textContent || document.title || 'Sua armação Santi';
        var price=0;
        try { if(window.LS && LS.variants && LS.variants[0]) price=Number(LS.variants[0].price_number)||0; } catch (_) {}
        if(!price){var txt=(document.querySelector('.js-price-display,.product-price,.price')||{}).textContent||'';var m=txt.match(/[\d.]+,\d{2}/);if(m)price=Number(m[0].replace(/\./g,'').replace(',','.'));}
        return {nome:title.trim(),preco:price};
    }

    function degree(r) {
        if(!r) return {esf:0,cil:0,add:null};
        var a=Number(r.odEsf)||0,b=Number(r.oeEsf)||0;
        return {esf:Math.abs(a)>=Math.abs(b)?a:b,cil:Math.max(Math.abs(Number(r.odCil)||0),Math.abs(Number(r.oeCil)||0)),add:r.adicao==null?null:Number(r.adicao)};
    }
    function treatmentMatches(l,t) {
        if(t==='solar') return l.solar;
        if(l.solar) return false;
        if(t==='antirreflexo') return l.ar && !l.blue && !l.foto;
        if(t==='blue') return l.blue && !l.foto;
        if(t==='fotocromatica') return l.foto && !l.blue;
        if(t==='fotocromatica_blue') return l.foto && l.blue;
        return false;
    }
    function syncTreatmentOptions(visao) {
        $$('[data-treatment]').forEach(function (button) {
            var treatment = button.dataset.treatment;
            var available = LENTES.some(function (lens) {
                return !lens.semgrau && lens.visao === visao && treatmentMatches(lens, treatment);
            });
            button.style.display = available ? 'flex' : 'none';
            button.disabled = !available;
        });
    }
    function fits(l,visao,g) {
        if(l.semgrau || l.visao!==visao || !state.receita) return false;
        var r=state.receita;
        return [r.odEsf,r.oeEsf].every(function(v){return Number.isFinite(v)&&v>=l.neg&&v<=l.pos;}) &&
          [r.odCil,r.oeCil].every(function(v){return Number.isFinite(v)&&v<=0&&v>=-l.cil;});
    }
    function recommend() {
        if(state.visao==='descanso') return {lente:LENTES.filter(function(l){return l.semgrau;})[0],outras:[],porque:'Lente sem correção visual, com filtro de luz azul.'};
        var g=degree(state.receita);
        var within=LENTES.filter(function(l){return fits(l,state.visao,g);}).sort(function(a,b){return a.preco-b.preco;});
        if(!within.length) return {fora:'grau'};
        var requested=within.filter(function(l){return treatmentMatches(l,state.trat);});
        if(!requested.length) return {fora:'tratamento'};
        var lens=requested[0];
        var why=state.trat==='solar'?'Lente solar já com o seu grau. Escolha abaixo a tonalidade que prefere.':'Seu grau está dentro da faixa desta lente e o tratamento corresponde ao que você escolheu.';
        return {lente:lens,outras:[],porque:why,temAstig:g.cil>0};
    }

    var css = document.createElement('style');
    css.id='pls-lens-style';
    css.textContent='\
.pls-lens-btn{width:100%;margin-top:10px;padding:14px 16px;border:1px solid #111;background:#111;color:#fff;font:700 11px/1.2 "Work Sans",Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;box-sizing:border-box;transition:opacity .2s}.pls-lens-btn:hover{opacity:.86}\
.pls-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(240,238,235,.96);display:none;align-items:center;justify-content:center;box-sizing:border-box;font-family:inherit}.pls-overlay *{box-sizing:border-box}\
.pls-card{width:440px;max-width:92vw;max-height:96vh;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.18);color:#1a1a1a;position:relative;display:flex;flex-direction:column;animation:pls-in .35s cubic-bezier(.22,1,.36,1)}@keyframes pls-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\
.pls-head{padding:28px 28px 22px;border-bottom:1px solid #dedede;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;flex-shrink:0}.pls-head b{display:block;font-size:22px;line-height:1;font-weight:400;letter-spacing:4px;text-transform:uppercase}.pls-head img{height:52px;width:auto;max-width:150px;object-fit:contain;filter:brightness(0)}\
.pls-close{position:absolute;right:17px;top:15px;border:0;background:none;color:#999;font-size:24px;font-weight:300;line-height:1;cursor:pointer;z-index:2;padding:4px 6px}.pls-close:hover{color:#111}\
.pls-body{padding:26px 28px 30px;overflow:auto;max-height:calc(96vh - 104px);box-sizing:border-box}.pls-body::-webkit-scrollbar{width:3px}.pls-body::-webkit-scrollbar-thumb{background:#dedede}\
.pls-step{display:none}.pls-step.on{display:block}.pls-progress{display:flex;gap:5px;margin-bottom:20px}.pls-progress i{height:3px;flex:1;background:#dedede;border-radius:2px}.pls-progress i.on{background:#111}.pls-progress i.on:not(:last-child){opacity:.65}\
.pls-label{display:block;font-size:16px;font-weight:400;letter-spacing:3px;line-height:1.35;text-transform:uppercase;text-align:center;margin:0 0 14px}\
.pls-opt{width:100%;text-align:left;background:#fff;border:1.5px solid #dedede;border-radius:14px;padding:15px 16px;margin:0 0 10px;cursor:pointer;color:#1a1a1a;font-family:inherit;display:flex;flex-direction:column;gap:3px;transition:border-color .18s,background .18s}.pls-opt:hover{border-color:#111;background:#f6f6f4}.pls-opt b{display:block;font-size:14px;font-weight:600}.pls-opt small{display:block;color:#777;font-size:11.5px;margin:0;line-height:1.45}.pls-back{display:block;border:0;background:none;text-decoration:underline;color:#888;font:11.5px/1.4 inherit;margin:12px auto 0;cursor:pointer}.pls-back:hover{color:#111}\
.pls-note{font-size:11.5px;line-height:1.5;color:#777;background:#f6f6f4;border-radius:6px;padding:11px 14px;margin:0 0 16px}.pls-field{margin-bottom:11px}.pls-field label{font-size:9.5px;color:#777;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:5px}.pls-field input,.pls-field select{display:block;width:100%;height:46px;border:1.5px solid #dedede;border-radius:9px;padding:0 11px;background:#fff;color:#1a1a1a;font:13px inherit;outline:none}.pls-field input:focus,.pls-field select:focus{border-color:#111;background:#fff}.pls-field input::placeholder{color:#aaa}\
.pls-eyes{display:block}.pls-eye{border:1.5px solid #dedede;border-radius:13px;padding:12px 13px;margin-bottom:11px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.pls-eye>strong{display:block;grid-column:1/-1;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:#777;margin-bottom:1px}.pls-eye .pls-field{margin:0}.pls-eye .pls-field select{height:38px;padding:0 6px;font-size:12.5px}\
.pls-primary,.pls-secondary{width:100%;height:52px;border-radius:14px;padding:0 14px;font-family:inherit;font-size:13px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;box-sizing:border-box}.pls-primary{border:0;background:#111;color:#fff;font-weight:600;margin-top:8px}.pls-primary:hover{opacity:.88}.pls-primary[disabled],.pls-secondary[disabled]{opacity:.65;cursor:default}.pls-secondary{border:1.5px solid #dedede;background:transparent;color:#111;font-weight:500;margin-top:9px}.pls-secondary:hover{border-color:#111;background:#f6f6f4}\
.pls-error{display:none;color:#9b2c2c;background:#fff5f5;border:1px solid #fbc4c4;padding:11px 13px;border-radius:11px;font-size:11.5px;line-height:1.5;margin:10px 0}.pls-phone-error{font-size:11px;color:#a22;display:none;margin-top:6px}.pls-loading{text-align:center;padding:35px 0;color:#777}.pls-loading>b{display:block}.pls-loading .pls-note{margin:16px 0 0}.pls-spinner{width:26px;height:26px;border:2.5px solid #dedede;border-top-color:#111;border-radius:50%;animation:plcspin .8s linear infinite;margin:0 auto 12px}@keyframes plcspin{to{transform:rotate(360deg)}}\
.pls-result{border:2px solid #111;border-radius:14px;padding:17px;margin-bottom:12px}.pls-result img{display:block;width:190px;max-width:100%;margin:0 auto 13px;border-radius:10px;background:#f6f6f4}.pls-result h3{font-size:14px;font-weight:600;line-height:1.35;margin:0 0 3px}.pls-result>small{font-size:11px;color:#777}.pls-price{font-size:27px;font-weight:700;margin:11px 0}.pls-why{font-size:12px;line-height:1.5;background:#f6f6f4;padding:11px 12px;border-radius:10px}.pls-result .pls-note{margin:11px 0 0;border:1px solid #dedede}.pls-result .pls-field{display:none!important}.pls-alt-title{font-size:12px;font-weight:700;margin:17px 0 8px}.pls-alt{display:flex;flex-direction:row;gap:12px;align-items:center}.pls-alt img{width:52px;height:52px;object-fit:cover;border-radius:9px;background:#f6f6f4}.pls-alt span{min-width:0}\
@media(max-width:767px){.pls-overlay{align-items:flex-start;justify-content:center;overflow-y:auto}.pls-card{width:100%;max-width:none;max-height:none;min-height:100svh;border-radius:0;box-shadow:none}.pls-body{max-height:none;flex:1}.pls-head{padding-top:26px}}@media(max-width:390px){.pls-body{padding:24px 20px 28px}.pls-head{padding-left:20px;padding-right:20px}.pls-head b{font-size:19px;letter-spacing:3px}}';
    document.head.appendChild(css);

    var overlay=document.createElement('div');
    overlay.id='pls-lens-modal';overlay.className='pls-overlay';
    overlay.innerHTML='<div class="pls-card" role="dialog" aria-modal="true" aria-label="Escolher lentes"><button class="pls-close" type="button" aria-label="Fechar">&times;</button><div class="pls-head"><b>Escolher lentes</b><span style="font-size:30px;letter-spacing:7px;line-height:52px">SANTI</span></div><div class="pls-body">'+
      '<section class="pls-step" data-step="contact"><div class="pls-progress"><i class="on"></i><i></i><i></i><i></i></div><span class="pls-label">Qual é o seu WhatsApp?</span><div class="pls-note">Prévia local: use um número fictício. Nenhum dado será enviado.</div><div class="pls-field"><label>WhatsApp com DDD</label><input id="pls-phone" type="tel" inputmode="numeric" maxlength="15" placeholder="(11) 99999-9999"><div class="pls-phone-error" id="pls-phone-error">Informe um celular válido com DDD.</div></div><button class="pls-primary" id="pls-contact-next">Continuar</button></section>'+
      '<section class="pls-step" data-step="vision"><div class="pls-progress"><i class="on"></i><i></i><i></i><i></i></div><span class="pls-label">Como você usa seus óculos?</span><button class="pls-opt" data-vision="simples"><b>Visão simples</b><small>Para miopia, hipermetropia ou astigmatismo</small></button><button class="pls-opt" data-vision="descanso"><b>Sem grau</b><small>Filtro de luz azul · R$ 120,00</small></button></section>'+
      '<section class="pls-step" data-step="treatment"><div class="pls-progress"><i class="on"></i><i class="on"></i><i></i><i></i></div><span class="pls-label">Qual tratamento você prefere?</span><button class="pls-opt" data-treatment="antirreflexo"><b>Antirreflexo</b><small>Conforto para o dia a dia</small></button><button class="pls-opt" data-treatment="blue"><b>Antirreflexo BLUE UV · Kodak</b><small>Para quem passa bastante tempo em telas</small></button><button class="pls-opt" data-treatment="fotocromatica"><b>Fotossensível</b><small>Escurece no sol e clareia em ambientes internos</small></button><button class="pls-opt" data-treatment="fotocromatica_blue"><b>Transitions BLUE UV · Kodak</b><small>Proteção no sol e durante o uso de telas</small></button><button class="pls-opt" data-treatment="solar"><b>Solar com grau</b><small>Escolha entre cinco tonalidades</small></button><button class="pls-back" data-go="vision">voltar</button></section>'+
      '<section class="pls-step" data-step="recipe"><div class="pls-progress"><i class="on"></i><i class="on"></i><i class="on"></i><i></i></div><span class="pls-label">Como quer informar sua receita?</span><input type="file" id="pls-file" accept="image/*,application/pdf" hidden><button class="pls-opt" id="pls-upload"><b>Enviar uma foto ou PDF</b><small>Na prévia, selecione o arquivo e preencha os dados manualmente</small></button><button class="pls-opt" data-manual="1"><b>Digitar os dados</b><small>Preencha exatamente como está na receita</small></button><button class="pls-opt" data-no-recipe="1"><b>Não tenho receita</b><small>Fale com a equipe da Santi pelo WhatsApp</small></button><div class="pls-error" id="pls-file-error"></div><button class="pls-back" data-go="treatment">voltar</button></section>'+
      '<section class="pls-step" data-step="loading"><div class="pls-loading"><div class="pls-spinner"></div><b>Lendo sua receita…</b><div class="pls-note">Confira os números antes de continuar.</div></div></section>'+
      '<section class="pls-step" data-step="form"><div class="pls-progress"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div><span class="pls-label">Confira sua receita</span><div class="pls-note" id="pls-read-note" style="display:none"></div><div class="pls-eyes"><div class="pls-eye"><strong>Olho direito (OD)</strong><div class="pls-field"><label>Esférico</label><select data-r="odEsf"></select></div><div class="pls-field"><label>Cilíndrico</label><select data-r="odCil"></select></div><div class="pls-field"><label>Eixo</label><select data-r="odEixo"></select></div></div><div class="pls-eye"><strong>Olho esquerdo (OE)</strong><div class="pls-field"><label>Esférico</label><select data-r="oeEsf"></select></div><div class="pls-field"><label>Cilíndrico</label><select data-r="oeCil"></select></div><div class="pls-field"><label>Eixo</label><select data-r="oeEixo"></select></div></div></div><div class="pls-field" id="pls-add-wrap" style="display:none"><label>Adição (grau de perto)</label><select data-r="adicao"></select></div><div class="pls-error" id="pls-form-error"></div><button class="pls-primary" id="pls-recommend">Ver minha lente</button><button class="pls-back" data-go="recipe">voltar</button></section>'+
      '<section class="pls-step" data-step="result"><div class="pls-progress"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></div><span class="pls-label">Sua lente indicada</span><div class="pls-result" id="pls-result"></div><div id="pls-alternatives"></div><button class="pls-primary" id="pls-buy-both">Comprar armação + lente</button><button class="pls-secondary" id="pls-buy-frame">Comprar somente a armação</button><button class="pls-back" data-go="form">revisar receita</button></section>'+
      '<section class="pls-step" data-step="cart"></section></div></div>';
    document.body.appendChild(overlay);

    function show(name){$$('.pls-step').forEach(function(s){s.classList.toggle('on',s.dataset.step===name);});var body=$('.pls-body');if(body)body.scrollTop=0;}
    function open(){overlay.style.display='flex';document.documentElement.style.overflow='hidden';state={visao:null,trat:null,receita:null,lente:null,last:'abriu'};var saved='';try{saved=localStorage.getItem('pl_last_phone')||'';}catch(_){}$('#pls-phone').value=maskPhone(saved.replace(/\D/g,''));show('contact');track('abriu',{origem:'botao_produto',escopo:'catalogo'});track('pediu_telefone',{});}
    function close(){overlay.style.display='none';document.documentElement.style.overflow='';if(state.last&&!/carrinho|so_armacao/.test(state.last))track('saiu',{ultimo_step:state.last});}
    $('.pls-close').addEventListener('click',close);overlay.addEventListener('click',function(e){if(e.target===overlay)close();});

    function range(from,to,step){var out='<option value="">—</option>';for(var v=from;v<=to+.001;v+=step){var n=v.toFixed(2);out+='<option value="'+n+'">'+(v>0?'+':'')+n.replace('.',',')+'</option>';}return out;}
    $$('[data-r$="Esf"]').forEach(function(s){s.innerHTML=range(-12,7,.25);});
    $$('[data-r$="Cil"]').forEach(function(s){s.innerHTML=range(-6,0,.25);s.value='0.00';});
    $$('[data-r$="Eixo"]').forEach(function(s){var out='<option value="">—</option>';for(var i=0;i<=180;i++)out+='<option value="'+i+'">'+i+'°</option>';s.innerHTML=out;});
    $('[data-r="adicao"]').innerHTML=range(.75,3.5,.25);

    function getVal(k){var el=$('[data-r="'+k+'"]');return el&&el.value!==''?Number(el.value):null;}
    function readForm(){var r={odEsf:getVal('odEsf'),odCil:getVal('odCil')||0,odEixo:getVal('odEixo'),oeEsf:getVal('oeEsf'),oeCil:getVal('oeCil')||0,oeEixo:getVal('oeEixo')};if(r.odEsf==null||r.oeEsf==null)return null;if(state.visao==='multifocal'){r.adicao=getVal('adicao');if(r.adicao==null)return null;}return r;}
    function nearest(k,value){if(value==null)return;var s=$('[data-r="'+k+'"]');if(!s)return;var best='',diff=Infinity;[].slice.call(s.options).forEach(function(o){if(o.value==='')return;var d=Math.abs(Number(o.value)-Number(value));if(d<diff){diff=d;best=o.value;}});s.value=best;}
    function maskPhone(v){var d=v.replace(/\D/g,'').slice(0,11);if(d.length<=2)return d?'('+d:'';var cut=d.length===11?7:6;return '('+d.slice(0,2)+') '+d.slice(2,cut)+(d.length>cut?'-'+d.slice(cut):'');}
    $('#pls-phone').addEventListener('input',function(){this.value=maskPhone(this.value);$('#pls-phone-error').style.display='none';});
    $('#pls-phone').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('#pls-contact-next').click();}});
    $('#pls-contact-next').addEventListener('click',function(){if(!validPhone())return;track('telefone',{origem:'fluxo_lentes'});show('vision');});

    function goForm(note){$('#pls-add-wrap').style.display=state.visao==='multifocal'?'block':'none';$('#pls-read-note').style.display=note?'block':'none';$('#pls-read-note').innerHTML=note||'';show('form');}
    function readPrescription(file){
      if(!file || (!/^(image\/|application\/pdf$)/.test(file.type))){goForm('Escolha uma imagem ou PDF, ou digite os dados abaixo.');return;}
      $$('[data-r]').forEach(function(s){s.value=/Cil$/.test(s.dataset.r)?'0.00':'';});
      goForm('Arquivo selecionado apenas neste navegador. A leitura automática está desligada nesta prévia. <strong>Digite os dados para testar a indicação.</strong>');
    }

    function renderRecommendation(rec){var box=$('#pls-result'),alts=$('#pls-alternatives'),back=$('[data-step="result"] .pls-back');alts.innerHTML='';back.dataset.go=state.visao==='descanso'?'vision':'form';back.textContent=state.visao==='descanso'?'alterar necessidade':'revisar receita';if(!rec||rec.fora){state.lente=null;box.innerHTML='<h3>Esta lente precisa ser feita sob medida</h3><div class="pls-why">Seu grau ou tratamento não está disponível como produto pronto. A equipe da Santi precisa conferir sua receita antes de indicar uma lente.</div>';$('#pls-buy-both').textContent='Falar com a Santi';}else{var pool=[rec.lente].concat(rec.outras||[]);state.lente=rec.lente;box.innerHTML=(rec.lente.img?'<img src="'+rec.lente.img+'" alt="">':'')+'<h3>'+esc(rec.lente.nome)+'</h3><small>'+esc(rec.lente.material)+'</small><div class="pls-price">'+brl(rec.lente.preco)+'</div><div class="pls-why">'+esc(rec.porque)+'</div><div class="pls-note">Indicação conforme as faixas da Santi. Confira os dados da receita.</div>';$('#pls-buy-both').textContent='Comprar armação + lente';var outras=pool.filter(function(l){return l.id!==state.lente.id;});if(outras.length){alts.innerHTML='<div class="pls-alt-title">Outras opções do mesmo tratamento</div>'+outras.map(function(l){return '<button class="pls-opt pls-alt" data-lens="'+l.id+'"><img src="'+l.img+'" alt=""><span><b>'+esc(l.nome)+'</b><small>'+brl(l.preco)+'</small></span></button>';}).join('');$$('[data-lens]').forEach(function(b){b.addEventListener('click',function(){var l=pool.find(function(x){return x.id===b.dataset.lens;});if(l){renderRecommendation({lente:l,outras:pool.filter(function(x){return x.id!==l.id;}),porque:rec.porque});track('alternativa',{lente:l.nome,preco:l.preco});}});});}}if(state.visao==='descanso'){box.insertAdjacentHTML('beforeend','<div class="pls-field" style="margin-top:14px"><label>WhatsApp para receber ajuda, se necessário</label><input id="pls-phone-result" type="tel" inputmode="numeric" maxlength="15" placeholder="(11) 99999-9999"><div class="pls-phone-error" id="pls-phone-result-error">Informe um celular válido com DDD.</div></div>');var rp=$('#pls-phone-result'),saved='';try{saved=localStorage.getItem('pl_last_phone')||'';}catch(_){}rp.value=maskPhone(saved);rp.addEventListener('input',function(){this.value=maskPhone(this.value);$('#pls-phone-result-error').style.display='none';});}show('result');track('recomendou',{lente:state.lente?state.lente.nome:null,preco:state.lente?state.lente.preco:null,fora:rec&&rec.fora||null,visao:state.visao,trat:state.trat,grau:state.receita});}

    function getProductForm(){var f=document.querySelector('#product_form');return f&&f.querySelector('[name="add_to_cart"]')?f:null;}
    function buyFrame(){showCart(false);}
    function validPhone(){var tel=phone(),err=$('#pls-phone-result-error')||$('#pls-phone-error');if(!/^\d{10,11}$/.test(tel)||!/^[1-9]{2}/.test(tel)||(tel.length===11&&tel.charAt(2)!=='9')){if(err)err.style.display='block';return false;}try{localStorage.setItem('pl_last_phone',tel);}catch(_){}return true;}
    function lockButton(btn){if(btn.disabled)return false;btn.disabled=true;btn.textContent='Adicionando…';setTimeout(function(){btn.disabled=false;btn.textContent='Tentar novamente';},12000);return true;}
    function showCart(withLens){
      var panel=$('[data-step="cart"]');
      panel.innerHTML='<span class="pls-label">Carrinho de demonstração</span><div class="pls-result"><h3>Sua armação Santi</h3>'+(withLens&&state.lente?'<p>'+esc(state.lente.nome)+'</p><div class="pls-price">Lentes: '+brl(state.lente.preco)+'</div>':'<p>Somente a armação.</p>')+'</div><div class="pls-note">Nenhum produto foi adicionado à loja. O preço da armação será somado ao das lentes na integração.</div><button class="pls-secondary" data-go="result">Voltar à indicação</button>';
      show('cart');
    }
    function buyBoth(btn){if(!validPhone())return;if(!state.lente){goForm('Na loja, esta opção encaminhará para a equipe da Santi. Nenhuma mensagem foi enviada nesta prévia.');return;}showCart(true);}

    overlay.addEventListener('click',function(e){var t=e.target.closest('[data-go],[data-vision],[data-treatment],[data-manual],[data-no-recipe]');if(!t)return;e.preventDefault();if(t.dataset.go){show(t.dataset.go);return;}if(t.dataset.vision){state.visao=t.dataset.vision;track('visao',{visao:state.visao});if(state.visao==='descanso'){state.trat='blue';state.receita=null;renderRecommendation(recommend());}else{syncTreatmentOptions(state.visao);show('treatment');}return;}if(t.dataset.treatment){state.trat=t.dataset.treatment;track('tratamento',{visao:state.visao,trat:state.trat});show('recipe');return;}if(t.dataset.manual){track('receita_metodo',{metodo:'digitar'});goForm('');return;}if(t.dataset.noRecipe){track('sem_receita_whatsapp',{visao:state.visao,trat:state.trat});goForm('Na loja, esta opção abrirá o contato da Santi. Nesta prévia, você pode preencher uma receita fictícia para testar.');return;}});
    $('#pls-upload').addEventListener('click',function(){track('receita_metodo',{metodo:'enviar'});$('#pls-file').click();});
    $('#pls-file').addEventListener('change',function(){var f=this.files&&this.files[0];if(f)readPrescription(f);});
    $('#pls-recommend').addEventListener('click',function(){var r=readForm(),err=$('#pls-form-error');if(!r){err.textContent='Preencha o grau esférico dos dois olhos'+(state.visao==='multifocal'?' e a adição.':'.');err.style.display='block';return;}var tel=phone();if(!/^\d{10,11}$/.test(tel)||!/^[1-9]{2}/.test(tel)||(tel.length===11&&tel.charAt(2)!=='9')){$('#pls-phone-error').style.display='block';return;}err.style.display='none';state.receita=r;try{localStorage.setItem('pl_last_phone',tel);}catch(_){}renderRecommendation(recommend());});
    $('#pls-buy-both').addEventListener('click',function(){buyBoth(this);});
    $('#pls-buy-frame').addEventListener('click',function(){if(!validPhone())return;track('so_armacao',{visao:state.visao});buyFrame();});

    function insertButtons(){var form=getProductForm(),buy=form&&form.querySelector('.js-addtocart,.btn-add-to-cart,[data-component="product.add-to-cart"]');if(!buy||form.querySelector('.pls-lens-btn'))return !!buy;var b=document.createElement('button');b.type='button';b.className='pls-lens-btn';b.textContent='Escolher lentes e comprar';b.addEventListener('click',function(e){e.preventDefault();open();});buy.parentNode.insertBefore(b,buy.nextSibling);return true;}
    window.SantiLentes={open:open};
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&overlay.style.display==='flex')close();});
    if(!insertButtons()){var attempts=0,timer=setInterval(function(){if(insertButtons()||++attempts>30)clearInterval(timer);},300);}
})();
