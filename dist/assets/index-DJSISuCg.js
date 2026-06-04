(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(o){if(o.ep)return;o.ep=!0;const r=t(o);fetch(o.href,r)}})();const A="http://localhost:3000";async function l(e,n={}){const t=await fetch(`${A}${e}`,{headers:{"Content-Type":"application/json"},...n});if(!t.ok){const a=await t.text();throw new Error(a||"Server error")}return t.json()}async function O(e,n){return(await l(`/users?email=${encodeURIComponent(e)}&password=${encodeURIComponent(n)}`))[0]||null}async function E(){return l("/projects?_sort=id&_order=desc")}async function L(e){return l(`/projects/${e}`)}async function D(e){return l("/projects",{method:"POST",body:JSON.stringify(e)})}async function T(e,n){return l(`/projects/${e}`,{method:"PATCH",body:JSON.stringify(n)})}async function k(e){return l(`/projects/${e}`,{method:"DELETE"})}const y="project-manager-session";function b(){const e=localStorage.getItem(y);return e?JSON.parse(e):null}function N(e){localStorage.setItem(y,JSON.stringify(e))}function q(){localStorage.removeItem(y)}async function B(e,n){if(!e||!n)throw new Error("Please enter your email and password.");const t=await O(e,n);if(!t)throw new Error("Invalid credentials. Please try again.");return N(t),t}const I=document.getElementById("app");let $;function v(e,n=""){I.innerHTML=`
    <main class="center-screen">
      <section class="card card--login">
        <h1>Project Manager</h1>
        <p class="subtitle">Internal project dashboard for manager and collaborator roles.</p>
        ${n?`<div class="message message--info">${n}</div>`:""}
        <form id="login-form" class="form-grid">
          <label>Email<input type="email" name="email" placeholder="manager@test.com" required /></label>
          <label>Password<input type="password" name="password" placeholder="123456" required /></label>
          <button class="btn btn--primary" type="submit">Sign In</button>
        </form>
      </section>
    </main>
  `,document.getElementById("login-form").addEventListener("submit",t=>{t.preventDefault();const a=t.target,o=a.email.value.trim(),r=a.password.value.trim();e({email:o,password:r})})}function S(e,n,t){e!=null&&e.name;const a=`
    <header class="topbar">
      <div>
        <span class="brand">Internal Project Manager</span>
        <span class="tag">${e.role.toUpperCase()}</span>
      </div>
      <nav class="topnav">
        <button type="button" class="nav-link" data-route="dashboard">Dashboard</button>
        <button type="button" class="nav-link" data-route="projects">Projects</button>
        ${e.role==="manager"?'<button type="button" class="nav-link" data-route="projects/new">New project</button>':""}
        <button type="button" class="nav-link" id="logout-btn">Logout</button>
      </nav>
    </header>
    <main id="page-content" class="page-content"></main>
  `;I.innerHTML=`<div class="app-shell">${a}</div>`,document.getElementById("logout-btn").addEventListener("click",n),document.querySelectorAll(".nav-link").forEach(o=>{o.addEventListener("click",()=>t(o.dataset.route))})}function d(e){const n=document.getElementById("page-content");n&&(n.innerHTML=e)}function f(e="Loading..."){d(`<section class="loader">${e}</section>`)}function c(e,n="info"){const t=document.querySelector(".toast");t&&t.remove();const a=document.createElement("div");a.className=`toast toast--${n}`,a.textContent=e,document.body.appendChild(a),clearTimeout($),$=setTimeout(()=>a.remove(),3500)}async function U({session:e,navigateTo:n}){f();try{const t=await E(),a=t.filter(s=>s.assignedTo===e.id),o=t.filter(s=>s.status==="In Progress"),r=t.filter(s=>s.status==="Completed"),i=e.role==="manager"?`
        <section class="dashboard-grid">
          <div class="stat-card"><h2>${t.length}</h2><p>Total projects</p></div>
          <div class="stat-card"><h2>${o.length}</h2><p>Active projects</p></div>
          <div class="stat-card"><h2>${r.length}</h2><p>Completed projects</p></div>
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
              ${a.map(s=>`<li><strong>${s.name}</strong> • ${s.status}</li>`).join("")}
            </ul>
          </div>
          <div class="welcome-card">
            <h2>Hello, ${e.name}</h2>
            <p>Review your assigned items and update progress when needed.</p>
          </div>
        </section>
      `;d(i)}catch{c("Unable to load metrics. Please try again.","error"),d('<section class="message message--error">Dashboard could not be loaded.</section>')}}const R=["In Progress","Completed","Pending"];function x(e,n){const t=n.role==="manager"?`<button class="btn btn--small" data-action="edit" data-id="${e.id}">Edit</button>
       <button class="btn btn--small btn--danger" data-action="delete" data-id="${e.id}">Delete</button>`:"";return`
    <article class="project-card">
      <div>
        <h3>${e.name}</h3>
        <p>${e.description}</p>
        <span class="chip">${e.status}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn--link" data-action="detail" data-id="${e.id}">Details</button>
        ${t}
      </div>
    </article>
  `}async function H({session:e,navigateTo:n}){f();try{const t=await E(),a=e.role==="manager"?t:t.filter(r=>r.assignedTo===e.id),o=a.reduce((r,i)=>(r[i.status]=(r[i.status]||0)+1,r),{});d(`
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
        <div class="projects-grid">
          ${a.map(r=>x(r,e)).join("")}
        </div>
      </section>
    `),M(e,n)}catch{c("Could not load projects.","error"),d('<section class="message message--error">Projects are not available.</section>')}}function M(e,n){document.querySelectorAll('[data-action="detail"]').forEach(t=>{t.addEventListener("click",()=>n(`projects/detail/${t.dataset.id}`))}),document.querySelectorAll('[data-action="edit"]').forEach(t=>{t.addEventListener("click",()=>n(`projects/edit/${t.dataset.id}`))}),document.querySelectorAll('[data-action="delete"]').forEach(t=>{t.addEventListener("click",async()=>{confirm("Delete this project?")&&(await k(t.dataset.id),c("Project deleted successfully.","success"),n("projects"))})})}async function _({session:e,navigateTo:n}){f();const t=window.location.hash.split("/")[3];try{const a=await L(t);if(e.role==="collaborator"&&a.assignedTo!==e.id){c("Access denied to this project.","error"),n("projects");return}const o=e.role==="manager"||a.assignedTo===e.id?'<button class="btn btn--primary" id="status-update">Update status</button>':"";d(`
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
    `),document.getElementById("back-btn").addEventListener("click",()=>n("projects")),document.getElementById("status-update")&&document.getElementById("status-update").addEventListener("click",()=>n(`projects/edit/${a.id}`))}catch{c("Could not open project detail.","error"),n("projects")}}async function P({session:e,navigateTo:n}){f();const t=window.location.hash,a=t.includes("edit"),o=a?t.split("/")[3]:null;try{const r=a?await L(o):null,i=!a||e.role==="manager"||(r==null?void 0:r.assignedTo)===e.id;if(a&&!i){c("You cannot modify this project.","error"),n("projects");return}d(`
      <section class="form-card">
        <h1>${a?"Edit project":"Create new project"}</h1>
        <form id="project-form" class="form-grid">
          <label>Name<input name="name" type="text" value="${(r==null?void 0:r.name)||""}" required /></label>
          <label>Description<textarea name="description" rows="4" required>${(r==null?void 0:r.description)||""}</textarea></label>
          <label>Status
            <select name="status" required>
              ${R.map(s=>`<option value="${s}" ${(r==null?void 0:r.status)===s?"selected":""}>${s}</option>`).join("")}
            </select>
          </label>
          <label>Responsible ID<input name="assignedTo" type="number" value="${(r==null?void 0:r.assignedTo)||""}" required /></label>
          <div class="form-actions">
            <button type="submit" class="btn btn--primary">${a?"Save":"Create"}</button>
            <button type="button" class="btn btn--secondary" id="cancel-btn">Cancel</button>
          </div>
        </form>
      </section>
    `),document.getElementById("cancel-btn").addEventListener("click",()=>n("projects")),document.getElementById("project-form").addEventListener("submit",async s=>{s.preventDefault();const u=s.target,w={name:u.name.value.trim(),description:u.description.value.trim(),status:u.status.value,assignedTo:Number(u.assignedTo.value),createdAt:(r==null?void 0:r.createdAt)||new Date().toLocaleDateString()};try{a?(await T(o,w),c("Project updated successfully.","success")):(await D(w),c("Project created successfully.","success")),n("projects")}catch{c("Failed to save project. Please check the inputs.","error")}})}catch{c("Unable to load project form.","error"),n("projects")}}const J={login:{render:null,private:!1},dashboard:{render:U,private:!0},projects:{render:H,private:!0},"projects/new":{render:P,private:!0,managerOnly:!0},"projects/edit":{render:P,private:!0,managerOnly:!0},"projects/detail":{render:_,private:!0}};function Y(e){const n=e.replace("#/","").replace(/^\/?/,"");if(!n)return"dashboard";const t=n.split("/");return t[0]==="projects"&&t[1]==="new"?"projects/new":t[0]==="projects"&&t[1]==="edit"?"projects/edit":t[0]==="projects"&&t[1]==="detail"?"projects/detail":t[0]}function p(e){window.location.hash=`#/${e}`}function C(e,n,t){window.addEventListener("hashchange",()=>g(e,t)),window.addEventListener("load",()=>g(e,t)),g(e,t)}async function g(e,n){const t=window.location.hash||"#/dashboard",a=Y(t),o=J[a];if(!o){n("dashboard");return}if(a==="login"){b()&&n("dashboard");return}if(o.private&&!b()){c("Please log in to continue.","warning"),n("login");return}if(o.managerOnly&&e.role!=="manager"){c("Access denied: manager only.","error"),n("dashboard");return}await o.render({session:e,navigateTo:n,handleLogout})}const h=b();function K(){if(!h){v(j);return}S(h,m,p),C(h,m,p)}async function j(e){try{const n=await B(e.email,e.password);S(n,m,p),C(n,m,p)}catch(n){v(j,n.message)}}function m(){q(),window.location.hash="#/login",v(j,"You have logged out successfully.")}K();
