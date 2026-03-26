/* ============================================================
   data.js  -  Ari-Haara shared data engine
   ============================================================ */
function ahLoad(k,def){try{var v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch(e){return def;}}
function ahSave(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){alert("Erreur de sauvegarde: stockage plein. Essayez avec moins de photos.");return false;}}
function ahSession(k,def){try{var v=sessionStorage.getItem(k);return v?JSON.parse(v):def;}catch(e){return def;}}
function ahSaveSession(k,v){try{sessionStorage.setItem(k,JSON.stringify(v));}catch(e){}}

var DEFAULT_FOUNDERS=[
  {id:"fn1",name:"Membre Fondateur 1",role:"Co-Fondateur",bio:"A completer par l administrateur.",photo:""},
  {id:"fn2",name:"Membre Fondateur 2",role:"Co-Fondateur",bio:"A completer par l administrateur.",photo:""},
  {id:"fn3",name:"Membre Fondateur 3",role:"Co-Fondateur",bio:"A completer par l administrateur.",photo:""},
  {id:"fn4",name:"Membre Fondateur 4",role:"Co-Fondateur",bio:"A completer par l administrateur.",photo:""},
  {id:"fn5",name:"Membre Fondateur 5",role:"Co-Fondateur",bio:"A completer par l administrateur.",photo:""},
  {id:"fn6",name:"Membre Fondateur 6",role:"Co-Fondateur",bio:"A completer par l administrateur.",photo:""}
];

function getFounders(){var s=ahLoad("ah_founders",null);return s!==null?s:DEFAULT_FOUNDERS;}
function saveFounders(v){ahSave("ah_founders",v);}
function getMembers(){return ahLoad("ah_members",[]);}
function saveMembers(v){ahSave("ah_members",v);}
function getActs(){return ahLoad("ah_acts",[]);}
function saveActs(v){return ahSave("ah_acts",v);}
function getFunds(){return ahLoad("ah_funds",[]);}
function saveFunds(v){return ahSave("ah_funds",v);}
function getContribs(){return ahLoad("ah_contribs",[]);}
function saveContribs(v){ahSave("ah_contribs",v);}
function getSlidesRemoved(){return ahLoad("ah_slides_rm",[]);}
function getSlidesExtra(){return ahLoad("ah_slides_ex",[]);}
function saveSlidesRemoved(v){ahSave("ah_slides_rm",v);}
function saveSlidesExtra(v){ahSave("ah_slides_ex",v);}

/* SESSION */
var ADMIN_PASS="arihaara2024";
var _isAdmin=false;
function curMember(){return ahSession("ah_cur_member",null);}
function setCurMember(m){ahSaveSession("ah_cur_member",m);}
function logout(){sessionStorage.removeItem("ah_cur_member");}

/* OVERLAY */
function openOv(id){document.getElementById(id).classList.add("open");}
function closeOv(id){document.getElementById(id).classList.remove("open");}
window.addEventListener("scroll",function(){var n=document.getElementById("main-nav");if(n)n.classList.toggle("scrolled",window.scrollY>40);});
window.addEventListener("click",function(e){if(e.target&&e.target.classList&&e.target.classList.contains("overlay"))e.target.classList.remove("open");});

/* ADMIN AUTH */
function openLoginOrPanel(){if(_isAdmin){openAdminPanel();}else{openAdminLogin();}}
function openAdminLogin(){
  var inp=document.getElementById("pw-input");var err=document.getElementById("pw-err");
  if(inp)inp.value="";if(err)err.style.display="none";
  openOv("ov-admin-login");
  setTimeout(function(){if(inp)inp.focus();},120);
}
function doAdminLogin(){
  var inp=document.getElementById("pw-input");var err=document.getElementById("pw-err");
  if(inp&&inp.value===ADMIN_PASS){
    _isAdmin=true;closeOv("ov-admin-login");
    var fab=document.getElementById("admin-fab");if(fab)fab.style.display="block";
    var btn=document.getElementById("admin-nav-btn");if(btn)btn.classList.add("logged");
    openAdminPanel();
  }else{if(err)err.style.display="block";}
}
function doAdminLogout(){
  _isAdmin=false;
  var fab=document.getElementById("admin-fab");if(fab)fab.style.display="none";
  var btn=document.getElementById("admin-nav-btn");if(btn)btn.classList.remove("logged");
  closeOv("ov-admin");
}

/* TAB SWITCHER */
function swTab(n){
  var tabs=document.querySelectorAll(".tab");var panels=document.querySelectorAll(".tpanel");
  for(var i=0;i<tabs.length;i++)tabs[i].classList.remove("active");
  for(var i=0;i<panels.length;i++)panels[i].classList.remove("active");
  if(tabs[n])tabs[n].classList.add("active");
  var p=document.getElementById("tp-"+n);if(p)p.classList.add("active");
}

function setVal(id,val){var e=document.getElementById(id);if(e)e.value=val||"";}
function getVal(id){var e=document.getElementById(id);return e?e.value.trim():"";}

/* ── FOUNDERS ─────────────────────────────────────────── */
var _founderPhotoData="";
function openFounderForm(id){
  _founderPhotoData="";
  var founders=getFounders();var f=null;
  if(id){for(var i=0;i<founders.length;i++){if(founders[i].id===id){f=founders[i];break;}}}
  var t=document.getElementById("fn-modal-title");if(t)t.textContent=f?"Modifier Fondateur":"Nouveau Fondateur";
  setVal("fn-eid",f?f.id:"");setVal("fn-name",f?f.name:"");setVal("fn-role",f?f.role:"");setVal("fn-bio",f?f.bio:"");
  var prev=document.getElementById("fn-photo-preview");var wrap=document.getElementById("fn-photo-preview-wrap");
  if(f&&f.photo){if(prev)prev.src=f.photo;_founderPhotoData=f.photo;if(wrap)wrap.style.display="block";}
  else{if(prev)prev.src="";if(wrap)wrap.style.display="none";}
  openOv("ov-founder");
}
function handleFounderPhoto(input){
  var file=input.files[0];if(!file)return;
  var r=new FileReader();
  r.onload=function(e){
    _founderPhotoData=e.target.result;
    var prev=document.getElementById("fn-photo-preview");var wrap=document.getElementById("fn-photo-preview-wrap");
    if(prev){prev.src=_founderPhotoData;if(wrap)wrap.style.display="block";}
  };
  r.readAsDataURL(file);
}
function saveFounder(){
  var name=getVal("fn-name");if(!name){alert("Nom requis.");return;}
  var eid=getVal("fn-eid");
  var f={id:eid||("fn_"+Date.now()),name:name,role:getVal("fn-role"),bio:getVal("fn-bio"),photo:_founderPhotoData};
  var founders=getFounders();
  if(eid){var ok=false;for(var i=0;i<founders.length;i++){if(founders[i].id===eid){founders[i]=f;ok=true;break;}}if(!ok)founders.push(f);}
  else founders.push(f);
  saveFounders(founders);closeOv("ov-founder");
  if(typeof renderFounders==="function")renderFounders();
  renderAdminFounders();
}
function deleteFounder(id){
  if(!confirm("Supprimer?"))return;
  saveFounders(getFounders().filter(function(f){return f.id!==id;}));
  if(typeof renderFounders==="function")renderFounders();
  renderAdminFounders();
}
function renderAdminFounders(){
  var el=document.getElementById("founders-alist");if(!el)return;
  var founders=getFounders();
  if(!founders.length){el.innerHTML='<div style="padding:1rem;text-align:center;color:#ccc;font-size:.82rem">Aucun fondateur</div>';return;}
  var h="";
  for(var i=0;i<founders.length;i++){
    var f=founders[i];
    h+='<div class="arow">';
    if(f.photo)h+='<img class="athumb" src="'+f.photo+'"/>';
    h+='<div style="flex:1"><div class="arow-name">'+f.name+'</div><div class="arow-sub">'+f.role+'</div></div>';
    h+='<div><button class="btn-sm edit" onclick="openFounderForm(\''+f.id+'\')">Modifier</button>';
    h+='<button class="btn-sm del" onclick="deleteFounder(\''+f.id+'\')">Suppr.</button></div></div>';
  }
  el.innerHTML=h;
}

/* ── MEMBERS ADMIN ────────────────────────────────────── */
function renderAdminMembers(){
  var el=document.getElementById("members-alist");if(!el)return;
  var members=getMembers();
  if(!members.length){el.innerHTML='<div style="padding:1rem;text-align:center;color:#ccc;font-size:.82rem">Aucun membre inscrit</div>';return;}
  var h="";
  for(var i=0;i<members.length;i++){
    var m=members[i];
    h+='<div class="arow">';
    if(m.photo)h+='<img class="athumb" src="'+m.photo+'" onerror="this.style.display=\'none\'"/>';
    else h+='<div class="contrib-avatar-ph" style="width:38px;height:38px;margin-right:.7rem;font-size:.9rem;flex-shrink:0">'+m.name[0]+'</div>';
    h+='<div style="flex:1"><div class="arow-name">'+m.name+'</div>';
    h+='<span class="mem-badge '+(m.status==="approved"?"approved":"pending")+'">'+m.status+'</span></div>';
    h+='<div>';
    if(m.status==="pending")h+='<button class="btn-sm approve" onclick="approveMember(\''+m.id+'\')">&#10003; OK</button>';
    h+='<button class="btn-sm del" onclick="deleteMember(\''+m.id+'\')">Suppr.</button></div></div>';
  }
  el.innerHTML=h;
}
function approveMember(id){
  var m=getMembers();for(var i=0;i<m.length;i++){if(m[i].id===id){m[i].status="approved";break;}}
  saveMembers(m);renderAdminMembers();if(typeof renderAllMembers==="function")renderAllMembers();
}
function deleteMember(id){
  if(!confirm("Supprimer?"))return;
  saveMembers(getMembers().filter(function(m){return m.id!==id;}));
  renderAdminMembers();if(typeof renderAllMembers==="function")renderAllMembers();
}

/* ── ACTIVITIES (with multi-photo file upload) ──────────── */
var _actPhotos=[];  // array of base64 or URL strings

function renderActAlist(){
  var el=document.getElementById("act-alist");if(!el)return;
  var acts=getActs();
  if(!acts.length){el.innerHTML='<div style="padding:1rem;text-align:center;color:#ccc;font-size:.82rem">Aucune activite</div>';return;}
  var h="";
  for(var i=0;i<acts.length;i++){
    var a=acts[i];
    h+='<div class="arow"><div><div class="arow-name">'+a.name+'</div>';
    h+='<div class="arow-sub">'+(a.date||"")+(a.photos&&a.photos.length?' &bull; '+a.photos.length+' photo(s)':'')+'</div></div>';
    h+='<div><button class="btn-sm edit" onclick="openActForm(\''+a.id+'\')">Modifier</button>';
    h+='<button class="btn-sm del" onclick="delAct(\''+a.id+'\')">Suppr.</button></div></div>';
  }
  el.innerHTML=h;
}

function openActForm(actId){
  var acts=getActs();var act=null;
  if(actId){for(var i=0;i<acts.length;i++){if(acts[i].id===actId){act=acts[i];break;}}}
  _actPhotos=act&&act.photos?act.photos.slice():[];
  var t=document.getElementById("act-modal-title");if(t)t.textContent=act?"Modifier Activite":"Nouvelle Activite";
  setVal("act-eid",act?act.id:"");setVal("act-name",act?act.name:"");
  setVal("act-date",act?act.date:"");setVal("act-desc",act?act.desc:"");
  renderActPhotosPreview();
  openOv("ov-act");
}

function handleActPhotos(input){
  var files=input.files;if(!files||!files.length)return;
  var remaining=files.length;
  for(var i=0;i<files.length;i++){
    (function(file){
      var r=new FileReader();
      r.onload=function(e){
        _actPhotos.push(e.target.result);
        remaining--;
        if(remaining===0)renderActPhotosPreview();
      };
      r.readAsDataURL(file);
    })(files[i]);
  }
  /* reset so same files can be re-selected */
  input.value="";
}

function renderActPhotosPreview(){
  var el=document.getElementById("act-photos-row");if(!el)return;
  var h="";
  for(var i=0;i<_actPhotos.length;i++){
    h+='<div class="pthumb"><img src="'+_actPhotos[i]+'"/>';
    h+='<button class="pdel" onclick="rmActPhoto('+i+')">x</button></div>';
  }
  el.innerHTML=h||'<span style="font-size:.8rem;color:#bbb">Aucune photo</span>';
}

function rmActPhoto(i){_actPhotos.splice(i,1);renderActPhotosPreview();}

function delAct(id){
  if(!confirm("Supprimer?"))return;
  saveActs(getActs().filter(function(a){return a.id!==id;}));
  renderActAlist();if(typeof renderActs==="function")renderActs();
}

function saveAct(){
  var name=getVal("act-name");if(!name){alert("Nom requis.");return;}
  var eid=getVal("act-eid");
  var act={
    id:eid||("act_"+Date.now()),
    name:name,
    date:getVal("act-date"),
    desc:getVal("act-desc"),
    photos:_actPhotos.slice()
  };
  var acts=getActs();
  if(eid){var ok=false;for(var i=0;i<acts.length;i++){if(acts[i].id===eid){acts[i]=act;ok=true;break;}}if(!ok)acts.push(act);}
  else acts.push(act);
  var saved=saveActs(acts);
  if(!saved){return;}
  closeOv("ov-act");
  renderActAlist();
  if(typeof renderActs==="function")renderActs();
  /* reopen admin panel so user sees the updated list */
  openAdminPanel();
  /* switch to the tab that contains the activities list */
  var actEl=document.getElementById("act-alist");
  if(actEl){var p=actEl.closest(".tpanel");if(p&&p.id){var n=parseInt(p.id.replace("tp-",""));if(!isNaN(n))swTab(n);}}
}

/* ── SLIDES ───────────────────────────────────────────── */
function renderAdminSlides(){
  var el=document.getElementById("slides-thumbs");if(!el)return;
  var removed=getSlidesRemoved();var extra=getSlidesExtra();
  var imgs=document.querySelectorAll("#slide-images img");
  var all=[];
  for(var i=0;i<imgs.length;i++){var sid="base_"+i;if(removed.indexOf(sid)===-1)all.push({id:sid,src:imgs[i].src});}
  for(var j=0;j<extra.length;j++)all.push(extra[j]);
  var h="";
  for(var k=0;k<all.length;k++){h+='<div class="pthumb"><img src="'+all[k].src+'"/><button class="pdel" onclick="removeSlide(\''+all[k].id+'\')">x</button></div>';}
  el.innerHTML=h;
}
function addSlide(){
  var url=getVal("new-slide-url");if(!url)return;
  var ex=getSlidesExtra();ex.push({id:"ex_"+Date.now(),src:url});saveSlidesExtra(ex);
  setVal("new-slide-url","");renderAdminSlides();if(typeof buildSlides==="function")buildSlides();
}
function removeSlide(id){
  if(id.indexOf("base_")===0){var rm=getSlidesRemoved();if(rm.indexOf(id)===-1)rm.push(id);saveSlidesRemoved(rm);}
  else saveSlidesExtra(getSlidesExtra().filter(function(s){return s.id!==id;}));
  renderAdminSlides();if(typeof buildSlides==="function")buildSlides();
}

/* ── FUNDS (MRU) ──────────────────────────────────────── */
function renderAdminFunds(){
  var el=document.getElementById("funds-alist");if(!el)return;
  var funds=getFunds();
  if(!funds.length){el.innerHTML='<div style="padding:1rem;text-align:center;color:#ccc;font-size:.82rem">Aucun fonds</div>';return;}
  var h="";
  for(var i=0;i<funds.length;i++){
    var f=funds[i];
    h+='<div class="arow"><div><div class="arow-name">'+(f.icon||"")+" "+f.name+(f.type==="membership"?' <span style="font-size:.65rem;background:var(--cream-dark);color:var(--teal-dark);padding:1px 6px;border-radius:8px;margin-left:4px">Adhesion</span>':'')+'</div>';
    h+='<div class="arow-sub">Objectif: '+(f.goal||0)+' MRU</div></div>';
    h+='<div><button class="btn-sm del" onclick="deleteFund(\''+f.id+'\')">Suppr.</button></div></div>';
  }
  el.innerHTML=h;
}
function openFundForm(){
  setVal("fund-name","");setVal("fund-desc","");setVal("fund-goal","");setVal("fund-icon","");
  var typeEl=document.getElementById("fund-type");if(typeEl)typeEl.value="regular";
  openOv("ov-fund");
}
function saveFund(){
  var name=getVal("fund-name");
  if(!name){alert("Nom requis.");return;}
  var typeEl=document.getElementById("fund-type");
  var ftype=(typeEl&&typeEl.value)?typeEl.value:"regular";
  var icon=getVal("fund-icon")||"💰";
  var goal=parseInt(getVal("fund-goal"))||0;
  var desc=getVal("fund-desc");
  var f={id:"fund_"+Date.now(),name:name,desc:desc,icon:icon,goal:goal,type:ftype};
  var funds=getFunds();
  funds.push(f);
  try{
    localStorage.setItem("ah_funds",JSON.stringify(funds));
  }catch(e){
    alert("Erreur: stockage plein.");return;
  }
  setVal("fund-name","");setVal("fund-desc","");setVal("fund-goal","");setVal("fund-icon","");
  var typeEl2=document.getElementById("fund-type");if(typeEl2)typeEl2.value="regular";
  closeOv("ov-fund");closeOv("ov-admin");
  renderAdminFunds();
  if(typeof renderFunds==="function")renderFunds();
  if(typeof updateTotal==="function")updateTotal();
  if(typeof renderMembershipTrackers==="function")renderMembershipTrackers();
  showToast("Fonds cree avec succes !");
}
function deleteFund(id){
  if(!confirm("Supprimer ce fonds?"))return;
  saveFunds(getFunds().filter(function(f){return f.id!==id;}));
  renderAdminFunds();if(typeof renderFunds==="function")renderFunds();
}

/* ── CONTRIBUTIONS ADMIN ──────────────────────────────── */
function renderAdminContribs(){
  var el=document.getElementById("contribs-alist");if(!el)return;
  var pending=getContribs().filter(function(c){return c.status==="pending";});
  if(!pending.length){el.innerHTML='<div style="padding:1rem;text-align:center;color:#ccc;font-size:.82rem">Aucune contribution en attente</div>';return;}
  var h="";
  for(var i=0;i<pending.length;i++){
    var c=pending[i];
    h+='<div class="arow" style="flex-wrap:wrap;gap:.5rem">';
    h+='<div style="flex:1;min-width:140px"><div class="arow-name">'+c.memberName+'</div>';
    h+='<div class="arow-sub">'+c.fundName+' &bull; '+c.date+'</div></div>';
    h+='<div style="display:flex;align-items:center;gap:.4rem">';
    h+='<input type="number" id="amt-'+c.id+'" value="'+c.amount+'" min="1" style="width:90px;padding:4px 6px;border:1px solid #ddd;border-radius:3px;font-size:.82rem;text-align:right"/>';
    h+='<span style="font-size:.75rem;color:#999">MRU</span></div>';
    if(c.proof)h+='<img class="proof-thumb" src="'+c.proof+'" onclick="showProof(\''+c.id+'\')" style="margin-right:.3rem"/>';
    h+='<div style="display:flex;gap:.3rem">';
    h+='<button class="btn-sm approve" onclick="approveContrib(\''+c.id+'\')">&#10003; Approuver</button>';
    h+='<button class="btn-sm del" onclick="rejectContrib(\''+c.id+'\')">&#10007;</button></div></div>';
  }
  el.innerHTML=h;
}
function approveContrib(id){
  var c=getContribs();
  for(var i=0;i<c.length;i++){
    if(c[i].id===id){
      /* allow admin to modify amount */
      var amtEl=document.getElementById("amt-"+id);
      if(amtEl){var newAmt=parseInt(amtEl.value);if(newAmt>0)c[i].amount=newAmt;}
      c[i].status="approved";break;
    }
  }
  saveContribs(c);renderAdminContribs();
  if(typeof renderFunds==="function")renderFunds();
  if(typeof renderAllContribs==="function")renderAllContribs();
  if(typeof renderMyContribs==="function")renderMyContribs();
  if(typeof updateTotal==="function")updateTotal();
}
function rejectContrib(id){
  if(!confirm("Rejeter?"))return;
  saveContribs(getContribs().filter(function(c){return c.id!==id;}));
  renderAdminContribs();
}
function showProof(id){
  var c=getContribs();for(var i=0;i<c.length;i++){if(c[i].id===id&&c[i].proof){var el=document.getElementById("proof-img");if(el){el.src=c[i].proof;openOv("ov-proof");}return;}}
}

/* ── CSV EXPORT ───────────────────────────────────────── */
function exportContribsCSV(){
  var contribs=getContribs().filter(function(c){return c.status==="approved";});
  if(!contribs.length){alert("Aucune contribution approuvee a exporter.");return;}
  var funds=getFunds();
  var fundMap={};
  for(var i=0;i<funds.length;i++)fundMap[funds[i].id]=funds[i].name;
  /* group by fund */
  var rows=[];
  rows.push(["Membre","Fonds / Type de contribution","Montant (MRU)","Date","Statut"]);
  for(var j=0;j<contribs.length;j++){
    var c=contribs[j];
    rows.push([
      '"'+c.memberName.replace(/"/g,'""')+'"',
      '"'+(c.fundName||fundMap[c.fundId]||"").replace(/"/g,'""')+'"',
      c.amount,
      '"'+c.date+'"',
      c.status==="approved"?"Approuvee":"En attente"
    ]);
  }
  var csv="\uFEFF";/* BOM for Excel */
  for(var k=0;k<rows.length;k++)csv+=rows[k].join(";")+"\r\n";
  var blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  var url=URL.createObjectURL(blob);
  var a=document.createElement("a");
  a.href=url;a.download="contributions_arihaara.csv";
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── TOAST NOTIFICATIONS ── */
function showToast(msg,type){
  var t=document.createElement("div");t.className="toast "+(type||"success");
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(function(){t.classList.add("show");},50);
  setTimeout(function(){t.classList.remove("show");setTimeout(function(){t.remove();},400);},3000);
}

/* ── OPEN ADMIN PANEL ─────────────────────────────────── */
function openAdminPanel(){
  renderAdminFounders();renderAdminMembers();renderActAlist();
  renderAdminFunds();renderAdminContribs();renderAdminSlides();
  swTab(0);openOv("ov-admin");
}
