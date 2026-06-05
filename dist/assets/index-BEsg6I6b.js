(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}})();const _="http://localhost:3000",h="project-manager-projects",k=[{id:1,name:"Website Redesign",description:"Corporate website redesign and UX improvements.",status:"In Progress",assignedTo:2,createdAt:"2026-05-15"},{id:2,name:"Backend API Stabilization",description:"Refactor API error handling and performance.",status:"Pending",assignedTo:2,createdAt:"2026-05-18"},{id:3,name:"Deployment Pipeline",description:"Implement CI/CD for staging and production.",status:"Completed",assignedTo:1,createdAt:"2026-05-10"}];function m(e){return["Failed to fetch","NetworkError","ECONNREFUSED","Network request failed"].some(t=>e.message.includes(t))}function g(){const e=localStorage.getItem(h);if(e)try{return JSON.parse(e)}catch{localStorage.removeItem(h)}return localStorage.setItem(h,JSON.stringify(k)),[...k]}function $(e){return localStorage.setItem(h,JSON.stringify(e)),e}async function p(e,t={}){const r=await fetch(`${_}${e}`,{headers:{"Content-Type":"application/json"},...t});if(!r.ok){const a=await r.text();throw new Error(a||"Server error")}return r.json()}async function J(e,t){return(await p(`/users?email=${encodeURIComponent(e)}&password=${encodeURIComponent(t)}`))[0]||null}async function D(){try{return await p("/projects?_sort=id&_order=desc")}catch(e){if(m(e))return g().sort((t,r)=>r.id-t.id);throw e}}async function O(e){try{return await p(`/projects/${e}`)}catch(t){if(m(t))return g().find(r=>String(r.id)===String(e));throw t}}async function K(e){try{return await p("/projects",{method:"POST",body:JSON.stringify(e)})}catch(t){if(m(t)){const r=g(),a=r.reduce((n,s)=>Math.max(n,s.id),0)+1,o={...e,id:a};return r.unshift(o),$(r),o}throw t}}async function Y(e,t){try{return await p(`/projects/${e}`,{method:"PATCH",body:JSON.stringify(t)})}catch(r){if(m(r)){const a=g(),o=a.findIndex(s=>String(s.id)===String(e));if(o===-1)throw new Error("Project not found");const n={...a[o],...t};return a[o]=n,$(a),n}throw r}}async function F(e){try{return await p(`/projects/${e}`,{method:"DELETE"})}catch(t){if(m(t)){const r=g().filter(a=>String(a.id)!==String(e));return $(r),{success:!0}}throw t}}const P="project-manager-session",z=[{id:1,name:"Manager",email:"manager@test.com",password:"123456",role:"manager"},{id:2,name:"Collaborator",email:"user@test.com",password:"123456",role:"collaborator"}];function E(){const e=localStorage.getItem(P);return e?JSON.parse(e):null}function C(e){localStorage.setItem(P,JSON.stringify(e))}function W(){localStorage.removeItem(P)}function G(e){return["Failed to fetch","NetworkError","ECONNREFUSED","Network request failed"].some(t=>e.message.includes(t))}async function X(e,t){if(!e||!t)throw new Error("Please enter your email and password.");try{const r=await J(e,t);if(!r)throw new Error("Invalid credentials. Please try again.");return C(r),r}catch(r){if(G(r)){const a=z.find(o=>o.email===e&&o.password===t);if(a)return C(a),a}throw r}}const T=document.getElementById("app");let A;const B="project-manager-theme";function S(){return localStorage.getItem(B)||"light"}function R(e){document.body.classList.toggle("dark",e==="dark"),localStorage.setItem(B,e)}function Q(){const e=S()==="dark"?"light":"dark";return R(e),e}function I(e,t=""){T.innerHTML=`
    <main class="center-screen">
      <section class="card card--login">
        <div class="brand">
          <span class="brand-icon">P</span>
          <span>Project Manager</span>
        </div>
        <h1>Welcome back</h1>
        <p class="subtitle">Log in to manage projects, review team assignments, and update task status in a single dashboard.</p>
        ${t?`<div class="message message--info">${t}</div>`:""}
        <form id="login-form" class="form-grid">
          <label>Email<input type="email" name="email" placeholder="manager@test.com" required /></label>
          <label>Password<input type="password" name="password" placeholder="123456" required /></label>
          <button class="btn btn--primary" type="submit">Sign In</button>
        </form>
      </section>
    </main>
  `,document.getElementById("login-form").addEventListener("submit",r=>{r.preventDefault();const a=r.target,o=a.email.value.trim(),n=a.password.value.trim();e({email:o,password:n})})}function q(e,t,r){const a=S(),o=`
    <header class="topbar">
      <div>
        <span class="brand"><span class="brand-icon">P</span>Internal Project Manager</span>
        <span class="tag">${e.role.toUpperCase()}</span>
      </div>
      <nav class="topnav" aria-label="Main navigation">
        <button type="button" class="nav-link" data-route="dashboard">Dashboard</button>
        <button type="button" class="nav-link" data-route="projects">Projects</button>
        ${e.role==="manager"?'<button type="button" class="nav-link" data-route="projects/new">New project</button>':""}
        <button type="button" class="nav-link" id="theme-toggle">${a==="dark"?"Light mode":"Dark mode"}</button>
        <button type="button" class="nav-link" id="logout-btn">Logout</button>
      </nav>
    </header>
    <main id="page-content" class="page-content"></main>
  `;T.innerHTML=`<div class="app-shell">${o}</div>`,document.getElementById("logout-btn").addEventListener("click",t),document.getElementById("theme-toggle").addEventListener("click",()=>{const n=Q();document.getElementById("theme-toggle").textContent=n==="dark"?"Light mode":"Dark mode"}),document.querySelectorAll(".nav-link[data-route]").forEach(n=>{const s=n.dataset.route;n.addEventListener("click",i=>{i.preventDefault(),r(s)})})}function d(e){const t=document.getElementById("page-content");t&&(t.innerHTML=e)}function v(e="Loading..."){d(`<section class="loader">${e}</section>`)}function c(e,t="info"){const r=document.querySelector(".toast");r&&r.remove();const a=document.createElement("div");a.className=`toast toast--${t}`,a.textContent=e,document.body.appendChild(a),clearTimeout(A),A=setTimeout(()=>a.remove(),3500)}async function V({session:e,navigateTo:t}){v();try{const r=await D(),a=r.filter(i=>i.assignedTo===e.id),o=r.filter(i=>i.status==="In Progress"),n=r.filter(i=>i.status==="Completed"),s=e.role==="manager"?`
        <section class="dashboard-grid">
          <div class="stat-card"><h2>${r.length}</h2><p>Total projects</p></div>
          <div class="stat-card"><h2>${o.length}</h2><p>Active projects</p></div>
          <div class="stat-card"><h2>${n.length}</h2><p>Completed projects</p></div>
          <div class="welcome-card">
            <h2>Welcome, ${e.name}</h2>
            <p>Use the Projects view to manage deliveries and update team assignments.</p>
          </div>
        </section>
      `:`
        <section class="dashboard-grid">
          <div class="stat-card"><h2>${a.length}</h2><p>Assigned projects</p></div>
          <div class="list-card">
            <h3>Your project status</h3>
            <ul>
              ${a.map(i=>`<li><strong>${i.name}</strong> • ${i.status}</li>`).join("")}
            </ul>
          </div>
          <div class="welcome-card">
            <h2>Hello, ${e.name}</h2>
            <p>Review your assigned items and update progress when needed.</p>
          </div>
        </section>
      `;d(s)}catch{c("Unable to load metrics. Please try again.","error"),d('<section class="message message--error">Dashboard could not be loaded.</section>')}}const Z=["In Progress","Completed","Pending"];function ee(e,t){const r=t.role==="manager"?`<button class="btn btn--small" data-action="edit" data-id="${e.id}">Edit</button>
       <button class="btn btn--small btn--danger" data-action="delete" data-id="${e.id}">Delete</button>`:"";return`
    <article class="project-card">
      <div>
        <h3>${e.name}</h3>
        <p>${e.description}</p>
        <span class="chip">${e.status}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn--link" data-action="detail" data-id="${e.id}">Details</button>
        ${r}
      </div>
    </article>
  `}async function te({session:e,navigateTo:t}){v();try{const r=await D(),a=e.role==="manager"?r:r.filter(n=>n.assignedTo===e.id),o=a.reduce((n,s)=>(n[s.status]=(n[s.status]||0)+1,n),{});if(d(`
      <section>
        <div class="page-header">
          <div>
            <h1>Projects</h1>
            <p>${a.length} projects visible</p>
          </div>
          <div class="project-summary">
            <span>In Progress: ${o["In Progress"]||0}</span>
            <span>Completed: ${o.Completed||0}</span>
            <span>Pending: ${o.Pending||0}</span>
          </div>
        </div>
        ${e.role==="manager"?'<div class="page-actions"><button type="button" class="btn btn--secondary" data-route="projects/new" id="new-project-btn">Create project</button></div>':""}
        <div class="projects-grid">
          ${a.map(n=>ee(n,e)).join("")}
        </div>
      </section>
    `),re(e,t),e.role==="manager"){const n=document.getElementById("new-project-btn");n&&n.addEventListener("click",s=>{s.preventDefault(),t("projects/new")})}}catch{c("Could not load projects.","error"),d('<section class="message message--error">Projects are not available.</section>')}}function re(e,t){document.querySelectorAll('[data-action="detail"]').forEach(r=>{r.addEventListener("click",()=>t(`projects/detail/${r.dataset.id}`))}),document.querySelectorAll('[data-action="edit"]').forEach(r=>{r.addEventListener("click",()=>t(`projects/edit/${r.dataset.id}`))}),document.querySelectorAll('[data-action="delete"]').forEach(r=>{r.addEventListener("click",async()=>{confirm("Delete this project?")&&(await F(r.dataset.id),c("Project deleted successfully.","success"),t("projects"))})})}async function ne({session:e,navigateTo:t}){v();const r=window.location.hash.split("/")[3];try{const a=await O(r);if(e.role==="collaborator"&&a.assignedTo!==e.id){c("Access denied to this project.","error"),t("projects");return}const o=e.role==="manager"||a.assignedTo===e.id?'<button class="btn btn--primary" id="status-update">Update status</button>':"";d(`
      <section class="detail-card">
        <h2>${a.name}</h2>
        <p>${a.description}</p>
        <dl>
          <dt>Status</dt><dd>${a.status}</dd>
          <dt>Responsible ID</dt><dd>${a.assignedTo}</dd>
          <dt>Created</dt><dd>${a.createdAt}</dd>
        </dl>
        <div class="detail-actions">
          <button class="btn btn--secondary" id="back-btn">Back</button>
          ${o}
        </div>
      </section>
    `),document.getElementById("back-btn").addEventListener("click",()=>t("projects")),document.getElementById("status-update")&&document.getElementById("status-update").addEventListener("click",()=>t(`projects/edit/${a.id}`))}catch{c("Could not open project detail.","error"),t("projects")}}async function N({session:e,navigateTo:t}){v();const r=window.location.hash,a=r.includes("edit"),o=a?r.split("/")[3]:null;try{const n=a?await O(o):null,s=e.role==="manager";if(!(s||a&&(n==null?void 0:n.assignedTo)===e.id)){c("You cannot modify this project.","error"),t("projects");return}if(!a&&e.role!=="manager"){c("Only managers can create new projects.","error"),t("projects");return}const x=s?"":"readonly",M=s?"":"disabled",H=s?"":"readonly";d(`
      <section class="form-card">
        <h1>${a?"Edit project":"Create new project"}</h1>
        ${!s&&a?'<p class="form-note">Collaborator access: you may only update the project status for assigned items.</p>':""}
        <form id="project-form" class="form-grid">
          <label>Name<input name="name" type="text" value="${(n==null?void 0:n.name)||""}" ${s?"required":x} /></label>
          <label>Description<textarea name="description" rows="4" ${s?"required":H}>${(n==null?void 0:n.description)||""}</textarea></label>
          <label>Status
            <select name="status" required>
              ${Z.map(l=>`<option value="${l}" ${(n==null?void 0:n.status)===l?"selected":""}>${l}</option>`).join("")}
            </select>
          </label>
          <label>Responsible ID<input name="assignedTo" type="number" value="${(n==null?void 0:n.assignedTo)||""}" ${s?"required":M} /></label>
          <div class="form-actions">
            <button type="submit" class="btn btn--primary">${a?"Save":"Create"}</button>
            <button type="button" class="btn btn--secondary" id="cancel-btn">Cancel</button>
          </div>
        </form>
      </section>
    `),document.getElementById("cancel-btn").addEventListener("click",()=>t("projects")),document.getElementById("project-form").addEventListener("submit",async l=>{l.preventDefault();const f=l.target,u={status:f.status.value};s&&(u.name=f.name.value.trim(),u.description=f.description.value.trim(),u.assignedTo=Number(f.assignedTo.value),u.createdAt=(n==null?void 0:n.createdAt)||new Date().toLocaleDateString());try{a?(await Y(o,u),c("Project updated successfully.","success")):(await K({...u,createdAt:new Date().toLocaleDateString()}),c("Project created successfully.","success")),t("projects")}catch{c("Failed to save project. Please check the inputs.","error")}})}catch{c("Unable to load project form.","error"),t("projects")}}const ae={login:{render:null,private:!1},dashboard:{render:V,private:!0},projects:{render:te,private:!0},"projects/new":{render:N,private:!0,managerOnly:!0},"projects/edit":{render:N,private:!0},"projects/detail":{render:ne,private:!0}};function oe(e){const t=e.replace("#/","").replace(/^\/?/,"");if(!t)return"dashboard";const r=t.split("/");return r[0]==="projects"&&r[1]==="new"?"projects/new":r[0]==="projects"&&r[1]==="edit"?"projects/edit":r[0]==="projects"&&r[1]==="detail"?"projects/detail":r[0]}function b(e){const r=`#/${e.replace(/^\/+/g,"")}`;window.location.hash===r?window.dispatchEvent(new HashChangeEvent("hashchange")):window.location.hash=r}function U(e,t,r){window.addEventListener("hashchange",()=>w(e,r,t)),window.addEventListener("load",()=>w(e,r,t)),w(e,r,t)}async function w(e,t,r){const a=window.location.hash||"#/dashboard",o=oe(a),n=ae[o];if(!n){t("dashboard");return}if(o==="login"){E()&&t("dashboard");return}if(n.private&&!E()){c("Please log in to continue.","warning"),t("login");return}if(n.managerOnly&&e.role!=="manager"){c("Access denied: manager only.","error"),t("dashboard");return}await n.render({session:e,navigateTo:t,handleLogout:r})}const j=E();function se(){if(R(S()),!j){I(L);return}q(j,y,b),U(j,y,b)}async function L(e){try{const t=await X(e.email,e.password);q(t,y,b),U(t,y,b)}catch(t){I(L,t.message)}}function y(){W(),window.location.hash="#/login",I(L,"You have logged out successfully.")}se();
