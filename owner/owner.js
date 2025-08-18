
    const LS_KEYS = {inventory:'trazy_inventory_demo_v1', orders:'trazy_orders_demo_v1', history:'trazy_history_demo_v1'};

    const seedInventory = [
      {id: genId(), name:'Veg Puffs', price:20, qty:50, desc:'Crispy veg puffs with chutney', image:'', available:true},
      {id: genId(), name:'Filter Coffee', price:25, qty:200, desc:'Strong south Indian filter coffee', image:'', available:true},
      {id: genId(), name:'Masala Dosa', price:60, qty:30, desc:'Crispy dosa with sambar', image:'', available:true}
    ];

    const seedOrders = [
      {id: genId(), customer:'Arun K', roll:'21CS045', items:[{name:'Veg Puffs',qty:2},{name:'Filter Coffee',qty:1}], time:Date.now()-60000, status:'Pending'},
      {id: genId(), customer:'Priya S', roll:'20CE102', items:[{name:'Masala Dosa',qty:1}], time:Date.now()-180000, status:'Preparing'}
    ];

    let inventory = load(LS_KEYS.inventory) || seedInventory;
    let orders = load(LS_KEYS.orders) || seedOrders;
    let history = load(LS_KEYS.history) || [];


    const inventoryList = document.getElementById('inventoryList');
    const ordersList = document.getElementById('ordersList');
    const historyList = document.getElementById('historyList');
    const addItemBtn = document.getElementById('addItemBtn');
    const itemModalBackdrop = document.getElementById('itemModalBackdrop');
    const itemForm = document.getElementById('itemForm');
    const modalTitle = document.getElementById('modalTitle');
    const itemName = document.getElementById('itemName');
    const itemPrice = document.getElementById('itemPrice');
    const itemDesc = document.getElementById('itemDesc');
    const itemQty = document.getElementById('itemQty');
    const itemImage = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');
    const cancelItem = document.getElementById('cancelItem');
    const confirmDeleteBackdrop = document.getElementById('confirmDeleteBackdrop');
    const confirmDelete = document.getElementById('confirmDelete');
    const cancelDelete = document.getElementById('cancelDelete');
    const searchInventory = document.getElementById('searchInventory');
    const simulateOrderBtn = document.getElementById('simulateOrder');
    const liveCount = document.getElementById('liveCount');
    const histCount = document.getElementById('histCount');

    let editingId = null;
    let toDeleteId = null;

    renderAll();
    bindUI();

    function bindUI(){
      addItemBtn.addEventListener('click', ()=>openAddModal());
      cancelItem.addEventListener('click', closeItemModal);
      itemForm.addEventListener('submit', onSaveItem);
      itemImage.addEventListener('change', onImageSelect);
      cancelDelete.addEventListener('click', ()=>confirmDeleteBackdrop.classList.remove('open'));
      confirmDelete.addEventListener('click', onConfirmDelete);
      searchInventory.addEventListener('input', renderInventory);
      simulateOrderBtn.addEventListener('click', simulateNewOrder);
    }

    function renderAll(){ renderInventory(); renderOrders(); renderHistory(); updateCounts(); }

    function renderInventory(){
      const q = searchInventory.value.trim().toLowerCase();
      inventoryList.innerHTML = '';
      const list = inventory.filter(it => it.name.toLowerCase().includes(q) || (it.desc||'').toLowerCase().includes(q));
      if(list.length===0){ inventoryList.innerHTML = '<div class="muted">No items yet. Add your first menu item.</div>'; return }
      list.forEach(it =>{
        const div = document.createElement('div'); div.className='item-card';
        div.innerHTML = `
          <div class="item-top">
            <div class="thumb"><img src="${it.image||placeholderDataUrl(it.name)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:8px"/></div>
            <div style="flex:1">
              <div class="item-name">${escapeHtml(it.name)}</div>
              <div class="item-meta">₹ ${it.price.toFixed(2)} • <span class="muted">${escapeHtml(it.desc||'')}</span></div>
            </div>
            <div style="text-align:right">
              <div class="pill-qty">Qty: ${it.qty}</div>
              <div style="font-size:12px;margin-top:6px;color:${it.available? 'lightgreen':'#f87171'}">${it.available? 'Available':'Unavailable'}</div>
            </div>
          </div>
          <div class="item-actions">
            <button class="tiny-btn" data-action="edit" data-id="${it.id}">Edit</button>
            <button class="tiny-btn" data-action="delete" data-id="${it.id}">Delete</button>
          </div>
        `;
        inventoryList.appendChild(div);
      });


      inventoryList.querySelectorAll('[data-action="edit"]').forEach(btn=>btn.addEventListener('click', (e)=>{
        const id = e.currentTarget.dataset.id; openEditModal(id);
      }));
      inventoryList.querySelectorAll('[data-action="delete"]').forEach(btn=>btn.addEventListener('click', (e)=>{
        toDeleteId = e.currentTarget.dataset.id; confirmDeleteBackdrop.classList.add('open');
      }));
    }

    function renderOrders(){
      ordersList.innerHTML='';
      const active = orders.filter(o=> o.status !== 'Delivered');
      active.sort((a,b)=> b.time - a.time);
      if(active.length===0) ordersList.innerHTML='<div class="muted">No active orders</div>';
      active.forEach(o=>{
        const card = document.createElement('div'); card.className='order-card';
        const timeLabel = new Date(o.time).toLocaleTimeString();
        card.innerHTML = `
          <div class="order-top">
            <div>
              <div style="font-weight:600">Order #${o.id.slice(-5)}</div>
              <div class="order-meta">${escapeHtml(o.customer)} • ${escapeHtml(o.roll)} • ${timeLabel}</div>
            </div>
            <div>
              <div class="status-pill ${statusToClass(o.status)}">${o.status}</div>
            </div>
          </div>
          <div class="order-items">
            ${o.items.map(it=>`<div>${escapeHtml(it.name)} × ${it.qty}</div>`).join('')}
          </div>
          <div class="order-actions">
            <select data-id="${o.id}" class="status-select">
              <option ${o.status==='Pending'? 'selected':''}>Pending</option>
              <option ${o.status==='Preparing'? 'selected':''}>Preparing</option>
              <option ${o.status==='Ready'? 'selected':''}>Ready</option>
              <option ${o.status==='Out for Delivery'? 'selected':''}>Out for Delivery</option>
              <option ${o.status==='Delivered'? 'selected':''}>Delivered</option>
            </select>
            <button class="tiny-btn" data-action="markDelivered" data-id="${o.id}">Mark Delivered</button>
          </div>
        `;
        ordersList.appendChild(card);
      });

      ordersList.querySelectorAll('.status-select').forEach(sel=>sel.addEventListener('change', (e)=>{
        const id = e.target.dataset.id; const val = e.target.value; updateOrderStatus(id,val);
      }));
      ordersList.querySelectorAll('[data-action="markDelivered"]').forEach(b=>b.addEventListener('click',(e)=>{
        updateOrderStatus(e.currentTarget.dataset.id,'Delivered');
      }));

      updateCounts();
    }

    function renderHistory(){
      historyList.innerHTML='';
      const list = history.slice().sort((a,b)=> b.time - a.time);
      if(list.length===0) historyList.innerHTML='<div class="muted">No completed orders (yet)</div>';
      list.forEach(h=>{
        const row = document.createElement('div'); row.className='hist-row';
        row.innerHTML = `<div>${escapeHtml(h.customer)} • ${escapeHtml(h.roll)} <div class="muted" style="font-size:12px">${new Date(h.time).toLocaleString()}</div></div><div style="text-align:right">₹${orderTotal(h).toFixed(2)}<div class="muted" style="font-size:12px">Delivered</div></div>`;
        historyList.appendChild(row);
      })
      updateCounts();
    }

    function openAddModal(){
         editingId = null; 
         modalTitle.textContent='Add Item';
          itemForm.reset();
           imagePreview.textContent='No image';
            imagePreview.style.backgroundImage='none';
             itemModalBackdrop.classList.add('open');
             }
    function openEditModal(id){ 
        const it = inventory.find(i=>i.id===id);
         if(!it) return; 
         editingId=id; 
         modalTitle.textContent='Edit Item';
          itemName.value=it.name; 
          itemPrice.value=it.price;
           itemDesc.value=it.desc||'';
            itemQty.value=it.qty||0;
         imagePreview.innerHTML = `<img src="${it.image||placeholderDataUrl(it.name)}" style="width:100%;height:100%;object-fit:cover"/>`; itemModalBackdrop.classList.add('open'); }
    function closeItemModal(){
         itemModalBackdrop.classList.remove('open');
          editingId=null;
           itemForm.reset(); 
           imagePreview.innerHTML = 'No image'; 
        }

    function onImageSelect(e){
         const f = e.target.files[0];
          if(!f) return; const reader = new FileReader();
           reader.onload = (ev)=>{ imagePreview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover"/>`;
            imagePreview.dataset.data = ev.target.result; } ;
             reader.readAsDataURL(f);
             }

    function onSaveItem(e){ 
        e.preventDefault();
         const itm = {name:itemName.value.trim(), price: parseFloat(itemPrice.value)||0, desc:itemDesc.value.trim(), qty: parseInt(itemQty.value)||0};
      const img = imagePreview.dataset.data||'';
      if(editingId){
        const idx = inventory.findIndex(i=>i.id===editingId); if(idx===-1) return; inventory[idx] = {...inventory[idx], ...itm, image: img||inventory[idx].image};
      } else {
        inventory.unshift({...itm, id:genId(), image:img||'', available:true});
      }
      save(LS_KEYS.inventory, inventory); closeItemModal(); renderInventory();
    }

    function onConfirmDelete(){
         if(!toDeleteId) return; 
         inventory = inventory.filter(i=>i.id!==toDeleteId); 
         save(LS_KEYS.inventory, inventory);
          toDeleteId=null; 
          confirmDeleteBackdrop.classList.remove('open'); 
          renderInventory(); 
        }

    function updateOrderStatus(id, status){
         const idx = orders.findIndex(o=>o.id===id);
          if(idx===-1) return; 
          orders[idx].status = status;
           save(LS_KEYS.orders, orders); 
           if(status==='Delivered'){ 
            const delivered = orders.splice(idx,1)[0];
             delivered.status='Delivered'; 
             history.unshift(delivered); 
             save(LS_KEYS.history, history);
              save(LS_KEYS.orders, orders);
               renderOrders(); 
               renderHistory();
             } 
             else {
                 renderOrders(); 
                } }

    function orderTotal(o){ let total = 0; o.items.forEach(it=>{ const menu = inventory.find(m=>m.name===it.name); if(menu) total += (menu.price * it.qty); else total += (20*it.qty); }); return total; }

    function simulateNewOrder(){ 
      if(inventory.length===0) { alert('No menu items — add items first'); return }
      const cust = ['Asha','Karthik','Divya','Ramesh','Leela'][Math.floor(Math.random()*5)];
      const roll = Math.floor(20000+Math.random()*80000).toString().slice(0,6);
      const items = [];
      const picks = Math.max(1, Math.floor(Math.random()*2)+1);
      for(let i=0;i<picks;i++){
         const it = inventory[Math.floor(Math.random()*inventory.length)];
          items.push({name:it.name, qty: Math.floor(Math.random()*2)+1});
         }
      const ord = {id:genId(), customer:cust, roll:roll, items, time:Date.now(), status:'Pending'};
      orders.unshift(ord); save(LS_KEYS.orders, orders); renderOrders(); playAlert(); }

    function genId(){ 
        return Date.now().toString(36) + Math.random().toString(36).slice(2,7); 
    }
    function save(key, val){
         localStorage.setItem(key, JSON.stringify(val)); 
        }
    function load(key){ 
        try{ const v = localStorage.getItem(key); return v? JSON.parse(v): null } catch(e){ return null }
     }
    function escapeHtml(s){
         if(!s) return ''; return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
         }
    function placeholderDataUrl(text){
         const label = encodeURIComponent((text||'IMG').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()); const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%2308122a'/><text x='50%' y='50%' fill='%23ffffff' font-size='64' font-family='sans-serif' dominant-baseline='middle' text-anchor='middle'>${label}</text></svg>`; 
         return `data:image/svg+xml;utf8,${svg}`;
         }
    function statusToClass(s){ 
        if(s==='Pending') return 'status-pending';
         if(s==='Preparing') return 'status-prep'; 
         if(s==='Ready') return 'status-ready'; 
         if(s==='Delivered') return 'status-delivered';
        return '' }
    function updateCounts(){ 
        liveCount.textContent = orders.filter(o=>o.status!=='Delivered').length; 
        histCount.textContent = history.length;
    }
    function playAlert(){ 
        try{
             const ctx = new AudioContext();
              const o = ctx.createOscillator();
               const g = ctx.createGain(); 
               o.type='sine'; 
               o.frequency.value = 880; 
               g.gain.value = 0.02; 
               o.connect(g); 
               g.connect(ctx.destination);
                o.start();
                 setTimeout(()=>{
                     o.stop(); ctx.close()
                     }, 150); 
                    } 
                    catch(e){ /* ignore */ } }

    window.__trazy = {inventory, orders, history, save, load};
