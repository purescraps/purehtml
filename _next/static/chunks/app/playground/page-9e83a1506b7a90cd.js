(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[383],{65122:function(e,t,n){Promise.resolve().then(n.bind(n,29036)),Promise.resolve().then(n.bind(n,61870))},29036:function(e,t,n){"use strict";n.d(t,{AppLayout:function(){return m}});var r=n(5862),i=n(80850),o=n(51109),a=n(90824),c=n(88347),u=n(79645),l=n(7516),s=n(52337),d=n(94231);function f(e){let{children:t,href:n,...i}=e;return(0,r.jsx)(s.Anchor,{component:d.default,href:n,...i,children:t})}var h=n(25766);function p(e){let{href:t,...n}=e;return(0,r.jsx)(h.NavLink,{component:d.default,...n,href:t})}function m(e){let{children:t}=e,[n,{toggle:s}]=(0,u.useDisclosure)(),d=(0,l.usePathname)().endsWith("playground");return(0,r.jsx)(r.Fragment,{children:(0,r.jsxs)(i.AppShell,{header:{height:60},navbar:{width:300,breakpoint:"sm",collapsed:{mobile:!n,desktop:d||!1}},padding:"md",children:[(0,r.jsx)(i.AppShell.Header,{children:(0,r.jsxs)(o.Group,{h:"100%",px:{sm:"sm",md:"md"},gap:"sm",children:[(0,r.jsx)(a.Burger,{opened:n,onClick:s,hiddenFrom:"sm",size:"sm"}),(0,r.jsx)(f,{href:"/",size:"sm",children:(0,r.jsxs)(r.Fragment,{children:["PureHTML ",(0,r.jsx)(c.Code,{children:"Documentation"})]})}),(0,r.jsx)(f,{href:"/playground",pos:{sm:"relative",md:"absolute"},right:{sm:"",md:"1em"},size:"sm",children:"Playground"})]})}),(0,r.jsxs)(i.AppShell.Navbar,{p:"md",children:[(0,r.jsx)(p,{label:"Introduction",href:"/#intro"}),(0,r.jsx)(p,{label:"Getting Started",href:"/#getting-started"}),(0,r.jsx)(p,{label:"Basics",href:"/#basics"}),(0,r.jsx)(p,{label:"Constant Config",href:"/#constant-config"}),(0,r.jsx)(p,{label:"Arrays",href:"/#arrays"}),(0,r.jsx)(p,{label:"Objects",href:"/#objects"}),(0,r.jsx)(p,{label:"Transformers",href:"/#transformers"}),(0,r.jsx)(p,{label:"Union Config",href:"/#union-config"})]}),(0,r.jsx)(i.AppShell.Main,{children:t})]})})}},61870:function(e,t,n){"use strict";n.d(t,{Playground:function(){return ea}});var r,i,o=n(5862),a=n(88434),c=n(18237),u=n(85492),l=n(91775),s=n(81762),d=n(49474);function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?h(Object(n),!0).forEach(function(t){var r;r=n[t],t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):h(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function m(e){return function t(){for(var n=this,r=arguments.length,i=Array(r),o=0;o<r;o++)i[o]=arguments[o];return i.length>=e.length?e.apply(this,i):function(){for(var e=arguments.length,r=Array(e),o=0;o<e;o++)r[o]=arguments[o];return t.apply(n,[].concat(i,r))}}}function g(e){return({}).toString.call(e).includes("Object")}function v(e){return"function"==typeof e}var y=m(function(e,t){throw Error(e[t]||e.default)})({initialIsRequired:"initial state is required",initialType:"initial state should be an object",initialContent:"initial state shouldn't be an empty object",handlerType:"handler should be an object or a function",handlersType:"all handlers should be a functions",selectorType:"selector should be a function",changeType:"provided value of changes should be an object",changeField:'it seams you want to change a field in the state which is not specified in the "initial" state',default:"an unknown error accured in `state-local` package"}),b=function(e,t){return g(t)||y("changeType"),Object.keys(t).some(function(t){return!Object.prototype.hasOwnProperty.call(e,t)})&&y("changeField"),t},j=function(e){v(e)||y("selectorType")},x=function(e){v(e)||g(e)||y("handlerType"),g(e)&&Object.values(e).some(function(e){return!v(e)})&&y("handlersType")},M=function(e){e||y("initialIsRequired"),g(e)||y("initialType"),Object.keys(e).length||y("initialContent")};function w(e,t){return v(t)?t(e.current):t}function k(e,t){return e.current=p(p({},e.current),t),t}function O(e,t,n){return v(t)?t(e.current):Object.keys(n).forEach(function(n){var r;return null===(r=t[n])||void 0===r?void 0:r.call(t,e.current[n])}),n}(r=function(e,t){throw Error(e[t]||e.default)},function e(){for(var t=this,n=arguments.length,i=Array(n),o=0;o<n;o++)i[o]=arguments[o];return i.length>=r.length?r.apply(this,i):function(){for(var n=arguments.length,r=Array(n),o=0;o<n;o++)r[o]=arguments[o];return e.apply(t,[].concat(i,r))}})({configIsRequired:"the configuration object is required",configType:"the configuration object should be an object",default:"an unknown error accured in `@monaco-editor/loader` package",deprecation:"Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "});var S=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return t.reduceRight(function(e,t){return t(e)},e)}},E={type:"cancelation",msg:"operation is manually canceled"},P=function(e){var t=!1,n=new Promise(function(n,r){e.then(function(e){return t?r(E):n(e)}),e.catch(r)});return n.cancel=function(){return t=!0},n},A=function(e){if(Array.isArray(e))return e}(i=({create:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};M(e),x(t);var n={current:e},r=m(O)(n,t),i=m(k)(n),o=m(b)(e),a=m(w)(n);return[function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(e){return e};return j(e),e(n.current)},function(e){(function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return function(e){return t.reduceRight(function(e,t){return t(e)},e)}})(r,i,o,a)(e)}]}}).create({config:{paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"}},isInitialized:!1,resolve:null,reject:null,monaco:null}))||function(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,i=!1,o=void 0;try{for(var a,c=e[Symbol.iterator]();!(r=(a=c.next()).done)&&(n.push(a.value),2!==n.length);r=!0);}catch(e){i=!0,o=e}finally{try{r||null==c.return||c.return()}finally{if(i)throw o}}return n}}(i,2)||function(e,t){if(e){if("string"==typeof e)return f(e,2);var n=Object.prototype.toString.call(e).slice(8,-1);if("Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return f(e,2)}}(i,2)||function(){throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),C=A[0],R=A[1];function I(e){return document.body.appendChild(e)}function T(e){var t,n,r=C(function(e){return{config:e.config,reject:e.reject}}),i=(t="".concat(r.config.paths.vs,"/loader.js"),n=document.createElement("script"),t&&(n.src=t),n);return i.onload=function(){return e()},i.onerror=r.reject,i}function z(){var e=C(function(e){return{config:e.config,resolve:e.resolve,reject:e.reject}}),t=window.require;t.config(e.config),t(["vs/editor/editor.main"],function(t){L(t),e.resolve(t)},function(t){e.reject(t)})}function L(e){C().monaco||R({monaco:e})}var V=new Promise(function(e,t){return R({resolve:e,reject:t})}),D=function(){var e=C(function(e){return{monaco:e.monaco,isInitialized:e.isInitialized,resolve:e.resolve}});if(!e.isInitialized){if(R({isInitialized:!0}),e.monaco)return e.resolve(e.monaco),P(V);if(window.monaco&&window.monaco.editor)return L(window.monaco),e.resolve(window.monaco),P(V);S(I,T)(z)}return P(V)},N=n(67058),q={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},F={display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},G=function({children:e}){return N.createElement("div",{style:F},e)},_=(0,N.memo)(function({width:e,height:t,isEditorReady:n,loading:r,_ref:i,className:o,wrapperProps:a}){return N.createElement("section",{style:{...q.wrapper,width:e,height:t},...a},!n&&N.createElement(G,null,r),N.createElement("div",{ref:i,style:{...q.fullWidth,...!n&&q.hide},className:o}))}),B=function(e){(0,N.useEffect)(e,[])},H=function(e,t,n=!0){let r=(0,N.useRef)(!0);(0,N.useEffect)(r.current||!n?()=>{r.current=!1}:e,t)};function U(){}function J(e,t,n,r){return e.editor.getModel(W(e,r))||e.editor.createModel(t,n,r?W(e,r):void 0)}function W(e,t){return e.Uri.parse(t)}(0,N.memo)(function({original:e,modified:t,language:n,originalLanguage:r,modifiedLanguage:i,originalModelPath:o,modifiedModelPath:a,keepCurrentOriginalModel:c=!1,keepCurrentModifiedModel:u=!1,theme:l="light",loading:s="Loading...",options:d={},height:f="100%",width:h="100%",className:p,wrapperProps:m={},beforeMount:g=U,onMount:v=U}){let[y,b]=(0,N.useState)(!1),[j,x]=(0,N.useState)(!0),M=(0,N.useRef)(null),w=(0,N.useRef)(null),k=(0,N.useRef)(null),O=(0,N.useRef)(v),S=(0,N.useRef)(g),E=(0,N.useRef)(!1);B(()=>{let e=D();return e.then(e=>(w.current=e)&&x(!1)).catch(e=>e?.type!=="cancelation"&&console.error("Monaco initialization: error:",e)),()=>{let t;return M.current?(t=M.current?.getModel(),void(c||t?.original?.dispose(),u||t?.modified?.dispose(),M.current?.dispose())):e.cancel()}}),H(()=>{if(M.current&&w.current){let t=M.current.getOriginalEditor(),i=J(w.current,e||"",r||n||"text",o||"");i!==t.getModel()&&t.setModel(i)}},[o],y),H(()=>{if(M.current&&w.current){let e=M.current.getModifiedEditor(),r=J(w.current,t||"",i||n||"text",a||"");r!==e.getModel()&&e.setModel(r)}},[a],y),H(()=>{let e=M.current.getModifiedEditor();e.getOption(w.current.editor.EditorOption.readOnly)?e.setValue(t||""):t!==e.getValue()&&(e.executeEdits("",[{range:e.getModel().getFullModelRange(),text:t||"",forceMoveMarkers:!0}]),e.pushUndoStop())},[t],y),H(()=>{M.current?.getModel()?.original.setValue(e||"")},[e],y),H(()=>{let{original:e,modified:t}=M.current.getModel();w.current.editor.setModelLanguage(e,r||n||"text"),w.current.editor.setModelLanguage(t,i||n||"text")},[n,r,i],y),H(()=>{w.current?.editor.setTheme(l)},[l],y),H(()=>{M.current?.updateOptions(d)},[d],y);let P=(0,N.useCallback)(()=>{if(!w.current)return;S.current(w.current);let c=J(w.current,e||"",r||n||"text",o||""),u=J(w.current,t||"",i||n||"text",a||"");M.current?.setModel({original:c,modified:u})},[n,t,i,e,r,o,a]),A=(0,N.useCallback)(()=>{!E.current&&k.current&&(M.current=w.current.editor.createDiffEditor(k.current,{automaticLayout:!0,...d}),P(),w.current?.editor.setTheme(l),b(!0),E.current=!0)},[d,l,P]);return(0,N.useEffect)(()=>{y&&O.current(M.current,w.current)},[y]),(0,N.useEffect)(()=>{j||y||A()},[j,y,A]),N.createElement(_,{width:h,height:f,isEditorReady:y,loading:s,_ref:k,className:p,wrapperProps:m})});var Y=function(e){let t=(0,N.useRef)();return(0,N.useEffect)(()=>{t.current=e},[e]),t.current},Z=new Map,Q=(0,N.memo)(function({defaultValue:e,defaultLanguage:t,defaultPath:n,value:r,language:i,path:o,theme:a="light",line:c,loading:u="Loading...",options:l={},overrideServices:s={},saveViewState:d=!0,keepCurrentModel:f=!1,width:h="100%",height:p="100%",className:m,wrapperProps:g={},beforeMount:v=U,onMount:y=U,onChange:b,onValidate:j=U}){let[x,M]=(0,N.useState)(!1),[w,k]=(0,N.useState)(!0),O=(0,N.useRef)(null),S=(0,N.useRef)(null),E=(0,N.useRef)(null),P=(0,N.useRef)(y),A=(0,N.useRef)(v),C=(0,N.useRef)(),R=(0,N.useRef)(r),I=Y(o),T=(0,N.useRef)(!1),z=(0,N.useRef)(!1);B(()=>{let e=D();return e.then(e=>(O.current=e)&&k(!1)).catch(e=>e?.type!=="cancelation"&&console.error("Monaco initialization: error:",e)),()=>S.current?void(C.current?.dispose(),f?d&&Z.set(o,S.current.saveViewState()):S.current.getModel()?.dispose(),S.current.dispose()):e.cancel()}),H(()=>{let a=J(O.current,e||r||"",t||i||"",o||n||"");a!==S.current?.getModel()&&(d&&Z.set(I,S.current?.saveViewState()),S.current?.setModel(a),d&&S.current?.restoreViewState(Z.get(o)))},[o],x),H(()=>{S.current?.updateOptions(l)},[l],x),H(()=>{S.current&&void 0!==r&&(S.current.getOption(O.current.editor.EditorOption.readOnly)?S.current.setValue(r):r===S.current.getValue()||(z.current=!0,S.current.executeEdits("",[{range:S.current.getModel().getFullModelRange(),text:r,forceMoveMarkers:!0}]),S.current.pushUndoStop(),z.current=!1))},[r],x),H(()=>{let e=S.current?.getModel();e&&i&&O.current?.editor.setModelLanguage(e,i)},[i],x),H(()=>{void 0!==c&&S.current?.revealLine(c)},[c],x),H(()=>{O.current?.editor.setTheme(a)},[a],x);let L=(0,N.useCallback)(()=>{if(!(!E.current||!O.current)&&!T.current){A.current(O.current);let u=o||n,f=J(O.current,r||e||"",t||i||"",u||"");S.current=O.current?.editor.create(E.current,{model:f,automaticLayout:!0,...l},s),d&&S.current.restoreViewState(Z.get(u)),O.current.editor.setTheme(a),void 0!==c&&S.current.revealLine(c),M(!0),T.current=!0}},[e,t,n,r,i,o,l,s,d,a,c]);return(0,N.useEffect)(()=>{x&&P.current(S.current,O.current)},[x]),(0,N.useEffect)(()=>{w||x||L()},[w,x,L]),R.current=r,(0,N.useEffect)(()=>{x&&b&&(C.current?.dispose(),C.current=S.current?.onDidChangeModelContent(e=>{z.current||b(S.current.getValue(),e)}))},[x,b]),(0,N.useEffect)(()=>{if(x){let e=O.current.editor.onDidChangeMarkers(e=>{let t=S.current.getModel()?.uri;if(t&&e.find(e=>e.path===t.path)){let e=O.current.editor.getModelMarkers({resource:t});j?.(e)}});return()=>{e?.dispose()}}return()=>{}},[x,j]),N.createElement(_,{width:h,height:p,isEditorReady:x,loading:u,_ref:E,className:m,wrapperProps:g})}),X=n(84613),$=(0,X.Z)("outline","html","IconHtml",[["path",{d:"M13 16v-8l2 5l2 -5v8",key:"svg-0"}],["path",{d:"M1 16v-8",key:"svg-1"}],["path",{d:"M5 8v8",key:"svg-2"}],["path",{d:"M1 12h4",key:"svg-3"}],["path",{d:"M7 8h4",key:"svg-4"}],["path",{d:"M9 8v8",key:"svg-5"}],["path",{d:"M20 8v8h3",key:"svg-6"}]]),K=(0,X.Z)("outline","settings-automation","IconSettingsAutomation",[["path",{d:"M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z",key:"svg-0"}],["path",{d:"M10 9v6l5 -3z",key:"svg-1"}]]),ee=(0,X.Z)("outline","json","IconJson",[["path",{d:"M20 16v-8l3 8v-8",key:"svg-0"}],["path",{d:"M15 8a2 2 0 0 1 2 2v4a2 2 0 1 1 -4 0v-4a2 2 0 0 1 2 -2z",key:"svg-1"}],["path",{d:"M1 8h3v6.5a1.5 1.5 0 0 1 -3 0v-.5",key:"svg-2"}],["path",{d:"M7 15a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h1a1 1 0 0 1 1 1",key:"svg-3"}]]);let et=[{name:"Query Parameters",html:'<div>\n  <a href="https://google.com/search?q=example+query+parameter">Google</a>\n  <a href="https://duckduckgo.com/search?q=alternative+search+engines">DuckDuckGo</a>\n  <a href="https://startpage.com/search?q=privacy+matters">StartPage</a>\n  <a href="https://x.com/search?q=popular+today">X</a>\n</div>',config:"selector: a\ntype: array\nitems:\n  transform: [attr(href), urlQueryParam(q)]\n"},{name:"Person Details",html:'<div>\n  <span id="first-name">John</span>\n  <span data-kind="last-name">Doe</span>\n  <span details-age>\n  \n    42\n  \n  </span>\n\n  <!--\n    this user is not a premium member so the premium\n    membership badge does not appear in the HTML\n  -->\n  <!-- <span class="premium-member"> premium member badge </span> -->\n</div>',config:"selector: div\ntype: object\nproperties:\n  firstName:\n    selector: '#first-name'\n  lastName:\n    selector: span[data-kind=\"last-name\"]\n  age:\n    selector: span[details-age]\n    transform: [trim, number]\n  isPremiumMember:\n    selector: span.premium-member\n    transform: exists\n"}],en=[{name:"Simple",html:"<div>\n  <span>\n    Sample\n  </span>\n</div>",config:"selector: div span\ntransform: trim\n"},{name:"Attributes",html:'<div>\n  <div data-foo="foo"></div>\n  <div data-foo="bar"></div>\n  <div data-foo="baz"></div>\n</div>',config:"selector: div[data-foo]\ntype: array # tip: try removing this line\nitems:\n  transform: attr(data-foo)\n"}];function er(e){return{value:e.name,label:e.name}}let ei=function(e){var t,n;return null!==(n=null!==(t=en.find(t=>t.name===e))&&void 0!==t?t:et.find(t=>t.name===e))&&void 0!==n?n:null};var eo=n(82842);function ea(){let[e,t]=(0,N.useState)(en[0]),[n,r]=(0,N.useState)(""),[i,f]=(0,N.useState)(""),{configIsValid:h,result:p}=(0,eo.v)({inputHtml:i,configYaml:n});return(0,N.useEffect)(()=>{e&&(f(e.html),r(e.config))},[e]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.Grid,{children:(0,o.jsx)(a.Grid.Col,{span:{sm:12,md:3},children:(0,o.jsx)(c.Select,{label:"Select from the examples:",size:"sm",data:[{group:"Basics",items:en.map(er)},{group:"Advanced",items:et.map(er)}],onChange:e=>t(ei(e)),value:null==e?void 0:e.name})})}),(0,o.jsxs)(a.Grid,{children:[(0,o.jsx)(a.Grid.Col,{span:{sm:12,md:6},children:(0,o.jsxs)(u.Accordion,{multiple:!0,defaultValue:["html","config"],children:[(0,o.jsxs)(u.Accordion.Item,{value:"html",children:[(0,o.jsx)(u.Accordion.Control,{h:"2em",icon:(0,o.jsx)($,{}),children:"HTML"}),(0,o.jsx)(u.Accordion.Panel,{children:(0,o.jsx)(l.Paper,{shadow:"sm",pt:"sm",withBorder:!0,children:(0,o.jsx)(Q,{height:"25vh",language:"html",options:{formatOnType:!0,tabSize:2,insertSpaces:!0,minimap:{enabled:!1}},onChange:e=>f(null!=e?e:""),value:i})})})]}),(0,o.jsxs)(u.Accordion.Item,{value:"config",children:[(0,o.jsx)(u.Accordion.Control,{h:"2em",icon:(0,o.jsx)(K,{}),children:"Configuration"}),(0,o.jsx)(u.Accordion.Panel,{children:(0,o.jsxs)(l.Paper,{shadow:"sm",pt:"sm",withBorder:!0,children:[(0,o.jsx)(Q,{height:"30vh",language:"yaml",options:{formatOnType:!0,tabSize:2,insertSpaces:!0,minimap:{enabled:!1}},onChange:e=>r(null!=e?e:""),value:n}),!1===h&&(0,o.jsx)(s.Alert,{variant:"filled",color:"red",children:"Invalid config"})]})})]})]})}),(0,o.jsxs)(a.Grid.Col,{span:{sm:12,md:6},children:[(0,o.jsxs)(d.Title,{order:4,mb:"sm",children:[(0,o.jsx)(ee,{size:"1.1em"})," Result"]}),(0,o.jsx)(l.Paper,{shadow:"sm",pt:"sm",withBorder:!0,children:(0,o.jsx)(Q,{height:"50vh",language:"json",value:p,options:{formatOnType:!0,tabSize:2,insertSpaces:!0,readOnly:!0,minimap:{enabled:!1}}})})]})]})]})}},82842:function(e,t,n){"use strict";n.d(t,{v:function(){return o}});var r=n(71493),i=n(67058);function o(e){let{inputHtml:t,configYaml:n}=e,[o,a]=(0,i.useState)({configIsValid:!0,result:""}),[c,u]=(0,i.useState)(null);return(0,i.useEffect)(()=>{if(!n){a(e=>({...e,configIsValid:!0}));return}try{u(r.ConfigFactory.fromYAML(n)),a(e=>({...e,configIsValid:!0}))}catch(e){a(e=>({...e,configIsValid:!1}))}},[n]),(0,i.useEffect)(()=>{if(!c||!t){a(e=>({...e,result:""}));return}try{let e=JSON.stringify((0,r.extract)(t,c,"https://example.com"),null,"  ");a(t=>({...t,result:e}))}catch(e){a(e=>({...e,result:""}))}},[c,t]),o}}},function(e){e.O(0,[774,499,633,25,158,660,744],function(){return e(e.s=65122)}),_N_E=e.O()}]);